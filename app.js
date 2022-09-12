const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb://Addict_95:jesuisunelicorne0@ac-nq9oc5b-shard-00-00.nkcjmkr.mongodb.net:27017,ac-nq9oc5b-shard-00-01.nkcjmkr.mongodb.net:27017,ac-nq9oc5b-shard-00-02.nkcjmkr.mongodb.net:27017/?ssl=true&replicaSet=atlas-g7cw20-shard-0&authSource=admin&retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;