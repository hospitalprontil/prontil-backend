// 1. Crie uma pasta vazia no seu computador.
// 2. Coloque este arquivo lá dentro.
// 3. No terminal, rode: npm init -y
// 4. Depois rode: npm install express cors dotenv node-fetch
// 5. Crie um arquivo chamado .env na mesma pasta e coloque nele: GEMINI_API_KEY=AQ.Ab8RN6IOeuuE3u...
// 6. Para rodar: node server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

const app = express();

// Permite que qualquer site chame essa API. 
// Em produção, você pode alterar o cors() para aceitar apenas requisições do seu site oficial.
app.use(cors()); 
app.use(express.json());

// A Rota "Proxy" que o seu HTML vai chamar
app.post('/api/gemini', async (req, res) => {
    
    // A chave protegida lida do ambiente do servidor
    const apiKey = process.env.GEMINI_API_KEY; 

    if (!apiKey) {
        return res.status(500).json({ error: "Chave de API não configurada no servidor." });
    }

    try {
        // Montamos a URL do Google que ficava lá no Frontend, mas agora injetamos a chave segura
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        
        // Repassamos EXATAMENTE o que o frontend nos enviou (payload) para o Google
        // Para rodar fetch nativo, o Node precisa ser versão 18 ou superior.
        const googleResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body) 
        });

        const data = await googleResponse.json();
        
        // Devolvemos a resposta do Google direto para o seu frontend HTML
        res.status(googleResponse.status).json(data);

    } catch (error) {
        console.error("Erro no servidor Proxy:", error);
        res.status(500).json({ error: "Erro de comunicação interna do servidor." });
    }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de IA seguro rodando na porta ${PORT}`);
    console.log(`Recebendo chamadas em: http://localhost:${PORT}/api/gemini`);
});
