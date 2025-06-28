import geminiResponse from "../utils/gemini.js";
import moment from "moment";

export const askGemini = async (req, res) => {
  try {
    const user = req.user;
    const name = user.name;
    const assistantName = user.assistantName;
    const { prompt } = req.body;
    user.history.push(prompt);
    user.save()

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    console.log("Calling Gemini with:", { prompt, assistantName, name });

    const result = await geminiResponse(prompt, assistantName, name);
    console.log("Gemini raw result:", result);
    console.log("Result type:", typeof result);
    console.log("Result length:", result ? result.length : 0);

    if (!result) {
      return res.status(500).json({ message: "No response from Gemini" });
    }

    const jsonMatch = result.match(/{[\s\S]*}/);
    console.log("JSON match found:", !!jsonMatch);

    if (jsonMatch) {
      console.log("Matched JSON:", jsonMatch[0]);
    }

    if (!jsonMatch) {
      console.log("No JSON found in response, returning error");
      return res.status(200).json({ message: "Sorry I cannot understand you" });
    }

    try {
      const final = JSON.parse(jsonMatch[0]);
      console.log("Parsed JSON:", final);
      const type = final.type;
      console.log("Type:", type);

      switch (type) {
        case "get-date":
          return res.json({
            type,
            userInput: final.userInput,
            response: `Current Date Is ${moment().format("YYYY-MM-DD")}`,
          });

        case "get-time":
          return res.json({
            type,
            userInput: final.userInput,
            response: `Current Time Is ${moment().format("hh:mm A")}`,
          });

        case "get-day":
          return res.json({
            type,
            userInput: final.userInput,
            response: `Current Day Is ${moment().format("dddd")}`,
          });

        case "get-month":
          return res.json({
            type,
            userInput: final.userInput,
            response: `Current Month Is ${moment().format("MMMM")}`,
          });

        case "google-search":
        case "youtube-search":
        case "youtube-play":
        case "general":
        case "calculator-open":
        case "instagram-open":
        case "facebook-open":
        case "weather-show":
          return res.json({
            type,
            userInput: final.userInput,
            response: final.response,
          });
        default:
          console.log("Unknown type:", type);
          return res
            .status(500)
            .json({ message: "Sorry I cannot understand you" });
      }
    } catch (parseError) {
      console.log("JSON parse error:", parseError);
      return res.status(500).json({ message: "Error parsing Gemini response" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
