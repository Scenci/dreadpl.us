require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
const app = express();
app.use(express.json());
app.use(cors());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const port = process.env.PORT || 5000;

app.post("/api/completions", async (req, res) => {
  const prompt = req.body.prompt;
  //console.log("prompt from api request: ", prompt);

  try {
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {role: "system", content: "You are an expert on World of Warcraft Classes and Specializations, you will reply with relevant world of warcraft information. You do not need to say the name 'World of Warcraft' in your responses."},
            {role: "user", content: prompt}
        ],
    });

    const completion = response.data.choices[0].message.content;

    return res.status(200).json({ success: true, message: completion });

  } catch (error) {
    
    console.log(error.message);
    return res.status(500).json({
    success: false,
    message: error.message,
  });
  }
});

app.listen(port, () => console.log(`Server is running on port ${port}!!`));