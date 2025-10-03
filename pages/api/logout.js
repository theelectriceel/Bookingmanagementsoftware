

export default function handler(req, res) {
  // Remove the auth cookie
  res.setHeader(
    "Set-Cookie",
    "auth=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict"
  );

  return res.status(200).json({ success: true });
}
