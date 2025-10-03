"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase"; // adjust path to your Firestore instance
import Image from "next/image";
import { Router, useRouter } from "next/router";

export default function FlatsGallery() {
  const router =useRouter()
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [Data, setData] = useState([]);
  const itemsPerPage = 5;

  // Fetch all flats once when component mounts
  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "Apartments"));
      const flats = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setData(flats);
    };
    fetchData();
  }, []);

  // Filter locally based on search term
  const filteredFlats = Data.filter(
    (flat) =>
      flat.Flat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flat.Description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredFlats.length / itemsPerPage);
  const visibleFlats = filteredFlats.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/DJT.jpg')",
            filter: "brightness(30%)",
          }}
        ></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-center h-full px-4">
          <h1 className="text-white text-5xl font-bold mb-4">
            Explore Our Flats
          </h1>
          <p className="text-white text-lg">
            Find your perfect home in The Dubai Jewel Tower
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="flex justify-center my-8 px-4">
        <input
          type="text"
          placeholder="Search by Flat Number or Description..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0); // reset page on new search
          }}
          className="w-full max-w-md p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
        />
      </section>

      {/* Flats Catalogue */}
      <section className="grid m-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 mb-6">
        {visibleFlats.length > 0 ? (
          visibleFlats.map((flat) => (
            <div
              key={flat.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow"
            >
              {/* Image */}
              <div onClick={() => router.push(`/flatsgallery/${flat.id}`)} className="h-80 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {flat.Image ? (
                  <Image
                    src={flat.Image}
                    alt={flat.Flat}
                    className="w-full h-full object-cover rounded-lg"
                    width={100}
                    height={100}
                  />
                ) : (
                  <span className="text-gray-500">No Image</span>
                )}
              </div>

              {/* Flat Number */}
              <h2 className="text-2xl font-bold mb-2">{flat.Flat}</h2>

              {/* Description */}
              <p className="text-gray-700 mb-2 truncate">{flat.Description}</p>

              {/* Price */}
              <p className="text-gray-900 font-semibold">{flat.Price}AED</p>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No flats found.
          </p>
        )}
      </section>

      {/* Carousel Navigator */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mb-12">
          <button
            onClick={handlePrev}
            disabled={page === 0}
            className="px-3 py-1 bg-gray-300 rounded-full disabled:opacity-50"
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx)}
              className={`w-4 h-4 rounded-full ${
                page === idx ? "bg-blue-500" : "bg-gray-300"
              }`}
            ></button>
          ))}

          <button
            onClick={handleNext}
            disabled={page === totalPages - 1}
            className="px-3 py-1 bg-gray-300 rounded-full disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}
