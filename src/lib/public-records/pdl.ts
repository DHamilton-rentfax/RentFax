import axios from "axios";

const PDL_API_KEY = process.env.PDL_API_KEY!;
const PDL_ENDPOINT = process.env.PDL_BASE_URL || "https://api.peopledatalabs.com/v5/person/enrich";

if (!PDL_API_KEY) {
  console.error("❌ Missing PDL_API_KEY env variable.");
}

export async function fetchPDLProfile(query: {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
}) {
  try {
    const params: any = {
      api_key: PDL_API_KEY,
      first_name: query.firstName,
      last_name: query.lastName,
    };

    if (query.email) params.email = query.email;
    if (query.phone) params.phone = query.phone;
    if (query.address) params.street_address = query.address;

    const response = await axios.get(PDL_ENDPOINT, { params });
    return response.data;
  } catch (error: any) {
    console.error("PDL ERROR:", error?.response?.data || error);
    return null;
  }
}
