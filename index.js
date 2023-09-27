const express = require ('express');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const path = require('path');
const albumRoutes = require('./routes/album.routes');


const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/phototheque');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'BXOdS2Dr58VZKTW9O6UbBbhcHaH5psAF',
    resave: false,
    saveUninitialized: true,
}));

app.use(flash());

app.get('/', (req, res) => {
    res.redirect('/albums');
});

app.use('/', albumRoutes);

app.use((req, res) => {
    res.status(404);
    res.send('Page non trouvée');
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500);
    res.send('Erreur interne du serveur');
});

app.listen(3000, ()=> {
    console.log('Application est lancée sur le port 3000');
});