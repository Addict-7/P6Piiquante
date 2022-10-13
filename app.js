const express = require('express');
require("dotenv").config();
const mongoose = require('mongoose');
const path = require('path');
//const helmet = require('helmet');
const cors = require('cors');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.connect(`mongodb://${process.env.USERID}:${process.env.PASSWORD}@ac-nq9oc5b-shard-00-00.nkcjmkr.mongodb.net:27017,
                  ac-nq9oc5b-shard-00-01.nkcjmkr.mongodb.net:27017,ac-nq9oc5b-shard-00-02.nkcjmkr.
                  mongodb.net:27017/?ssl=true&replicaSet=atlas-g7cw20-shard-0&authSource=admin&
                  retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log(error));

const app = express();

app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(express.json());

//app.use(helmet());
app.use(cors());

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