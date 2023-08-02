const express = require('express');
require('dotenv').config();
const apiRouter = require('./routes/api');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', apiRouter);

app.use(function (req, res, next) {
    const error = new Error("This page doesn't exist");
    error.status = 404;
    next(error);
})

app.use((err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode);
    res.json({ message: err.message });
});

app.listen(process.env.PORT, () => console.log('Server started'));