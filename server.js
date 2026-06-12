const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware para permitir requisições de qualquer origem e processar JSON
app.use(cors({ origin: "*" }));
app.use(express.json());

// Rota de proxy para a API do Gemini
app.post('/api/gemini', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: "Chave de API não configurada no servidor." });
    }

    try {
        // URL oficial da API do Gemini
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
        
        // Repassa o corpo da requisição (req.body) diretamente para a API do Google
        const googleResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body) 
        });

        const data = await googleResponse.json();
        
        // Devolve o status e o JSON retornado pelo Google para o frontend
        res.status(googleResponse.status).json(data);

    } catch (error) {
        console.error("Erro interno no Proxy:", error);
        res.status(500).json({ error: "Erro de comunicação interna no servidor proxy." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de IA seguro rodando na porta ${PORT}`);
});
