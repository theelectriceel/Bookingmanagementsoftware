"use client";
import React, { useState, useEffect, useCallback } from "react";
import { db, storage, auth } from "@/firebase";
import { useRouter } from "next/navigation";
import DocumentModal from "./component/DocumentModal";
import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import Router from "next/router";

export default function Panel() {
  const router = useRouter();

  // --- Auth states ---
  const [authChecked, setAuthChecked] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
  const [user, setUser] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

  const openModal = (app) => {
    setSelectedApp(app);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedApp(null);
    setModalOpen(false);
  };

  // --- Table / UI states ---
  const [inputState, setInputState] = useState("Apartments");
  const [data, setData] = useState([]);
  const [toggle, setToggle] = useState(false);
const [statusFilter, setStatusFilter] = useState("");
const [typeFilter, setTypeFilter] = useState("");

  // --- Modal form states ---
  const [flat, setFlat] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [existingStoragePath, setExistingStoragePath] = useState(null);

  // --- Carousel & Search ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // --- Loading state ---
  const [loading, setLoading] = useState(false);

  const toggleAddInterface = () => {
    setEditingId(null);
    setFlat("");
    setPrice("");
    setDescription("");
    setFile(null);
    setExistingStoragePath(null);
    setToggle(!toggle);
  };

  // --- Auth check ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
      else router.push("/login");
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, [router]);

  // --- Fetch Firestore docs ---
   
