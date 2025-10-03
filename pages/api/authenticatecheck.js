import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Parse cookies from request headers
  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};

  // Check if the auth cookie exists and is valid
  if (cookies.auth === "authenticated") {
    // Allow access
    return res.status(200).json({ success: true, message: "Access granted" });
  } else {
    // Deny access
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
}
