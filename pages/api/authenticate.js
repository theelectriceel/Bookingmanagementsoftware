export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, password } = req.body; // In pages router, body is parsed automatically

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // Set an HttpOnly cookie
    res.setHeader(
      "Set-Cookie",
      "auth=authenticated; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict"
    );

    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ success: false });
}
