const express = require('express');
const app = express();
app.use('view engine', 'ejs');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shortenURL');

const path = require('path');

const db = mongoose.connection;
db.on('error', console.error.bind(console, '[Mongoose] Connection Error'));
db.once('open', function() 
{
    console.log('[Mongoose] Connection Success');
})

app.get('/', (req, res) => {
    res.render('views/home')
})

app.listen('3000', () => {
    console.log('[Express] Listening on PORT 3000');
})