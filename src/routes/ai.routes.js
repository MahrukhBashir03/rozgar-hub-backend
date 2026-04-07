// // // const express = require("express");
// // // const router = express.Router();
// // // const multer = require("multer");

// // // const { handleVoice } = require("../controllers/ai.controller");

// // // const upload = multer({ dest: "uploads/" });

// // // router.post("/voice", upload.single("audio"), handleVoice);

// // // module.exports = router;

// // // router.post("/generate-description", async (req, res) => {
// // //   const { category, title, location, budget, lang } = req.body;
// // //   const isUrdu = lang === "ur";
// // //   const prompt = isUrdu
// // //     ? `آپ ایک پاکستانی بلیو کالر جاب پورٹل RozgarHub کے لیے نوکری کی تفصیل لکھتے ہیں۔\nنوکری کی قسم: ${category}\nعنوان: ${title || category}\nمقام: ${location || "پاکستان"}\nبجٹ: روپے ${budget || "قابل گفتگو"}\nصرف 2-3 جملوں میں سادہ اردو میں تفصیل لکھیں۔ صرف تفصیل لکھیں، کچھ اور نہیں۔`
// // //     : `Write a short job description in 2-3 sentences for a Pakistani blue-collar job posting on RozgarHub app.\nJob Category: ${category}\nJob Title: ${title || category}\nLocation: ${location || "Pakistan"}\nBudget: Rs. ${budget || "negotiable"}\nWrite in simple English. Be specific and professional. Only return the description text, nothing else.`;
// // //   try {
// // //     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
// // //       method: "POST",
// // //       headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
// // //       body: JSON.stringify({
// // //         model: "llama-3.1-8b-instant", max_tokens: 200,
// // //         messages: [
// // //           { role: "system", content: isUrdu ? "آپ پاکستانی بلیو کالر ورکرز کے لیے اردو میں نوکری کی تفصیل لکھتے ہیں۔ صرف تفصیل لکھیں۔" : "You write short job descriptions for Pakistani blue-collar workers. Always respond with only the description text, no extra words, no formatting." },
// // //           { role: "user", content: prompt }
// // //         ]
// // //       })
// // //     });
// // //     const data = await response.json();
// // //     const text = data?.choices?.[0]?.message?.content;
// // //     if (!text) return res.status(500).json({ error: "AI ne kuch generate nahi kiya", raw: data });
// // //     res.json({ description: text.trim() });
// // //   } catch (err) {
// // //     console.error("Groq Error:", err.message);
// // //     res.status(500).json({ error: err.message });
// // //   }
// // // });

// // // // ─── Smart Job Description Auto-Fill ─────────────────────────────────────────
// // // router.post("/parse-job", async (req, res) => {
// // //   const { description } = req.body;
// // //   if (!description) return res.status(400).json({ error: "Description required" });
// // //   const prompt = `You are a job parser for RozgarHub, a Pakistani blue-collar job portal.\nExtract information from this job description and return ONLY valid JSON, nothing else.\n\nJob description: "${description}"\n\nReturn exactly this format:\n{\n  "skills": ["skill1", "skill2"],\n  "budget_estimate": "PKR range per day",\n  "urgency": "low | medium | high",\n  "category": "job category in one word",\n  "location": "city or area name, or empty string if not mentioned"\n}`;
// // //   try {
// // //     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
// // //       method: "POST",
// // //       headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
// // //       body: JSON.stringify({
// // //         model: "llama-3.1-8b-instant", max_tokens: 200,
// // //         messages: [
// // //           { role: "system", content: "You are a JSON extractor. You only return valid JSON. No explanation, no markdown, no extra text." },
// // //           { role: "user", content: prompt }
// // //         ]
// // //       })
// // //     });
// // //     const data = await response.json();
// // //     const text = data?.choices?.[0]?.message?.content;
// // //     if (!text) return res.status(500).json({ error: "AI ne kuch return nahi kiya", raw: data });
// // //     const parsed = JSON.parse(text.trim());
// // //     res.json(parsed);
// // //   } catch (err) {
// // //     console.error("Parse-job Error:", err.message);
// // //     res.status(500).json({ error: err.message });
// // //   }
// // // });

// // // // ─── AI Smart Job Filter ──────────────────────────────────────────────────────
// // // router.post("/smart-filter", async (req, res) => {
// // //   const { query } = req.body;
// // //   if (!query) return res.status(400).json({ error: "Query required" });
// // //   const prompt = `You are a job search filter extractor for RozgarHub, a Pakistani blue-collar job portal.\nA worker typed this search query: "${query}"\n\nExtract filter criteria and return ONLY valid JSON, nothing else.\n\nReturn exactly this format:\n{\n  "category": "one of: electrician | plumber | carpenter | painter | cleaner | driver | mason | welder | or empty string if not mentioned",\n  "location": "city or area name in Pakistan, or empty string if not mentioned",\n  "minBudget": 0,\n  "maxBudget": 0,\n  "urgency": "one of: 1_hour | today | this_week | flexible | or empty string if not mentioned",\n  "keywords": ["any other relevant keywords to match in job title or description"]\n}\n\nRules:\n- If worker says "urgent" or "jaldi" set urgency to 1_hour.\n- If worker says "aaj" or "today" set urgency to today.\n- If worker says "is hafte" or "this week" set urgency to this_week.`;
// // //   try {
// // //     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
// // //       method: "POST",
// // //       headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
// // //       body: JSON.stringify({
// // //         model: "llama-3.1-8b-instant", max_tokens: 300,
// // //         messages: [
// // //           { role: "system", content: "You are a JSON extractor for a Pakistani job portal. You only return valid JSON. No explanation, no markdown, no extra text." },
// // //           { role: "user", content: prompt }
// // //         ]
// // //       })
// // //     });
// // //     const data = await response.json();
// // //     const text = data?.choices?.[0]?.message?.content;
// // //     if (!text) return res.status(500).json({ error: "AI ne kuch return nahi kiya", raw: data });
// // //     const parsed = JSON.parse(text.trim());
// // //     res.json(parsed);
// // //   } catch (err) {
// // //     console.error("Smart-filter Error:", err.message);
// // //     res.status(500).json({ error: err.message });
// // //   }
// // // });

