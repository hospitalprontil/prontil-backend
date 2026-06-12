const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: '*'
}));

app.use(express.json({
    limit: '10mb'
}));

app.get('/', (req, res) => {
    res.json({
        status: 'online',
        servidor: 'Gemini Proxy',
        rota: '/api/gemini'
    });
});

app.post('/api/gemini', async (req, res) => {

    try {

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: 'GEMINI_API_KEY não configurada'
            });
        }

        const googleResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req.body)
            }
        );

        const responseText = await googleResponse.text();

        let data;

        try {
            data = JSON.parse(responseText);
        } catch {
            return res.status(500).json({
                error: 'Resposta inválida recebida do Google',
                raw: responseText
            });
        }

        return res.status(googleResponse.status).json(data);

    } catch (error) {

        console.error('Erro interno:', error);

        return res.status(500).json({
            error: error.message
        });

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
