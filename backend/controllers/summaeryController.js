import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import axios from 'axios';
import userModel from '../models/user.js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log(GEMINI_API_KEY);

async function getSummary(req, res) {
  try {
    const { userId, url } = req.body;
    const prompt = `
Summarize the news article from this URL into exactly 5 short bullet points.

- Only include confirmed and factual information.
- Do not add any introductory sentences like "Here's a summary..." etc.
- Start directly with the bullet points.

URL: ${url}
`;
    if (!userId) {
      return res.json({ success: false, message: "Not Logged In" });
    }

    const user = await userModel.findOne({ _id: userId });

    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    console.log("✅ Gemini Response:\n", text);

    res.json({ success: true, summary: text }); // <-- Fix here

  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message }); // <-- Fix here
  }
}



export {getSummary};