// // // // ─── AI Worker Reliability Score (P-WRS) ─────────────────────────────────────
// // // router.post("/worker-score", async (req, res) => {
// // //   const { workerId, name, category, rating = 0, totalJobs = 0, completedJobs = 0, responseTimeMinutes = 60, isVerified = false, profileComplete = false } = req.body;
// // //   if (!workerId) return res.status(400).json({ error: "workerId required" });

// // //   const profileScore    = profileComplete ? 25 : 10;
// // //   const verifiedScore   = isVerified ? 25 : 0;
// // //   const ratingScore     = Math.round((rating / 5) * 20);
// // //   const completionRate  = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;
// // //   const completionScore = Math.round((completionRate / 100) * 20);
// // //   let responseScore = 10;
// // //   if (responseTimeMinutes > 60)  responseScore = 5;
// // //   if (responseTimeMinutes > 120) responseScore = 2;
// // //   if (responseTimeMinutes > 240) responseScore = 0;
// // //   const finalScore = Math.min(100, Math.max(0, profileScore + verifiedScore + ratingScore + completionScore + responseScore));

// // //   let label, labelUr, color;
// // //   if (finalScore >= 80)      { label = "Highly Reliable"; labelUr = "انتہائی قابل اعتماد"; color = "#16a34a"; }
// // //   else if (finalScore >= 60) { label = "Reliable";        labelUr = "قابل اعتماد";         color = "#2563eb"; }
// // //   else if (finalScore >= 40) { label = "Moderate";        labelUr = "درمیانہ";             color = "#d97706"; }
// // //   else                       { label = "New Worker";      labelUr = "نیا ورکر";            color = "#6b7280"; }

// // //   let explanation = "";
// // //   try {
// // //     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
// // //       method: "POST",
// // //       headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
// // //       body: JSON.stringify({
// // //         model: "llama-3.1-8b-instant", max_tokens: 100,
// // //         messages: [
// // //           { role: "system", content: "You write short, honest, encouraging reliability summaries for blue-collar workers. Only return the explanation text." },
// // //           { role: "user", content: `Worker: ${name}, Category: ${category}, P-WRS Score: ${finalScore}/100, Rating: ${rating}/5, Jobs Completed: ${completedJobs}/${totalJobs}, CNIC Verified: ${isVerified ? "Yes" : "No"}. Write a 1-2 sentence explanation.` }
// // //         ]
// // //       })
// // //     });
// // //     const data = await response.json();
// // //     explanation = data?.choices?.[0]?.message?.content?.trim() || "";
// // //   } catch (_) {}

// // //   res.json({ workerId, score: finalScore, label, labelUr, color, explanation, breakdown: { profileScore, verifiedScore, ratingScore, completionScore, responseScore } });
// // // });

// // // // ─── AI Smart Pricing Suggestion ─────────────────────────────────────────────
// // // // POST /api/ai/price-suggestion
// // // // Body: { category, location, offeredPrice, lang }

// // // // ── Pakistani market rates (PKR per day) ──
// // // const MARKET_RATES = {
// // //   electrician: { min: 1500, max: 3000 },
// // //   plumber:     { min: 1200, max: 2500 },
// // //   carpenter:   { min: 1500, max: 3500 },
// // //   painter:     { min: 1000, max: 2500 },
// // //   cleaner:     { min: 800,  max: 1800 },
// // //   driver:      { min: 1500, max: 3000 },
// // //   mason:       { min: 1500, max: 3000 },
// // //   welder:      { min: 2000, max: 4000 },
// // // };

// // // // City multipliers — bigger cities = higher rates
// // // const CITY_MULTIPLIERS = {
// // //   karachi:    1.2,
// // //   lahore:     1.15,
// // //   islamabad:  1.25,
// // //   rawalpindi: 1.1,
// // //   peshawar:   0.95,
// // //   quetta:     0.9,
// // //   faisalabad: 1.0,
// // //   multan:     0.95,
// // //   default:    1.0,
// // // };

// // // router.post("/price-suggestion", async (req, res) => {
// // //   const { category, location, offeredPrice, lang } = req.body;

// // //   if (!category) return res.status(400).json({ error: "Category required" });

// // //   // ── Get base market rate ──
// // //   const baseRate = MARKET_RATES[category?.toLowerCase()] || { min: 1000, max: 2500 };

// // //   // ── Apply city multiplier ──
// // //   const locationLower = (location || "").toLowerCase();
// // //   let multiplier = CITY_MULTIPLIERS.default;
// // //   for (const [city, mult] of Object.entries(CITY_MULTIPLIERS)) {
// // //     if (city !== "default" && locationLower.includes(city)) {
// // //       multiplier = mult;
// // //       break;
// // //     }
// // //   }

// // //   const minRate = Math.round(baseRate.min * multiplier);
// // //   const maxRate = Math.round(baseRate.max * multiplier);

// // //   // ── Calculate assessment mathematically — NOT by AI ──
// // //   const offered = Number(offeredPrice) || 0;
// // //   let assessment;
// // //   if (offered === 0) {
// // //     assessment = "not_specified";
// // //   } else if (offered < minRate * 0.85) {
// // //     // More than 15% below min → LOW
// // //     assessment = "low";
// // //   } else if (offered > maxRate * 1.15) {
// // //     // More than 15% above max → HIGH
// // //     assessment = "high";
// // //   } else {
// // //     // Within range (including 15% buffer) → FAIR
// // //     assessment = "fair";
// // //   }

