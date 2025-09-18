const express = require('express')
const crypto = require('crypto')
const app = express()
const port = 3001;
const { Client } = require('@elastic/elasticsearch')
const esClient = new Client({ node : 'http://localhost:9200'});

app.post('/provision-index', async (req, res) => {
    try {
        indexName = crypto.randomBytes(6).toString('hex')
        await esClient.indices.create({ index:  indexName});
        res.status(201).json({
            status: 'SUCCESS',
            index_name: indexName
        })
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message : 'Could not create index'
        })
    }
})

app.listen(port, () => {
    console.log('SERVER IS RUNNING');
})