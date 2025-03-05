import dotenv from "dotenv";
import { ChatGroq } from "@langchain/groq";

dotenv.config();

export const model = new ChatGroq({
  model: "mixtral-8x7b-32768",
  temperature: 0,
  apiKey: process.env.GROQ_API_KEY,
});
