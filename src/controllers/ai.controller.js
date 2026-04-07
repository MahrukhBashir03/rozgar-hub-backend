const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const aiService = require("../services/aiService");

exports.handleVoice = async (req, res) => {
  try {
    const audioPath = req.file.path;

    const response = await aiService.processAudio(audioPath);

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error processing audio" });
  }
};

exports.parseJobDescription = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) return res.status(400).json({ error: "Description required" });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `Extract info from this job post and return ONLY valid JSON, nothing else:
"${description}"

Return this exact format:
{
  "skills": ["skill1", "skill2"],
  "budget_estimate": "PKR range per day",
  "urgency": "low | medium | high",
  "category": "job category"
}`
        }
      ],
      max_tokens: 300
    });

    const json = JSON.parse(response.choices[0].message.content);
    res.json(json);

  } catch (err) {
    res.status(500).json({ error: "AI parsing failed", details: err.message });
  }
};