const mongoose = require('mongoose');
const en = require("nanoid-good/locale/en"); 
const nanoid = require("nanoid-good").nanoid(en);
nanoid(8);


const Schema = mongoose.Schema;


const urlSchema = new Schema({
    _id:
    {
        type: String,
        default: nanoid(8)
    },
    url:
    {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('URL', urlSchema);