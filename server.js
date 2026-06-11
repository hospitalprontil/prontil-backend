const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

const app = express();

// Configuração de CORS para aceitar requisições da sua origem (ou todas)
app.use(cors({ origin: "*" })); 
app.use(express.json());

// Rota principal para a IA
app.post('/api/gemini', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY; 

    if (!apiKey) {
        return res.status(500).json({ error: "Chave de API não configurada." });
    }

    try {
        // Usando o modelo gemini-1.5-flash (compatível e rápido)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
        const googleResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body) 
        });

        const data = await googleResponse.json();
        
        // Repassa a resposta do Google para o front-end
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
