/**Create a Node app that will fetch the data from below API and save in the table in MongoDB Or MySQL. Export this data using API end point from Node app with pagination and sorting
 
API - https://jsonplaceholder.typicode.com/posts */
const express = require('express');
const axios = require('axios');
const { log } = require('@nexus/schema/dist/utils');
const app = express();
const PORT = process.env.PORT || 3000;
const { MongoClient } = require('mongodb')

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// new MongoClient.connect('mongodb://localhost:27017').then(() => console.log('Mongodb is connected')).catch((err) => console.log(err))
const client = new MongoClient('mongodb://localhost:27017')
client.connect()
console.log("MongoDB is connecte");
const baseUrl = "https://jsonplaceholder.typicode.com/posts"
const db = client.db('PostCollection')
app.get('/getPost', async (req, res) => {
    let responce = await axios.get(baseUrl)
    const post = responce.data
    // const db = client.db('PostCollection')
    const collection = db.collection('Post')

    await collection.insertMany(post)
    console.log("data save in db");
    return res.status(200).json({ status: true, message: "Get post result", post })
})

app.get('/getSaveData', async (req, res) => {
    let page = req.query.page || 1
    let limit = req.query.limit || 10
    let skip = (page - 1) * limit;
    let findPost = await db.collection('Post').find({})
        .skip(skip)
        .limit(limit)
        .toArray()
    const totalPost = await db.collection('Post').countDocuments()
    let totalPages = Math.ceil(totalPost / limit);
    return res.status(200).json({
        status: true,
        message: "Get data",
        data: findPost,
        pagination: {
            totalPost: totalPost,
            currentPage: page,
            totalPages: totalPages,
            limit: limit
        }
    })
})
app.listen(PORT, () => {
    console.log(`Server is listen in http://localhost:${PORT}`);
})

// sumit.munot@neosofttech.com