// // //   // ── Get AI tip (short sentence only, not assessment) ──
// // //   const tipPrompt = `Pakistani job portal RozgarHub. Employer offering Rs.${offered}/day for a ${category} in ${location || "Pakistan"}. Market rate is Rs.${minRate}-${maxRate}/day. Assessment: ${assessment}. Write ONE short tip in English under 12 words. Only return the tip text, nothing else.`;

// // //   let tipEn = "";
// // //   let tipUr = "";
// // //   try {
// // //     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
// // //       method: "POST",
// // //       headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
// // //       body: JSON.stringify({
// // //         model: "llama-3.1-8b-instant", max_tokens: 60,
// // //         messages: [
// // //           { role: "system", content: "You write very short pricing tips for Pakistani employers. Only return the tip text, under 12 words." },
// // //           { role: "user", content: tipPrompt }
// // //         ]
// // //       })
// // //     });
// // //     const data = await response.json();
// // //     tipEn = data?.choices?.[0]?.message?.content?.trim() || "";

// // //     // Urdu tip
// // //     if (lang === "ur" && tipEn) {
// // //       const urResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
// // //         body: JSON.stringify({
// // //           model: "llama-3.1-8b-instant", max_tokens: 80,
// // //           messages: [
// // //             { role: "system", content: "Translate to simple Urdu. Only return the translation." },
// // //             { role: "user", content: tipEn }
// // //           ]
// // //         })
// // //       });
// // //       const urData = await urResponse.json();
// // //       tipUr = urData?.choices?.[0]?.message?.content?.trim() || tipEn;
// // //     }
// // //   } catch (_) {
// // //     // Fallback tips if AI fails
// // //     const fallbacks = {
// // //       low:           { en: "Consider raising your budget to attract more workers.", ur: "زیادہ کارکن پانے کے لیے بجٹ بڑھائیں۔" },
// // //       fair:          { en: "Great offer! Workers are likely to respond quickly.",   ur: "اچھی پیشکش! کارکن جلدی جواب دیں گے۔" },
// // //       high:          { en: "Above market rate — expect faster responses.",          ur: "مارکیٹ سے زیادہ — جلد جواب ملے گا۔" },
// // //       not_specified: { en: "Add a budget to attract more workers.",                 ur: "بجٹ شامل کریں۔" },
// // //     };
// // //     tipEn = fallbacks[assessment]?.en || "";
// // //     tipUr = fallbacks[assessment]?.ur || "";
// // //   }

// // //   res.json({ minRate, maxRate, unit: "per day", assessment, tipEn, tipUr });
// // // });
// // // // ─────────────────────────────────────────────────────────────────────────────

// // // module.exports = router;
// // // backend/src/routes/ai.routes.js
// // const express = require("express");
// // const router = express.Router();
// // const multer = require("multer");
// // const fs = require("fs");
// // const OpenAI = require("openai");

// // const upload = multer({ dest: "uploads/" });
// // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// // // ── Voice endpoint: Speech → Text using Whisper ───────────────
// // router.post("/voice", upload.single("audio"), async (req, res) => {
// //   try {
// //     if (!req.file) return res.status(400).json({ message: "No audio file uploaded" });

// //     const audioFilePath = req.file.path;

// //     // 1️⃣ Transcribe audio using Whisper
// //     const transcription = await openai.audio.transcriptions.create({
// //       file: fs.createReadStream(audioFilePath),
// //       model: "whisper-1",
// //     });

// //     const text = transcription.text;
// //     fs.unlinkSync(audioFilePath); // cleanup uploaded file

// //     // 2️⃣ Return text to frontend
// //     res.json({ text });
// //   } catch (err) {
// //     console.error("Error processing audio:", err);
// //     res.status(500).json({ message: "Error processing audio" });
// //   }
// // });

// // module.exports = router;

// // // ─── AI Generate Job Description ─────────────
// // router.post("/generate-description", async (req, res) => {
// //   const { category, title, location, budget, lang } = req.body;
// //   const isUrdu = lang === "ur";

// //   const prompt = isUrdu
// //     ? `آپ ایک پاکستانی بلیو کالر جاب پورٹل RozgarHub کے لیے نوکری کی تفصیل لکھتے ہیں۔\nنوکری کی قسم: ${category}\nعنوان: ${title || category}\nمقام: ${location || "پاکستان"}\nبجٹ: روپے ${budget || "قابل گفتگو"}\nصرف 2-3 جملوں میں سادہ اردو میں تفصیل لکھیں۔`
// //     : `Write a short job description in 2-3 sentences for a Pakistani blue-collar job posting on RozgarHub app.\nJob Category: ${category}\nJob Title: ${title || category}\nLocation: ${location || "Pakistan"}\nBudget: Rs. ${budget || "negotiable"}\nWrite in simple English. Only return description text.`;

// //   try {
// //     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
// //       method: "POST",
// //       headers: { 
// //         "Content-Type": "application/json",
// //         "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
// //       },
// //       body: JSON.stringify({
// //         model: "llama-3.1-8b-instant",
// //         max_tokens: 200,
// //         messages: [
// //           { role: "system", content: isUrdu ? "Write short Urdu job descriptions." : "Write short English job descriptions." },
// //           { role: "user", content: prompt }
// //         ]
// //       }),
// //     });
// //     const data = await response.json();
// //     const text = data?.choices?.[0]?.message?.content?.trim();
// //     if (!text) return res.status(500).json({ error: "AI did not generate description", raw: data });
// //     res.json({ description: text });
// //   } catch (err) {
// //     console.error("Generate-description Error:", err.message);
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // ─── Parse Job Description ─────────────
// // router.post("/parse-job", async (req, res) => {
// //   const { description } = req.body;
// //   if (!description) return res.status(400).json({ error: "Description required" });

