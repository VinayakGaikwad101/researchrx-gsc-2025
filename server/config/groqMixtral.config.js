import dotenv from "dotenv";
import { ChatGroq } from "@langchain/groq";

dotenv.config();

export const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0,
  apiKey: process.env.GROQ_API_KEY,
});
