const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are RozgarBot, an AI assistant for RozgarHub job platform in Pakistan. Help workers find jobs and employers hire workers.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const Chat = require("../models/Chat");


// SEND MESSAGE
exports.sendMessage = async (req, res) => {
  try {
    const { jobId, message } = req.body;

    const chat = await Chat.create({
      job: jobId,
      sender: req.user.id,
      message,
    });

    res.status(201).json(chat);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET CHAT MESSAGES
exports.getMessages = async (req, res) => {
  try {
    const { jobId } = req.params;

    const messages = await Chat.find({ job: jobId })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    res.json(messages);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
