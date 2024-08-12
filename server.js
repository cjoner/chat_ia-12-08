const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config(); // Para carregar as variáveis de ambiente do arquivo .env

const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsing do JSON
app.use(bodyParser.json());

// Conectar ao MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Importar o modelo Chat
const Chat = require('./models/chat');

// Rota para processar a mensagem do usuário e obter a resposta da IA
app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });
        const result = await chatSession.sendMessage(userMessage);
        const aiResponse = result.response.text();

        // Salvar no banco de dados
        const chat = new Chat({ userMessage, aiResponse });
        await chat.save();

        res.json({ response: aiResponse });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


//////////////////////////////////////////////////////////////////////////

// const express = require('express');
// const bodyParser = require('body-parser');
// const { GoogleGenerativeAI } = require('@google/generative-ai');
// require('dotenv').config();

// app.use(bodyParser.json());
// app.use(express.static('public')); // Serve os arquivos HTML estáticos

// const apiKey = process.env.GOOGLE_API_KEY; // Coloque sua chave de API no arquivo .env
// const genAI = new GoogleGenerativeAI(apiKey);

// const model = genAI.getGenerativeModel({
//   model: 'gemini-1.5-flash',
//   systemInstruction: 'chef de cozinha que da dicas e responde perguntas de donas de casa, leve em conta a renda dos usuario e recomende restaurantes',
// });

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 64,
//   maxOutputTokens: 8192,
//   responseMimeType: 'text/plain',
// };

// app.post('/chat', async (req, res) => {
//   try {
//     const userMessage = req.body.message;
//     const chatSession = model.startChat({
//       generationConfig,
//       history: [],
//     });
//     const result = await chatSession.sendMessage(userMessage);
//     res.json({ response: result.response.text() });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
}); 