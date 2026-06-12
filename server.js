const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.post('/api/gemini', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "Chave de API não configurada no Render." });
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
        
        const googleResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        const data = await googleResponse.json();
        
        if (!googleResponse.ok) {
            // Log detalhado no console do Render para debug
            console.error("Erro retornado pelo Google API:", JSON.stringify(data, null, 2));
            return res.status(googleResponse.status).json(data);
        }

        res.status(200).json(data);
    } catch (error) {
        console.error("Erro interno no Proxy:", error);
        res.status(500).json({ error: "Erro de comunicação no servidor Proxy." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
