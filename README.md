# Gemini React Chatbot for Vercel

React + Vite chatbot using Gemini through a Vercel serverless function.

## Architecture
Browser (React) -> `/api/chat` -> Vercel Function -> Gemini API

The API key stays server-side in `process.env.GEMINI_API_KEY`. Do **not** use a `VITE_` prefix and do not commit `.env`.

## Local
1. Copy `.env.example` to `.env` and add your Gemini key.
2. `npm install`
3. `npm run dev` for the UI.
4. For local Vercel Functions, install Vercel CLI and run `vercel dev`.

## Vercel
Import the repository into Vercel, then Project -> Settings -> Environment Variables. Add `GEMINI_API_KEY` as a Secret for Production/Preview as needed, then redeploy.

## Customize
- `src/main.jsx`: UI and chat behavior
- `src/styles.css`: design
- `api/chat.js`: Gemini model and system instruction
