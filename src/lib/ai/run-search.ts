import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function runAI(body: any) {
    const {
        firstName,
        lastName,
        email,
        phone,
        dob,
        address,
        licenseNumber,
        licenseType,
        firestoreMatches,
      } = body;

    const fullName = `${firstName} ${lastName}`.trim();

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      You are an identity-matching engine for rental applications.
      Compare the following submitted renter details against the database results.
      Return:
      - A match score (0–100)
      - A risk flag
      - Possible duplicate records
      - Explanation for the landlord
      
      INPUT:
      Name: ${fullName}
      Email: ${email}
      Phone: ${phone}
      DOB: ${dob}
      Address: ${address}
      License: ${licenseNumber} (${licenseType})

      DATABASE MATCHES:
      ${JSON.stringify(firestoreMatches, null, 2)}
    `;

    const aiResponse = await model.generateContent(prompt);
    const aiText = aiResponse.response.text();

    // Extract score (if provided)
    const matchScore = (() => {
        const scoreMatch = aiText.match(/score[:\s]+(\d{1,3})/i);
        return scoreMatch ? Number(scoreMatch[1]) : null;
    })();

    return {
        matchScore,
        flagged: aiText.toLowerCase().includes("risk"),
        ...body
    }

}