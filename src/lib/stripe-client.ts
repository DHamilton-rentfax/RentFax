import axios from "axios";

export async function purchaseIdentityCheck() {
  try {
    const res = await axios.post("/api/stripe/identity-check");
    return res.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function purchaseFullReport() {
  try {
    const res = await axios.post("/api/stripe/full-report");
    return res.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}
