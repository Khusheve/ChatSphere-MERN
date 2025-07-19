import axios from "axios";

export const aiReply = async (req, res) => {
  try {
    const { prompt, history } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

        // Use Cohere API key from environment
    const cohereApiKey = process.env.COHERE_API_KEY;
    if (!cohereApiKey) {
      return res.status(500).json({ error: "Cohere API key not configured." });
    }

    // Cohere Chat API endpoint
    const cohereEndpoint = "https://api.cohere.ai/v1/chat";

    const cohereRes = await axios.post(
      cohereEndpoint,
      {
        message: prompt,
        model: "command-r-plus", // Or "command", "command-light" for free tier
        chat_history: history || [], // Always send chat history if provided
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${cohereApiKey}`
        }
      }
    );

    // Extract the AI reply from Cohere's response
    const aiMessage = cohereRes?.data?.text?.trim();
    if (!aiMessage) {
      return res.status(500).json({ error: "No response from Cohere AI." });
    }

    res.status(200).json({ reply: aiMessage });
  } catch (error) {
    console.error("AI Reply Error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to get AI response." });
  }
};