const fetchData = useCallback(async () => {
    const collectionName =
      inputState === "Review Applications" ? "ClientData" : inputState;

    const snapshot = await getDocs(collection(db, collectionName));
    setData(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  }, [inputState]); // <--- dependencies here

  useEffect(() => {
    if (user) fetchData();
  }, [user, fetchData]); // <--- correct

  // --- Remove doc & image ---
  const remove = async (id, storagePath) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, inputState, id));
      if (storagePath) await deleteObject(ref(storage, storagePath));
      alert("Deleted successfully");
      fetchData();
    } catch (err) {
      alert("Failed to delete: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Upload/update apartment ---
  const uploadFile = async () => {
    if (!flat) return alert("Enter flat number");
    try {
      setLoading(true);
      let downloadURL = null;
      let storagePath = existingStoragePath;

      if (file) {
        if (editingId && existingStoragePath) {
          await deleteObject(ref(storage, existingStoragePath));
        }
        storagePath = `apartments/${flat}-${file.name}`;
        const fileRef = ref(storage, storagePath);
        await uploadBytes(fileRef, file);
        downloadURL = await getDownloadURL(fileRef);
      }

      if (editingId) {
        await updateDoc(doc(db, inputState, editingId), {
          Flat: flat,
          Price: price,
          Description: description,
          ...(downloadURL
            ? { Image: downloadURL, StoragePath: storagePath }
            : {}),
        });
        alert("Update successful!");
      } else {
        if (!file) return alert("Select a file for new apartment");
        await addDoc(collection(db, inputState), {
          Flat: flat,
          Price: price,
          Description: description,
          Image: downloadURL,
          StoragePath: storagePath,
        });
        alert("Upload successful!");
      }

      setFlat("");
      setPrice("");
      setDescription("");
      setFile(null);
      setEditingId(null);
      setExistingStoragePath(null);
      setToggle(false);
      fetchData();
    } catch (err) {
      alert("Operation failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Open modal for editing ---
  const handleEdit = (doc) => {
    setFlat(doc.Flat);
    setPrice(doc.Price);
    setDescription(doc.Description);
    setExistingStoragePath(doc.StoragePath || null);
    setEditingId(doc.id);
    setToggle(true);
  };

  // --- Approve / Reject application ---
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setLoading(true);
      const docRef = doc(db, "ClientData", id);
      await updateDoc(docRef, { Status: newStatus });
      fetchData();
    } catch (err) {
      alert("Failed to update status: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Logout ---
  const handleLogout = async () => {
    await auth.signOut();
    router.push("/login");
  };

  if (!authChecked)
    return (
      <div className="flex h-screen animate-bounce items-center justify-center">
        Loading...
      </div>
    );

  // --- Filtered data ---
  const filteredData = searchQuery
    ? data.filter((item) =>
        inputState === "Apartments"
          ? item.Flat.toString() === searchQuery
          : item.unitId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.id?.toString() === (searchQuery)
      )
    : data;

  // --- Carousel slice ---
  const visibleData =
    inputState === "Apartments"
      ? filteredData.slice(currentIndex, currentIndex + 3)
      : filteredData;

  // --- Carousel nav ---
  const prev = () => setCurrentIndex((prev) => Math.max(prev - 3, 0));
  const next = () =>
    setCurrentIndex((prev) =>
      prev + 3 < filteredData.length ? prev + 3 : prev
    );

  return (
    <div className="flex h-screen relative bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 text-2xl font-bold text ">DJT Admin</div>
        <nav className="flex-1 px-4 space-y-2">
          {["Apartments", "Review Applications"].map((tab) => (
            <button
              key={tab}
              className={`${
                inputState === tab ? "bg-blue-300 transition" : ""
              } w-full text-left px-4 py-2 rounded font-bold text-white  hover:bg-blue-100`}
              onClick={() => setInputState(tab)}
              disabled={loading}
            >
              {tab}
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="m-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 border-4 border-red-700"
          disabled={loading}
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-4 relative">
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center text-white text-2xl">
            Processing...
          </div>
        )}

        {/* Apartments View */}
        {inputState === "Apartments" && (
          <div>
            <h1 className="text-3xl font-bold mb-4">Apartments</h1>
            <input
              type="number"
              placeholder="Search by flat number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4 w-1/3 px-3 py-2 border rounded"
              disabled={loading}
            />
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="w-full text-left table-auto">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-3">Flat Number</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3">Image</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleData.map((doc) => (
                    <tr key={doc.id}>
                      <td className="text-center">{doc.Flat}</td>
                      <td className="text-center">{doc.Price}</td>
                      <td className="text-center">{doc.Description}</td>
                      <td>
                        {doc.Image && (
                          <Image
                            src={doc.Image}
                            alt={doc.Description || "Listing image"}
                            className="object-cover m-4 rounded"
                            width={200}
                            height={60}
                          />
                        )}
                      </td>
                      <td className="space-x-2 m-4 p-4">
                        <button
                          className="p-4 bg-yellow-400 border-4 border-yellow-800 text-white font-bold rounded-xl"
                          onClick={() => handleEdit(doc)}
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button
                          className="p-4 font-bold bg-red-400 border-red-800 border-4 rounded-xl text-white"
                          onClick={() => remove(doc.id, doc.StoragePath)}
                          disabled={loading}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Carousel Nav */}
              <div className="flex justify-between p-4">
                <button
                  className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                  onClick={prev}
                  disabled={currentIndex === 0 || loading}
                >
                  Prev
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                  onClick={next}
                  disabled={currentIndex + 3 >= filteredData.length || loading}
                >
                  Next
                </button>
              </div>

              {/* Add/Edit Apartment Modal */}
              <div>
                <button
                  className="w-full text-center text-white bg-blue-400 rounded-full p-4 font-bold border-4 mt-4"
                  onClick={toggleAddInterface}
                  disabled={loading}
                >
                  {editingId ? "Edit Apartment?" : "Add Apartment?"}
                </button>

                <AnimatePresence>
                  {toggle && (
                    <>
                      <motion.div
                        key="backdrop"
                        className="fixed inset-0 bg-black z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setToggle(false)}
                      />
                      <motion.div
                        key="modal"
                        className="fixed inset-0 flex items-center justify-center z-50"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="bg-white rounded-xl shadow-lg p-6 w-96 max-w-full relative">
                          <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={() => setToggle(false)}
                            disabled={loading}
                          >
                            ✕
                          </button>
                          <h2 className="text-xl font-bold mb-4">
                            {editingId ? "Edit Apartment" : "Add New Apartment"}
                          </h2>
                          <form
                            className="space-y-3"
                            onSubmit={(e) => {
                              e.preventDefault();
                              uploadFile();
                            }}
                          >
                            <input
                              type="number"
                              placeholder="Flat Number"
                              value={flat}
                              onChange={(e) => setFlat(e.target.value)}
                              className="w-full border px-3 py-2 rounded"
                              disabled={loading}
                            />
                            <input
                              type="number"
                              placeholder="Price"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              className="w-full border px-3 py-2 rounded"
                              disabled={loading}
                            />
                            <textarea
                              placeholder="Description"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              className="w-full border px-3 py-2 rounded"
                              disabled={loading}
                            />
                            <input
                              type="file"
                              accept="image/png, image/jpeg"
                              onChange={(e) => setFile(e.target.files[0])}
                              className="border-4 bg-blue-100 rounded-xl p-2"
                              disabled={loading}
                            />
                            <button
                              type="submit"
                              className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                              disabled={loading}
                            >
                              {editingId ? "Update" : "Upload"}
                            </button>
                          </form>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {/* Review Applications View */}
        {inputState === "Review Applications" && (
          <div>
            <h1 className="text-3xl font-bold mb-4">Review Applications</h1>
            <input
              type="text"
              placeholder="Search by applicant name or flat number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4 w-1/3 px-3 py-2 border rounded"
              disabled={loading}
            />
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="w-full text-left table-auto">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3">Flat</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                  filteredData.map((app) =>  (
                    <tr key={app.id}>
                      <td className="px-6 py-3 font-semibold">
                        {app.role|| app.Applicant || "Application"}
                      </td>
                      <td className="px-6 py-3 font-semibold">{app.id}</td>
                      <td className="px-6 py-3">{app.unitId}</td>
                      <td className="px-6 py-3">
                        <span
  className={`px-2 py-1 text-sm rounded font-bold ${
    (app.Status || "Pending") === "Pending"
      ? "bg-yellow-200 text-yellow-800"
      : (app.Status || "Pending") === "Approved"
      ? "bg-green-200 text-green-800"
      : "bg-red-200 text-red-800"
  }`}
>
  {app.Status || "Pending"}
</span>
                      </td>
                      <td className="px-6 py-3 space-x-2">
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          onClick={() => openModal(app)}
                        >
                          View
                        </button>
                        <button
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          onClick={() => handleStatusUpdate(app.id, "Approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          onClick={() => handleStatusUpdate(app.id, "Rejected")}
                        >
                          Deny
                        </button>
                      </td>
                      <DocumentModal   visible={()=>modalOpen()} document={selectedApp} onClose={closeModal} />
                    </tr>
                    
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
