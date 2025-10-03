"use client";
import React from "react";
import { motion } from "framer-motion"; 
import { useRouter } from "next/navigation";
import Image from "next/image";

function Home() {
  const router = useRouter();


  

  // Reusable button styles
  const buttonClass =
    "px-8 py-4 bg-[#cabe9f] shadow-xl rounded-2xl font-bold shadow-md text-white hover:from-blue-500 hover:to-blue-700 transition-all duration-300";

  return (
    <section className="relative h-screen flex justify-center items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 bg-cover bg-center Image"></div>

      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex justify-center flex-col items-center relative z-10 space-y-8 bg-white shadow-2xl rounded-3xl w-[80%] max-w-3xl p-8 border-4 border-white/40 backdrop-blur-sm"
      >
        <Image
          src="/RockyLogo.png"
          alt="Rockyimage"
          width={200}
          height={40}
        />
        <h1 className="font-extrabold text-center text-6xl text-black drop-shadow-sm tracking-wide">
          DJT Booking
        </h1>

        {/* Uniform Buttons */}
        <div className="flex flex-col  tracking-widest space-y-6 w-full">
          {[
            { label: "Explore the Flats and Book" , action:()=> router.push('/flatsgallery') },
            {
              label: "Management",
              action: () => router.push("/login"),
            },
          ].map((btn, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={buttonClass}
              onClick={btn.action || undefined}
            >
              {btn.label}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
import { Fragment_Mono } from "next/font/google";

export default Home;
