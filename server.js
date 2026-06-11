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
        // CORREÇÃO: Usando v1beta e removendo o "-latest"
        const url = `https://googleapis.com{apiKey}`;
        
        // Garante que o corpo enviado segue a estrutura padrão esperada pelo Google
        const requestBody = req.body.contents ? req.body : {
            contents: [{ parts: [{ text: req.body.prompt || "Olá" }] }]
        };

        const googleResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody) 
        });

        const data = await googleResponse.json();
        
        if (!googleResponse.ok) {
            console.error("Erro retornado do Google:", JSON.stringify(data));
            return res.status(googleResponse.status).json(data);
        }
        
        res.status(200).json(data);

    } catch (error) {
        console.error("Erro no Proxy:", error);
        res.status(500).json({ error: "Erro de comunicação interna." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
