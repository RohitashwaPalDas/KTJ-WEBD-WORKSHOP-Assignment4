import axios from 'axios';

const GEMINI_API_KEY = "AIzaSyBwDD2sc3ogSdjFxAZQLokLRAqRMevYFgM";

async function testGemini(prompt) {
  try {
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
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
  }
}

testGemini("Summarize the history of the internet in 5 sentences.");
