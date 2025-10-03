"use client";
import { useRouter } from "next/router";  // <-- from pages router
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Image from "next/image";

export default function FlatDetails() {
  const router = useRouter();
  const { id } = router.query;   // ✅ get [id] from URL
  const [flat, setFlat] = useState(null);

  useEffect(() => {
    if (!id) return; // wait until router is ready
    const fetchFlat = async () => {
      const docRef = doc(db, "Apartments", id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setFlat({ id: snapshot.id, ...snapshot.data() });
      }
    };
    fetchFlat();
  }, [id]);

  if (!flat) {
    return <p className="text-center mt-20">Loading flat details...</p>;
  }

  return (
    <div className="min-h-screen min-w-full md:min-w-3xs mx-auto  lg:mx-40 my-2 overflow-y-hidden flex flex-col">
      {/* Back Button */}
      <div className="p-4">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-white font-bold bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          ← Back
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col m-4 lg:flex-row flex-1 border-4 p-4 rounded-lg">
        {/* Left - Image */}
        <div className="flex-1 relative  aspect-square h-[800px] lg:h-auto">
          {flat.Image ? (
            <Image
              src={flat.Image}
              alt={flat.Flat}
              fill
              className="object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* Right - Details */}
        <div className="flex-1 p-8 flex flex-col gap-6">
          <h1 className="text-4xl text font-bold">{flat.Flat}</h1>
          <p className="text-lg text-gray-700">{flat.Description}</p>
          <p className="text-2xl font-semibold text-green-600">
            {flat.Price} AED
          </p>

          {/* Booking Section */}
          <div className="mt-8 border-t pt-6 ">
            <h2 className="text-2xl font-bold mb-4">Book this flat</h2>
            <p className="text-gray-600 mb-4">Book as a:</p>
            <div className="flex gap-4">
              <button onClick={()=>{
                router.push({
          pathname: "/flatsgallery/client",
          query: { id: flat.Flat, role: "Client" },
        })
              }} className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600">
                Client
              </button>
              <button onClick={()=>{
                router.push({
          pathname: "/flatsgallery/broker",
          query: { id: flat.Flat, role: "Broker" }
                  })}}  className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600">
                Broker
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