// //   const prompt = `Extract skills, budget, urgency, category, location from this job description. Return ONLY valid JSON.\n${description}`;

// //   try {
// //     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
// //       body: JSON.stringify({
// //         model: "llama-3.1-8b-instant",
// //         max_tokens: 200,
// //         messages: [
// //           { role: "system", content: "Return only valid JSON. No extra text." },
// //           { role: "user", content: prompt }
// //         ]
// //       }),
// //     });
// //     const data = await response.json();
// //     const text = data?.choices?.[0]?.message?.content?.trim();
// //     if (!text) return res.status(500).json({ error: "AI did not return JSON", raw: data });
// //     const parsed = JSON.parse(text);
// //     res.json(parsed);
// //   } catch (err) {
// //     console.error("Parse-job Error:", err.message);
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // ─── Smart Filter ─────────────
// // router.post("/smart-filter", async (req, res) => {
// //   const { query } = req.body;
// //   if (!query) return res.status(400).json({ error: "Query required" });

// //   const prompt = `Extract filter criteria from query: "${query}". Return ONLY valid JSON.`;

// //   try {
// //     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
// //       body: JSON.stringify({
// //         model: "llama-3.1-8b-instant",
// //         max_tokens: 300,
// //         messages: [
// //           { role: "system", content: "Return only valid JSON. No explanation." },
// //           { role: "user", content: prompt }
// //         ]
// //       }),
// //     });
// //     const data = await response.json();
// //     const text = data?.choices?.[0]?.message?.content?.trim();
// //     const parsed = text ? JSON.parse(text) : {};
// //     res.json(parsed);
// //   } catch (err) {
// //     console.error("Smart-filter Error:", err.message);
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // ─── Worker Score ─────────────
// // router.post("/worker-score", async (req, res) => {
// //   const { workerId, name, category, rating = 0, totalJobs = 0, completedJobs = 0, responseTimeMinutes = 60, isVerified = false, profileComplete = false } = req.body;
// //   if (!workerId) return res.status(400).json({ error: "workerId required" });

// //   const profileScore    = profileComplete ? 25 : 10;
// //   const verifiedScore   = isVerified ? 25 : 0;
// //   const ratingScore     = Math.round((rating / 5) * 20);
// //   const completionRate  = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;
// //   const completionScore = Math.round((completionRate / 100) * 20);
// //   let responseScore = 10;
// //   if (responseTimeMinutes > 60)  responseScore = 5;
// //   if (responseTimeMinutes > 120) responseScore = 2;
// //   if (responseTimeMinutes > 240) responseScore = 0;
// //   const finalScore = Math.min(100, Math.max(0, profileScore + verifiedScore + ratingScore + completionScore + responseScore));

// //   let label, labelUr, color;
// //   if (finalScore >= 80)      { label = "Highly Reliable"; labelUr = "انتہائی قابل اعتماد"; color = "#16a34a"; }
// //   else if (finalScore >= 60) { label = "Reliable";        labelUr = "قابل اعتماد";         color = "#2563eb"; }
// //   else if (finalScore >= 40) { label = "Moderate";        labelUr = "درمیانہ";             color = "#d97706"; }
// //   else                       { label = "New Worker";      labelUr = "نیا ورکر";            color = "#6b7280"; }

// //   res.json({ workerId, score: finalScore, label, labelUr, color, breakdown: { profileScore, verifiedScore, ratingScore, completionScore, responseScore } });
// // });

// // // ─── Price Suggestion ─────────────
// // const MARKET_RATES = {
// //   electrician: { min: 1500, max: 3000 },
// //   plumber:     { min: 1200, max: 2500 },
// //   carpenter:   { min: 1500, max: 3500 },
// //   painter:     { min: 1000, max: 2500 },
// //   cleaner:     { min: 800,  max: 1800 },
// //   driver:      { min: 1500, max: 3000 },
// //   mason:       { min: 1500, max: 3000 },
// //   welder:      { min: 2000, max: 4000 },
// // };

// // const CITY_MULTIPLIERS = {
// //   karachi: 1.2, lahore: 1.15, islamabad: 1.25, rawalpindi: 1.1, peshawar: 0.95, quetta: 0.9, faisalabad: 1.0, multan: 0.95, default: 1.0,
// // };

// // router.post("/price-suggestion", async (req, res) => {
// //   const { category, location, offeredPrice } = req.body;
// //   if (!category) return res.status(400).json({ error: "Category required" });

// //   const baseRate = MARKET_RATES[category?.toLowerCase()] || { min: 1000, max: 2500 };
// //   const locationLower = (location || "").toLowerCase();
// //   let multiplier = CITY_MULTIPLIERS.default;
// //   for (const [city, mult] of Object.entries(CITY_MULTIPLIERS)) if (city !== "default" && locationLower.includes(city)) multiplier = mult;

// //   const minRate = Math.round(baseRate.min * multiplier);
// //   const maxRate = Math.round(baseRate.max * multiplier);

// //   let assessment;
// //   const offered = Number(offeredPrice) || 0;
// //   if (offered === 0) assessment = "not_specified";
// //   else if (offered < minRate * 0.85) assessment = "low";
// //   else if (offered > maxRate * 1.15) assessment = "high";
// //   else assessment = "fair";

// //   res.json({ minRate, maxRate, unit: "per day", assessment });
// // });

// // module.exports = router;


// const express = require("express");
// const router = express.Router();

