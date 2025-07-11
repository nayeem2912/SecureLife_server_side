require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;



const client = new MongoClient(process.env.URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
     const database = client.db('secure_life')
    const massageCollection = database.collection('massage')
    const userCollection = database.collection('user')
    const policiesCollection = database.collection('policies')
    const applicationsCollection = database.collection('applications')
    const transactionsCollection = database.collection('transactions')
    const blogsCollection = database.collection('blogs')
    const reviewsCollection = database.collection('reviews')
    const claimsCollection = database.collection('claims')


    app.get('/policies', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;      
    const limit = parseInt(req.query.limit) || 9;    
    const skip = (page - 1) * limit;

    const category = req.query.category;

    const query = category ? { category: category } : {};

    const total = await policiesCollection.countDocuments(query);
    const policies = await policiesCollection
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();

    res.send({
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      policies
    });
  } catch (err) {
    res.status(500).send({ message: "Failed to fetch policies", error: err.message });
  }
});




    app.post("/subscriptions", async (req, res) => {
      const { name, email } = req.body;

      if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required." });
      }

      try {
        const existing = await massageCollection.findOne({ email });
        if (existing) {
          return res.status(409).json({ message: "Already subscribed!" });
        }

        const newSubscription = {
          name,
          email,
          date: new Date(),
        };

        await massageCollection.insertOne(newSubscription);
        res.status(201).json({ message: "Subscription successful!" });
      } catch (err) {
        console.error("Error saving subscription:", err);
        res.status(500).json({ message: "Server error" });
      }
    });


    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Life Insurance Server Running...')
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
