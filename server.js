
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Раздача статических файлов из папки public
app.use(express.static(path.join(__dirname, 'public')));

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Страница "О себе"
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

// API генератора цитат
app.get('/api/quote', (req, res) => {
    const quotes = [
        {
            text: 'Design is intelligence made visible.',
            author: 'Alina Wheeler',
            lang: 'en'
        },
        {
            text: 'Simplicity is the ultimate sophistication.',
            author: 'Leonardo da Vinci',
            lang: 'en'
        },
        {
            text: 'Дизайн — это не просто то, как вещь выглядит. Дизайн — это то, как она работает.',
            author: 'Steve Jobs',
            lang: 'ru'
        },
        {
            text: 'Хороший дизайн очевиден. Великий дизайн прозрачен.',
            author: 'Joe Sparano',
            lang: 'ru'
        }
    ];

    const lang = req.query.lang;

    let filteredQuotes = quotes;

    if (lang === 'en') {
        filteredQuotes = quotes.filter(quote => quote.lang === 'en');
    }

    if (filteredQuotes.length === 0) {
        return res.status(500).json({
            error: 'No quotes available'
        });
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];

    res.json({
        text: randomQuote.text,
        author: randomQuote.author,
        lang: randomQuote.lang
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