// router.post("/generate-description", async (req, res) => {
//   const { category, title, location, budget, lang } = req.body;
//   const isUrdu = lang === "ur";
//   const prompt = isUrdu
//     ? `آپ ایک پاکستانی بلیو کالر جاب پورٹل RozgarHub کے لیے نوکری کی تفصیل لکھتے ہیں۔\nنوکری کی قسم: ${category}\nعنوان: ${title || category}\nمقام: ${location || "پاکستان"}\nبجٹ: روپے ${budget || "قابل گفتگو"}\nصرف 2-3 جملوں میں سادہ اردو میں تفصیل لکھیں۔ صرف تفصیل لکھیں، کچھ اور نہیں۔`
//     : `Write a short job description in 2-3 sentences for a Pakistani blue-collar job posting on RozgarHub app.\nJob Category: ${category}\nJob Title: ${title || category}\nLocation: ${location || "Pakistan"}\nBudget: Rs. ${budget || "negotiable"}\nWrite in simple English. Be specific and professional. Only return the description text, nothing else.`;
//   try {
//     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//       method: "POST",
//       headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
//       body: JSON.stringify({
//         model: "llama-3.1-8b-instant", max_tokens: 200,
//         messages: [
//           { role: "system", content: isUrdu ? "آپ پاکستانی بلیو کالر ورکرز کے لیے اردو میں نوکری کی تفصیل لکھتے ہیں۔ صرف تفصیل لکھیں۔" : "You write short job descriptions for Pakistani blue-collar workers. Always respond with only the description text, no extra words, no formatting." },
//           { role: "user", content: prompt }
//         ]
//       })
//     });
//     const data = await response.json();
//     const text = data?.choices?.[0]?.message?.content;
//     if (!text) return res.status(500).json({ error: "AI ne kuch generate nahi kiya", raw: data });
//     res.json({ description: text.trim() });
//   } catch (err) {
//     console.error("Groq Error:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ─── Smart Job Description Auto-Fill ─────────────────────────────────────────
// router.post("/parse-job", async (req, res) => {
//   const { description } = req.body;
//   if (!description) return res.status(400).json({ error: "Description required" });
//   const prompt = `You are a job parser for RozgarHub, a Pakistani blue-collar job portal.\nExtract information from this job description and return ONLY valid JSON, nothing else.\n\nJob description: "${description}"\n\nReturn exactly this format:\n{\n  "skills": ["skill1", "skill2"],\n  "budget_estimate": "PKR range per day",\n  "urgency": "low | medium | high",\n  "category": "job category in one word",\n  "location": "city or area name, or empty string if not mentioned"\n}`;
//   try {
//     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//       method: "POST",
//       headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
//       body: JSON.stringify({
//         model: "llama-3.1-8b-instant", max_tokens: 200,
//         messages: [
//           { role: "system", content: "You are a JSON extractor. You only return valid JSON. No explanation, no markdown, no extra text." },
//           { role: "user", content: prompt }
//         ]
//       })
//     });
//     const data = await response.json();
//     const text = data?.choices?.[0]?.message?.content;
//     if (!text) return res.status(500).json({ error: "AI ne kuch return nahi kiya", raw: data });
//     const parsed = JSON.parse(text.trim());
//     res.json(parsed);
//   } catch (err) {
//     console.error("Parse-job Error:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ─── AI Smart Job Filter ──────────────────────────────────────────────────────
// router.post("/smart-filter", async (req, res) => {
//   const { query } = req.body;
//   if (!query) return res.status(400).json({ error: "Query required" });
//   const prompt = `You are a job search filter extractor for RozgarHub, a Pakistani blue-collar job portal.\nA worker typed this search query: "${query}"\n\nExtract filter criteria and return ONLY valid JSON, nothing else.\n\nReturn exactly this format:\n{\n  "category": "one of: electrician | plumber | carpenter | painter | cleaner | driver | mason | welder | or empty string if not mentioned",\n  "location": "city or area name in Pakistan, or empty string if not mentioned",\n  "minBudget": 0,\n  "maxBudget": 0,\n  "urgency": "one of: 1_hour | today | this_week | flexible | or empty string if not mentioned",\n  "keywords": ["any other relevant keywords to match in job title or description"]\n}\n\nRules:\n- If worker says "urgent" or "jaldi" set urgency to 1_hour.\n- If worker says "aaj" or "today" set urgency to today.\n- If worker says "is hafte" or "this week" set urgency to this_week.`;
//   try {
//     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//       method: "POST",
//       headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
//       body: JSON.stringify({
//         model: "llama-3.1-8b-instant", max_tokens: 300,
//         messages: [
//           { role: "system", content: "You are a JSON extractor for a Pakistani job portal. You only return valid JSON. No explanation, no markdown, no extra text." },
//           { role: "user", content: prompt }
//         ]
//       })
//     });
//     const data = await response.json();
//     const text = data?.choices?.[0]?.message?.content;
//     if (!text) return res.status(500).json({ error: "AI ne kuch return nahi kiya", raw: data });
//     const parsed = JSON.parse(text.trim());
//     res.json(parsed);
//   } catch (err) {
//     console.error("Smart-filter Error:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ─── AI Worker Reliability Score (P-WRS) ─────────────────────────────────────
// router.post("/worker-score", async (req, res) => {
//   const { workerId, name, category, rating = 0, totalJobs = 0, completedJobs = 0, responseTimeMinutes = 60, isVerified = false, profileComplete = false } = req.body;
//   if (!workerId) return res.status(400).json({ error: "workerId required" });

//   const profileScore    = profileComplete ? 25 : 10;
//   const verifiedScore   = isVerified ? 25 : 0;
//   const ratingScore     = Math.round((rating / 5) * 20);
//   const completionRate  = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;
//   const completionScore = Math.round((completionRate / 100) * 20);
//   let responseScore = 10;
//   if (responseTimeMinutes > 60)  responseScore = 5;
//   if (responseTimeMinutes > 120) responseScore = 2;
//   if (responseTimeMinutes > 240) responseScore = 0;
//   const finalScore = Math.min(100, Math.max(0, profileScore + verifiedScore + ratingScore + completionScore + responseScore));

