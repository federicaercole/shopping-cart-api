const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    return res.send('Received a GET HTTP method');
});

module.exports = router;