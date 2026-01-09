require('dotenv').config();
const express = require('express');
const routes = require('./routes/post.routes');

const app = express();

app.use(express.json());
app.use('/posts', routes);

module.exports = app;