//   let label, labelUr, color;
//   if (finalScore >= 80)      { label = "Highly Reliable"; labelUr = "انتہائی قابل اعتماد"; color = "#16a34a"; }
//   else if (finalScore >= 60) { label = "Reliable";        labelUr = "قابل اعتماد";         color = "#2563eb"; }
//   else if (finalScore >= 40) { label = "Moderate";        labelUr = "درمیانہ";             color = "#d97706"; }
//   else                       { label = "New Worker";      labelUr = "نیا ورکر";            color = "#6b7280"; }

//   let explanation = "";
//   try {
//     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//       method: "POST",
//       headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
//       body: JSON.stringify({
//         model: "llama-3.1-8b-instant", max_tokens: 100,
//         messages: [
//           { role: "system", content: "You write short, honest, encouraging reliability summaries for blue-collar workers. Only return the explanation text." },
//           { role: "user", content: `Worker: ${name}, Category: ${category}, P-WRS Score: ${finalScore}/100, Rating: ${rating}/5, Jobs Completed: ${completedJobs}/${totalJobs}, CNIC Verified: ${isVerified ? "Yes" : "No"}. Write a 1-2 sentence explanation.` }
//         ]
//       })
//     });
//     const data = await response.json();
//     explanation = data?.choices?.[0]?.message?.content?.trim() || "";
//   } catch (_) {}

//   res.json({ workerId, score: finalScore, label, labelUr, color, explanation, breakdown: { profileScore, verifiedScore, ratingScore, completionScore, responseScore } });
// });

// // ─── AI Smart Pricing Suggestion ─────────────────────────────────────────────
// // POST /api/ai/price-suggestion
// // Body: { category, location, offeredPrice, lang }

// // ── Pakistani market rates (PKR per day) ──
// const MARKET_RATES = {
//   electrician: { min: 1500, max: 3000 },
//   plumber:     { min: 1200, max: 2500 },
//   carpenter:   { min: 1500, max: 3500 },
//   painter:     { min: 1000, max: 2500 },
//   cleaner:     { min: 800,  max: 1800 },
//   driver:      { min: 1500, max: 3000 },
//   mason:       { min: 1500, max: 3000 },
//   welder:      { min: 2000, max: 4000 },
// };

// // City multipliers — bigger cities = higher rates
// const CITY_MULTIPLIERS = {
//   karachi:    1.2,
//   lahore:     1.15,
//   islamabad:  1.25,
//   rawalpindi: 1.1,
//   peshawar:   0.95,
//   quetta:     0.9,
//   faisalabad: 1.0,
//   multan:     0.95,
//   default:    1.0,
// };

// router.post("/price-suggestion", async (req, res) => {
//   const { category, location, offeredPrice, lang } = req.body;

//   if (!category) return res.status(400).json({ error: "Category required" });

//   // ── Get base market rate ──
//   const baseRate = MARKET_RATES[category?.toLowerCase()] || { min: 1000, max: 2500 };

//   // ── Apply city multiplier ──
//   const locationLower = (location || "").toLowerCase();
//   let multiplier = CITY_MULTIPLIERS.default;
//   for (const [city, mult] of Object.entries(CITY_MULTIPLIERS)) {
//     if (city !== "default" && locationLower.includes(city)) {
//       multiplier = mult;
//       break;
//     }
//   }

//   const minRate = Math.round(baseRate.min * multiplier);
//   const maxRate = Math.round(baseRate.max * multiplier);

//   // ── Calculate assessment mathematically — NOT by AI ──
//   const offered = Number(offeredPrice) || 0;
//   let assessment;
//   if (offered === 0) {
//     assessment = "not_specified";
//   } else if (offered < minRate * 0.85) {
//     // More than 15% below min → LOW
//     assessment = "low";
//   } else if (offered > maxRate * 1.15) {
//     // More than 15% above max → HIGH
//     assessment = "high";
//   } else {
//     // Within range (including 15% buffer) → FAIR
//     assessment = "fair";
//   }

//   // ── Get AI tip (short sentence only, not assessment) ──
//   const tipPrompt = `Pakistani job portal RozgarHub. Employer offering Rs.${offered}/day for a ${category} in ${location || "Pakistan"}. Market rate is Rs.${minRate}-${maxRate}/day. Assessment: ${assessment}. Write ONE short tip in English under 12 words. Only return the tip text, nothing else.`;

//   let tipEn = "";
//   let tipUr = "";
//   try {
//     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//       method: "POST",
//       headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
//       body: JSON.stringify({
//         model: "llama-3.1-8b-instant", max_tokens: 60,
//         messages: [
//           { role: "system", content: "You write very short pricing tips for Pakistani employers. Only return the tip text, under 12 words." },
//           { role: "user", content: tipPrompt }
//         ]
//       })
//     });
//     const data = await response.json();
//     tipEn = data?.choices?.[0]?.message?.content?.trim() || "";

//     // Urdu tip
//     if (lang === "ur" && tipEn) {
//       const urResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//         method: "POST",
//         headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
//         body: JSON.stringify({
//           model: "llama-3.1-8b-instant", max_tokens: 80,
//           messages: [
//             { role: "system", content: "Translate to simple Urdu. Only return the translation." },
//             { role: "user", content: tipEn }
//           ]
//         })
//       });
//       const urData = await urResponse.json();
//       tipUr = urData?.choices?.[0]?.message?.content?.trim() || tipEn;
//     }
//   } catch (_) {
//     // Fallback tips if AI fails
//     const fallbacks = {
//       low:           { en: "Consider raising your budget to attract more workers.", ur: "زیادہ کارکن پانے کے لیے بجٹ بڑھائیں۔" },
//       fair:          { en: "Great offer! Workers are likely to respond quickly.",   ur: "اچھی پیشکش! کارکن جلدی جواب دیں گے۔" },
//       high:          { en: "Above market rate — expect faster responses.",          ur: "مارکیٹ سے زیادہ — جلد جواب ملے گا۔" },
//       not_specified: { en: "Add a budget to attract more workers.",                 ur: "بجٹ شامل کریں۔" },
//     };
//     tipEn = fallbacks[assessment]?.en || "";
//     tipUr = fallbacks[assessment]?.ur || "";
//   }

