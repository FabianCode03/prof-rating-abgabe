const express = require("express");
const app = express();
const cors = require("cors");
const port = 8080;

// MongoDB database
require("dotenv").config();
const { MongoClient } = require("mongodb");
const url = process.env.COSMOS_CONNECTION_STRING;
const client = new MongoClient(url);

// Connect to the database and create the collection
async function connectAndCreateCollection() {
    await client.connect();
    const db = client.db("CloudComputinDB");
    const collections = await db.listCollections().toArray();
    const collectionExists = collections.some(
        (collection) => collection.name === "profs"
    );
    if (!collectionExists) {
        await db.createCollection("profs");
    }
}
connectAndCreateCollection().catch(console.error);

//Middleware
app.use(express.json()); //for parsing application/json
app.use(cors()); //for configuring Cross-Origin Resource Sharing (CORS)
function log(req, res, next) {
    console.log(req.method + " Request at" + req.url);
    next();
}
app.use(log);

// Get the database and collection
const db = client.db("CloudComputinDB");
const collection = db.collection("profs");
//Endpoints
app.get("/profs", async function (req, res) {
    const data = await collection.find().toArray();
    res.json(data);
});

app.get("/profs/:id", async function (req, res) {
    const data = await collection.findOne({ _id: ObjectId(req.params.id) });
    res.json(data);
});

app.put("/profs/:id", async function (req, res) {
    const updatedData = {
        $set: { name: req.body.name, rating: req.body.rating },
    };
    await collection.updateOne({ _id: ObjectId(req.params.id) }, updatedData);
    const data = await collection.findOne({ _id: ObjectId(req.params.id) });
    res.json(data);
});

app.delete("/profs/:id", async function (req, res) {
    await collection.deleteOne({ _id: ObjectId(req.params.id) });
    res.json({ message: "Deleted successfully" });
});

app.post("/profs", async function (req, res) {
    const newData = { name: req.body.name, rating: req.body.rating };
    collection
        .insertOne(newData)
        .then((result) => {
            if (result.acknowledged === true) {
                collection.findOne({ _id: result.insertedId }).then((data) => {
                    console.log(data);
                    res.json(data);
                });
            } else {
                res.status(500).send(
                    "An error occurred while inserting the document."
                );
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send(
                "An error occurred while inserting the document."
            );
        });
});
app.listen(port, () => console.log(`Server listening on port ${port}!`));
