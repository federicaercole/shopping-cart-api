const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const apiRouter = require('./routes/api');

const app = express();

const corsOptions = {
    origin: 'https://shopapp.federicaercole.com',
    optionsSuccessStatus: 200,
}

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', apiRouter);

app.use(function (req, res, next) {
    const error = new Error("This page doesn't exist");
    error.status = 404;
    next(error);
})

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ message: err.message });
});

app.listen(process.env.PORT);