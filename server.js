const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

const app = express();

app.use(cors({ origin: "*" })); 
app.use(express.json());

app.post('/api/gemini', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY; 

    if (!apiKey) {
        return res.status(500).json({ error: "Chave de API não configurada." });
    }

    try {
        // Garantindo que estamos usando um modelo existente
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
        const googleResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body) 
        });

        const data = await googleResponse.json();
        
        // Log importante para debug no Render:
        if (!googleResponse.ok) {
            console.error("Erro retornado pelo Google API:", JSON.stringify(data));
        }
        
        res.status(googleResponse.status).json(data);

    } catch (error) {
        console.error("Erro no Proxy:", error);
        res.status(500).json({ error: "Erro de comunicação interna." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
