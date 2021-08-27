const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shortenURL', {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, '[Mongoose] Connection Error'));
db.once('open', function() 
{
    console.log('[Mongoose] Connection Success');
})

const path = require('path');
app.set('views', path.join(__dirname, 'views'))

const URL = require('./models/Url');

const validUrl = require('valid-url');

app.get('/url', (req, res) => {
    res.render('pages/home');
})

app.get('/url/:id', async (req, res) => 
{
    const { id } = req.params;
    let foundURL;

    try
    {
        foundURL = await URL.findById(id);
        res.redirect(foundURL.url);
    }
    catch (e)
    {
        console.log(`Error: Could not find URL with id ${id}`)
        res.redirect('/url');
    }
})

app.post('/url', async (req, res) => {
    console.log(req.body);

    if(validUrl.isUri(req.body.url))
    {
        const newURL = new URL({url: req.body.url});
        await newURL.save();
        res.send(`YOUR NEW URL IS: localhost:3001/url/${newURL._id}`);
    }
    else
    {
        res.send('Invalid URL! Please refresh and try again...')
    }
})

app.get('*', function(req, res){
    res.status(404).send('what???');
});

app.listen('3001', () => {
    console.log('[Express] Listening on PORT 3000');
})