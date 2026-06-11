import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Carrega as variáveis de ambiente (útil para testes locais)
dotenv.config();

const app = express();

// Middlewares essenciais
app.use(cors()); // Permite que seu frontend faça requisições para este backend
app.use(express.json()); // Permite que o servidor entenda JSON no corpo da requisição

// O Render injeta automaticamente a variável PORT. 
// O fallback para 3000 é apenas para rodar localmente.
const port = process.env.PORT || 3000;

// Validação de segurança: Impede que o servidor inicie sem a chave no Render
if (!process.env.GEMINI_API_KEY) {
    console.error("ERRO CRÍTICO: GEMINI_API_KEY não foi definida nas variáveis de ambiente.");
}

// Inicializa o SDK oficial do Google
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ROTA DE DIAGNÓSTICO (Para testar o erro 404)
// Acesse a URL raiz do seu Render (ex: https://seu-app.onrender.com/) no navegador.
// Se aparecer "Backend rodando", o servidor subiu e o 404 é erro de rota no frontend.
app.get('/', (req, res) => {
    res.status(200).json({ status: 'Backend rodando perfeitamente!' });
});

// ROTA DA API DO GEMINI
// Seu frontend deve fazer um POST EXATAMENTE para: https://seu-app.onrender.com/api/chat
app.post('/api/gemini', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'O campo "prompt" é obrigatório.' });
        }

        // Utiliza o modelo flash, que é rápido e o mais recomendado para textos gerais atualmente
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ reply: text });

    } catch (error) {
        console.error('Erro ao chamar a API do Gemini:', error);
        res.status(500).json({ error: 'Falha ao gerar resposta do Gemini. Verifique os logs do servidor.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
