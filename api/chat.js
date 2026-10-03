import { GoogleGenAI } from '@google/genai';
const MODEL = 'gemini-3.8-flash';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed.'});
  if (!process.env.GEMINI_API_KEY) return res.status(500).json({error:'GEMINI_API_KEY is not configured on the server.'});
  try {
    const {messages} = req.body ?? {};
    if (!Array.isArray(messages) || !messages.length) return res.status(400).json({error:'No chat messages were provided.'});
    const recent = messages.filter(m => m && (m.role === 'user' || m.role === 'model') && typeof m.text === 'string' && m.text.trim()).slice(-24);
    if (!recent.length) return res.status(400).json({error:'No valid chat messages were provided.'});
    const contents = recent.map(m => ({role:m.role, parts:[{text:m.text.trim()}]}));
    const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
    const response = await ai.models.generateContent({
      model: MODEL,
      contents,
      config: {systemInstruction:'You are a helpful, concise, friendly chatbot. Give clear answers, use markdown when useful, and do not claim to have access to private information unless it is provided in the conversation.'}
    });
    if (!response.text) return res.status(502).json({error:'Gemini returned an empty response.'});
    return res.status(200).json({message:{role:'model',text:response.text}});
  } catch (error) {
    console.error('Gemini request failed:', error);
    const message = error?.message?.includes('API key') || error?.message?.includes('PERMISSION') ? 'Gemini authentication failed. Check your GEMINI_API_KEY.' : 'Something went wrong while contacting Gemini. Please try again.';
    return res.status(500).json({error:message});
  }
}
