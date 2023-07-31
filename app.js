const express = require('express');
require('dotenv').config();
const apiRouter = require('./routes/api');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', apiRouter);

app.listen(process.env.PORT, () => console.log('Server started'));