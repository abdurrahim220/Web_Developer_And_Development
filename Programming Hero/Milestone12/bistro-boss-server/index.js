
const express = require("express");
const app = express();
require('dotenv').config()
var jwt = require('jsonwebtoken');
const cors = require('cors');


const port = process.env.PORT || 5000;

// middle
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hncbqqn.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const usersCollection = client.db("bistroBoss").collection("users");
        const menuCollection = client.db("bistroBoss").collection("menu");
        const reviewCollection = client.db("bistroBoss").collection("reviews");
        const cartCollection = client.db("bistroBoss").collection("carts");

        // jwt token

        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, env.process.ACCESS_TOKEN_SECRET, 'secret', { expiresIn: '1h' })
            res.send({ token })
        })

        // user related api
        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const existingUser = await usersCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: "user already exists" })
            }
            const result = await usersCollection.insertOne(user);
            res.send(result)
        })

        app.patch('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id)
            const filter = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    role: `admin`
                },
            };

            const result = await usersCollection.updateOne(filter, updateDoc)
            res.send(result)
        })

        // menu related apis
        app.get('/menu', async (req, res) => {
            const result = await menuCollection.find().toArray();
            res.send(result)
        })
        app.get('/review', async (req, res) => {
            const result = await reviewCollection.find().toArray();
            res.send(result)
        })

        //carts api collection 
        app.get('/carts', async (req, res) => {
            const email = req.query.email;
            // console.log(email)
            if (!email) {
                res.send([])
            }
            const query = { email: email }
            const result = await cartCollection.find(query).toArray();
            res.send(result)
        })

        app.post('/carts', async (req, res) => {
            const item = req.body;
            // console.log(item)
            const result = await cartCollection.insertOne(item);
            res.send(result)
        })

        // delete operation 

        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await cartCollection.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('boss is sitting');
})

app.listen(port, () => {
    console.log(`Bistro boss is sitting on port ${port}`)
})

/**
 * --------------------
 *      NAMING CONVENTION
 * --------------------
 * user: userCollection
 * app.get('/users') -- find many
 * app.get('/users/:id') -- find one or specific
 * app.post('users') -- to create a data in data base or server
 * app.patch('/uses/:id') -- on item or selective item to update or put
 * app.put('/users/:id') 
 * app.delete('/users/:id') 
 * 
 * 
 */