//   res.json({ minRate, maxRate, unit: "per day", assessment, tipEn, tipUr });
// });
// // ─────────────────────────────────────────────────────────────────────────────

// module.exports = router;


const express = require("express");
const router = express.Router();

router.post("/generate-description", async (req, res) => {
  const { category, title, location, budget, lang } = req.body;
  const isUrdu = lang === "ur";
  const prompt = isUrdu
    ? `آپ ایک پاکستانی بلیو کالر جاب پورٹل RozgarHub کے لیے نوکری کی تفصیل لکھتے ہیں۔\nنوکری کی قسم: ${category}\nعنوان: ${title || category}\nمقام: ${location || "پاکستان"}\nبجٹ: روپے ${budget || "قابل گفتگو"}\nصرف 2-3 جملوں میں سادہ اردو میں تفصیل لکھیں۔ صرف تفصیل لکھیں، کچھ اور نہیں۔`
    : `Write a short job description in 2-3 sentences for a Pakistani blue-collar job posting on RozgarHub app.\nJob Category: ${category}\nJob Title: ${title || category}\nLocation: ${location || "Pakistan"}\nBudget: Rs. ${budget || "negotiable"}\nWrite in simple English. Be specific and professional. Only return the description text, nothing else.`;
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", max_tokens: 200,
        messages: [
          { role: "system", content: isUrdu ? "آپ پاکستانی بلیو کالر ورکرز کے لیے اردو میں نوکری کی تفصیل لکھتے ہیں۔ صرف تفصیل لکھیں۔" : "You write short job descriptions for Pakistani blue-collar workers. Always respond with only the description text, no extra words, no formatting." },
          { role: "user", content: prompt }
        ]
      })
    });
    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) return res.status(500).json({ error: "AI ne kuch generate nahi kiya", raw: data });
    res.json({ description: text.trim() });
  } catch (err) {
    console.error("Groq Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── Smart Job Description Auto-Fill ─────────────────────────────────────────
router.post("/parse-job", async (req, res) => {
  const { description } = req.body;
  if (!description) return res.status(400).json({ error: "Description required" });
  const prompt = `You are a job parser for RozgarHub, a Pakistani blue-collar job portal.\nExtract information from this job description and return ONLY valid JSON, nothing else.\n\nJob description: "${description}"\n\nReturn exactly this format:\n{\n  "skills": ["skill1", "skill2"],\n  "budget_estimate": "PKR range per day",\n  "urgency": "low | medium | high",\n  "category": "job category in one word",\n  "location": "city or area name, or empty string if not mentioned"\n}`;
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", max_tokens: 200,
        messages: [
          { role: "system", content: "You are a JSON extractor. You only return valid JSON. No explanation, no markdown, no extra text." },
          { role: "user", content: prompt }
        ]
      })
    });
    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) return res.status(500).json({ error: "AI ne kuch return nahi kiya", raw: data });
    const parsed = JSON.parse(text.trim());
    res.json(parsed);
  } catch (err) {
    console.error("Parse-job Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── AI Smart Job Filter ──────────────────────────────────────────────────────
router.post("/smart-filter", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query required" });
  const prompt = `You are a job search filter extractor for RozgarHub, a Pakistani blue-collar job portal.\nA worker typed this search query: "${query}"\n\nExtract filter criteria and return ONLY valid JSON, nothing else.\n\nReturn exactly this format:\n{\n  "category": "one of: electrician | plumber | carpenter | painter | cleaner | driver | mason | welder | or empty string if not mentioned",\n  "location": "city or area name in Pakistan, or empty string if not mentioned",\n  "minBudget": 0,\n  "maxBudget": 0,\n  "urgency": "one of: 1_hour | today | this_week | flexible | or empty string if not mentioned",\n  "keywords": ["any other relevant keywords to match in job title or description"]\n}\n\nRules:\n- If worker says "urgent" or "jaldi" set urgency to 1_hour.\n- If worker says "aaj" or "today" set urgency to today.\n- If worker says "is hafte" or "this week" set urgency to this_week.`;
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", max_tokens: 300,
        messages: [
          { role: "system", content: "You are a JSON extractor for a Pakistani job portal. You only return valid JSON. No explanation, no markdown, no extra text." },
          { role: "user", content: prompt }
        ]
      })
    });
    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) return res.status(500).json({ error: "AI ne kuch return nahi kiya", raw: data });
    const parsed = JSON.parse(text.trim());
    res.json(parsed);
  } catch (err) {
    console.error("Smart-filter Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── AI Worker Reliability Score (P-WRS) ─────────────────────────────────────
router.post("/worker-score", async (req, res) => {
  const { workerId, name, category, rating = 0, totalJobs = 0, completedJobs = 0, responseTimeMinutes = 60, isVerified = false, profileComplete = false } = req.body;
  if (!workerId) return res.status(400).json({ error: "workerId required" });

  const profileScore    = profileComplete ? 25 : 10;
  const verifiedScore   = isVerified ? 25 : 0;
  const ratingScore     = Math.round((rating / 5) * 20);
  const completionRate  = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;
  const completionScore = Math.round((completionRate / 100) * 20);
  let responseScore = 10;
  if (responseTimeMinutes > 60)  responseScore = 5;
  if (responseTimeMinutes > 120) responseScore = 2;
  if (responseTimeMinutes > 240) responseScore = 0;
  const finalScore = Math.min(100, Math.max(0, profileScore + verifiedScore + ratingScore + completionScore + responseScore));

  let label, labelUr, color;
  if (finalScore >= 80)      { label = "Highly Reliable"; labelUr = "انتہائی قابل اعتماد"; color = "#16a34a"; }
  else if (finalScore >= 60) { label = "Reliable";        labelUr = "قابل اعتماد";         color = "#2563eb"; }
  else if (finalScore >= 40) { label = "Moderate";        labelUr = "درمیانہ";             color = "#d97706"; }
  else                       { label = "New Worker";      labelUr = "نیا ورکر";            color = "#6b7280"; }

  let explanation = "";
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", max_tokens: 100,
        messages: [
          { role: "system", content: "You write short, honest, encouraging reliability summaries for blue-collar workers. Only return the explanation text." },
          { role: "user", content: `Worker: ${name}, Category: ${category}, P-WRS Score: ${finalScore}/100, Rating: ${rating}/5, Jobs Completed: ${completedJobs}/${totalJobs}, CNIC Verified: ${isVerified ? "Yes" : "No"}. Write a 1-2 sentence explanation.` }
        ]
      })
    });
    const data = await response.json();
    explanation = data?.choices?.[0]?.message?.content?.trim() || "";
  } catch (_) {}

  res.json({ workerId, score: finalScore, label, labelUr, color, explanation, breakdown: { profileScore, verifiedScore, ratingScore, completionScore, responseScore } });
});

