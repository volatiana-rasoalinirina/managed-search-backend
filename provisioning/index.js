const express = require('express')
const app = express()
const port = 3001;

app.post('/provision-index', async (req, res) => {
    res.status(200).json({
        status: 'TEST SUCCESS'
    });
})

app.listen(port, () => {
    console.log('SERVER IS RUNNING');
})