import 'dotenv/config'

import {GoogleGenAI} from '@google/genai';
import ollama from 'ollama'

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

export const generateResumeFromGemini = async (prompt)=>{
const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-001',
    contents: 'Why is the sky blue?',
    temperature:0,
    max_tokens : 10
  });
//   console.log(response.text);
return response.text

}

export  const generateResumeFromOllama = async(prompt, userData)=>{
const response = await ollama.chat({
  model: 'llama3.1',
  messages: [{ role: 'user', content: prompt(userData) }],
})
// console.log(response.message.content) 
return response.message.content
}

