import axios from "axios";

export async function startIncodeSession(renterId: string) {
  const res = await axios.post("https://api.incode.com/v1/session", {
    clientId: process.env.INCODE_CLIENT_ID,
    secret: process.env.INCODE_SECRET,
    userId: renterId
  });

  return res.data.sessionId;
}
