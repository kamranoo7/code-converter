const express = require('express');
const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();
let cors=require("cors")
const app = express();
const PORT = 8080;
app.use(cors())
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.post('/convert', async (req, res) => {
  try {
    const { code, fromLanguage, toLanguage } = req.body;
    const response = await openai.createChatCompletion(
      {
        model: 'gpt-3.5-turbo',
        messages: [ {role:"user",content:`${code} from ${fromLanguage} to ${toLanguage}`}],
        max_tokens: 1024,
        temperature: 0.7,
      }
    );

    const convertedCode = response.data.choices[0].message;
    res.json({ convertedCode });
  } catch (error) {
    console.error('Error converting code:', "shsh");
    res.status(500).json({ error: error.message });
  }
});







app.post('/convert1', async (req, res) => {
  try {
    const { code, fromLanguage, toLanguage } = req.body;
    const parameters = [
      "Code Consistency",
      "Code Performance",
      "Code Documentation",
      "Error Handling",
      "Code Testability",
      "Code Modularity",
      "Code Complexity",
      "Code Duplication",
      "Code Readability"
    ];

    const prompt = `[Title]: Code Quality Assessment\n\n[Description]: Please review the following code and assess its quality based on the following parameters:\n\n${parameters.map((param, index) => `${index + 1}. ${param}`).join('\n')}\n\n[Code]:\n${code}\n\n[Questions]:\n${parameters.map((param, index) => `${index + 1}. ${param}`).join('\n')}\n\n[Answer]:`;

    const response = await openai.createChatCompletion(
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: "" }
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }
    );

    const answers = response.data.choices[0].message.content.split("\n").slice(3); // Remove the title and description from the response
    const ratings = answers.map(answer => parseInt(answer, 10));

    const overallQuality = ratings.reduce((acc, val) => acc + val, 0) / ratings.length;

    const report = {};
    parameters.forEach((param, index) => {
      report[param] = ratings[index];
    });

    res.json({ overallQuality, report });
  } catch (error) {
    console.error('Error converting code:', error);
    res.status(500).json({ error: error.message });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
