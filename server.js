const express = require('express');
const app = express();

const mongoose = require('mongoose');
const dotenv = require("dotenv")
mongoose.connect('mongodb://localhost:27017/tuit-db')
dotenv.config()

const PORT = 4000;
app.listen(PORT);
