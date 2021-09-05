const express = require('express');
const app = express();
const engine = require('ejs-mate');

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.engine('ejs', engine);

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shortenURL', {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, '[Mongoose] Connection Error'));
db.once('open', function() 
{
    console.log('[Mongoose] Connection Success');
})
const URL = require('./models/Url');

const path = require('path');
app.set('views', path.join(__dirname, 'views'))

const validUrl = require('valid-url');

// get routes

app.get('/url', (req, res) => {
    res.render('pages/home', { who: 'Home' });
})

app.get('/url/dashboard', async (req, res) => {
    const userLinks = await URL.find({});
    res.render('pages/dashboard', { who: 'Dashboard', userLinks });
})

app.get('/url/new', (req, res) => {
    res.render('pages/new', { who: 'New URL' })
})

app.get('/url/:id/details', async (req, res) => {
    const { id } = req.params;
    const foundURL = await URL.findById(id);
    res.render('pages/details', { who: 'Edit URL', foundURL })
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

// post routes

app.post('/url', async (req, res) => {
    console.log(req.body);

    if(validUrl.isWebUri(req.body.url))
    {
        const newURL = new URL({url: req.body.url});
        await newURL.save();
        res.send(`YOUR NEW URL IS: localhost:3001/url/${newURL._id}`);
    }
    else
    {
        res.redirect('/url/new');
    }
})

// port listen

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`[Express] Listening on PORT ${PORT}`);
})