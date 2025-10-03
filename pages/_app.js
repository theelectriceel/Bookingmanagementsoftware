// pages/_app.js
import "@/styles/globals.css";
import { GFS_Didot , Inter } from "next/font/google";

const inter = Inter({
  weight:["500"],
  subsets:["latin"],
  variable: "--font-inter"
})
const didot = GFS_Didot({
  weight: ["400"], // GFS Didot only has regular weight
  subsets: ["latin"],
  variable: "--font-didot",
});

export default function App({ Component, pageProps }) {
  return (
    <div className={inter.className}>
      <Component {...pageProps} />
    </div>
  );
}
