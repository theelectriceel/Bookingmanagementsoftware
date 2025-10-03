"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/panel");
    });
    return () => unsub();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/panel");
    } catch (error) {
      console.error("Login error:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative h-screen flex justify-center items-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center Image"></div>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center space-y-8 bg-gradient-to-br from-white/90 to-gray-100/90 shadow-2xl rounded-3xl w-[90%] max-w-md p-10 border-2 backdrop-blur-md"
        style={{ borderColor: "#cabe9f" }}
      >
         <button onClick={() => router.push("/")} className="mr-auto -ml-4   w-8 h-8 font-bold text-white rounded-full ">
         ←
        </button>
        <Image src="/RockyLogo.png" alt="Rockyimage" width={200} height={40} />
        
        <h1 className="font-extrabold text-center text-4xl text-gray-900 tracking-wide drop-shadow-md">
          Management Login
        </h1>
       

        <form onSubmit={handleLogin} className="flex flex-col w-full space-y-6">
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-3 rounded-xl border focus:outline-none focus:ring-2"
            style={{
              borderColor: "#cabe9f",
              focusRing: "#cabe9f",
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-3 rounded-xl border focus:outline-none focus:ring-2"
            style={{
              borderColor: "#cabe9f",
              focusRing: "#cabe9f",
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="px-6 text-white py-3 font-bold rounded-xl shadow-lg transition duration-300 disabled:opacity-50"
            style={{
              background: "#cabe9f",
              color: "#000",
              border: "1px solid #b6a989",
            }}
          >
            <span className="text-white">{loading ? "Logging in..." : "Login"}</span>
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}

export default Login;
