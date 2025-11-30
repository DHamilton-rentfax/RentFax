import { openai } from "@/lib/openai";

export async function detectFraud(idFront, idBack, ocr) {
  const prompt = `
  Detect signs of tampering, forged ID, mismatched fonts, misaligned holograms,
  inconsistent edges, blurry MRZ, or synthetic editing.
  Return array of fraud signals.
  `;

  const result = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: prompt },
      {
        role: "user",
        content: [
          { type: "image_url", image_url: idFront },
          { type: "image_url", image_url: idBack },
        ],
      },
    ],
  });

  return JSON.parse(result.choices[0].message.content);
}
