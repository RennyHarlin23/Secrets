require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.static('public'));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const ejs = require('ejs');
app.set('view engine', 'ejs');

const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/userDB');
    console.log("Mongoose connected");
}

const encrypt = require("mongoose-encryption");



const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});
const secret = process.env.SECRET_KEY;

userSchema.plugin(encrypt, { secret: secret, encryptedFields : ["password"] });

const User = mongoose.model('user', userSchema);

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/register', (req, res) => {
    res.render('register');
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/register', (req, res) => {
    User.create({
        email: req.body.username,
        password: req.body.password,
    })
        .then(() => res.render('secrets'))
        .catch((err) => console.log(err));
})

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username })
        .then(response => {
            if (response.password === password) {
                res.render('secrets');
            } else {
                res.send('invalid user credentials');
        }
    })
})

app.listen(3000, () => console.log("The server is up and running in port 3000"));