// ─── AI Smart Pricing Suggestion ─────────────────────────────────────────────
// POST /api/ai/price-suggestion
// Body: { category, location, offeredPrice, lang }

// ── Pakistani market rates (PKR per day) ──
const MARKET_RATES = {
  electrician: { min: 1500, max: 3000 },
  plumber:     { min: 1200, max: 2500 },
  carpenter:   { min: 1500, max: 3500 },
  painter:     { min: 1000, max: 2500 },
  cleaner:     { min: 800,  max: 1800 },
  driver:      { min: 1500, max: 3000 },
  mason:       { min: 1500, max: 3000 },
  welder:      { min: 2000, max: 4000 },
};

// City multipliers — bigger cities = higher rates
const CITY_MULTIPLIERS = {
  karachi:    1.2,
  lahore:     1.15,
  islamabad:  1.25,
  rawalpindi: 1.1,
  peshawar:   0.95,
  quetta:     0.9,
  faisalabad: 1.0,
  multan:     0.95,
  default:    1.0,
};

router.post("/price-suggestion", async (req, res) => {
  const { category, location, offeredPrice, lang } = req.body;

  if (!category) return res.status(400).json({ error: "Category required" });

  // ── Get base market rate ──
  const baseRate = MARKET_RATES[category?.toLowerCase()] || { min: 1000, max: 2500 };

  // ── Apply city multiplier ──
  const locationLower = (location || "").toLowerCase();
  let multiplier = CITY_MULTIPLIERS.default;
  for (const [city, mult] of Object.entries(CITY_MULTIPLIERS)) {
    if (city !== "default" && locationLower.includes(city)) {
      multiplier = mult;
      break;
    }
  }

  const minRate = Math.round(baseRate.min * multiplier);
  const maxRate = Math.round(baseRate.max * multiplier);

  // ── Calculate assessment mathematically — NOT by AI ──
  const offered = Number(offeredPrice) || 0;
  let assessment;
  if (offered === 0) {
    assessment = "not_specified";
  } else if (offered < minRate * 0.85) {
    // More than 15% below min → LOW
    assessment = "low";
  } else if (offered > maxRate * 1.15) {
    // More than 15% above max → HIGH
    assessment = "high";
  } else {
    // Within range (including 15% buffer) → FAIR
    assessment = "fair";
  }

  // ── Get AI tip (short sentence only, not assessment) ──
  const tipPrompt = `Pakistani job portal RozgarHub. Employer offering Rs.${offered}/day for a ${category} in ${location || "Pakistan"}. Market rate is Rs.${minRate}-${maxRate}/day. Assessment: ${assessment}. Write ONE short tip in English under 12 words. Only return the tip text, nothing else.`;

  let tipEn = "";
  let tipUr = "";
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", max_tokens: 60,
        messages: [
          { role: "system", content: "You write very short pricing tips for Pakistani employers. Only return the tip text, under 12 words." },
          { role: "user", content: tipPrompt }
        ]
      })
    });
    const data = await response.json();
    tipEn = data?.choices?.[0]?.message?.content?.trim() || "";

    // Urdu tip
    if (lang === "ur" && tipEn) {
      const urResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant", max_tokens: 80,
          messages: [
            { role: "system", content: "Translate to simple Urdu. Only return the translation." },
            { role: "user", content: tipEn }
          ]
        })
      });
      const urData = await urResponse.json();
      tipUr = urData?.choices?.[0]?.message?.content?.trim() || tipEn;
    }
  } catch (_) {
    // Fallback tips if AI fails
    const fallbacks = {
      low:           { en: "Consider raising your budget to attract more workers.", ur: "زیادہ کارکن پانے کے لیے بجٹ بڑھائیں۔" },
      fair:          { en: "Great offer! Workers are likely to respond quickly.",   ur: "اچھی پیشکش! کارکن جلدی جواب دیں گے۔" },
      high:          { en: "Above market rate — expect faster responses.",          ur: "مارکیٹ سے زیادہ — جلد جواب ملے گا۔" },
      not_specified: { en: "Add a budget to attract more workers.",                 ur: "بجٹ شامل کریں۔" },
    };
    tipEn = fallbacks[assessment]?.en || "";
    tipUr = fallbacks[assessment]?.ur || "";
  }

  res.json({ minRate, maxRate, unit: "per day", assessment, tipEn, tipUr });
});
// ─────────────────────────────────────────────────────────────────────────────

module.exports = router;