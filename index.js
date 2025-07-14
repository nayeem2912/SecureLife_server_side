require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const uri=`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6ww4e81.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const client = new MongoClient(uri, {
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
    const quotesCollection = database.collection('quotes')




app.get("/applications/user/:email", async (req, res) => {
  const email = req.params.email;

  try {
    const applications = await applicationsCollection
      .find({ email })
      .sort({ appliedAt: -1 })
      .toArray();

    res.send(applications);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch applications" });
  }
});

  

    app.get('/applications', async (req, res) => {
  try {
    const result = await applicationsCollection.find().toArray();
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: 'Failed to fetch applications' });
  }
});


app.get("/quotes", async (req, res) => {
  const { policyId, email } = req.query;

  try {
    const quote = await database
      .collection("quotes")
      .find({ policyId, email })
      .sort({ createdAt: -1 }) 
      .limit(1)
      .toArray();

    res.send(quote[0] || {}); 
  } catch (err) {
    res.status(500).send({ message: "Failed to fetch quote" });
  }
});



app.get('/users/agents', async (req, res) => {
  try {
    const agents = await userCollection.find({ role: "agent" }).toArray();
    res.send(agents);
  } catch (err) {
    res.status(500).send({ message: "Failed to fetch agents" });
  }
});

    
    app.get("/policies/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const policy = await policiesCollection.findOne({ _id: new ObjectId(id) });
    res.send(policy);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch policy", error });
  }
});

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

// Get User Role by Email
app.get('/users/role/:email', async (req, res) => {
  const email = req.params.email;

  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await userCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ role: user.role });
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get("/blogs/:id", async (req, res) => {
  try {
    const blog = await blogsCollection.findOne({ _id: new ObjectId(req.params.id) });
    res.send(blog);
  } catch (err) {
    res.status(500).send({ message: "Failed to fetch blog" });
  }
});


app.get("/blogs", async (req, res) => {
  try {
    const blogs = await blogsCollection.find().sort({ publishDate: -1 }).toArray();
    res.send(blogs);
  } catch (err) {
    res.status(500).send({ message: "Failed to fetch blogs" });
  }
});

app.patch("/blogs/:id/visit", async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });

    if (!blog) return res.status(404).send({ message: "Blog not found" });

    const updated = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { visits: 1 } }
    );
    res.send(updated);
  } catch (err) {
    res.status(500).send({ message: "Failed to update visits" });
  }
});

// server.js or routes/reviews.js
app.post("/reviews", async (req, res) => {
  try {
    const review = req.body;

    if (!review.email || !review.policyName || !review.rating || !review.feedback) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    review.createdAt = new Date();

    const result = await reviewsCollection.insertOne(review);
    res.send(result);
  } catch (err) {
    console.error("Failed to save review:", err);
    res.status(500).send({ message: "Failed to save review" });
  }
});


app.post('/applications', async (req, res) => {
      const applicationData = req.body;

      if (!applicationData?.email || !applicationData?.name) {
        return res.status(400).send({ message: "Missing required fields" });
      }

      applicationData.status = "Pending";
      applicationData.appliedAt = new Date();

      const result = await applicationsCollection.insertOne(applicationData);
      res.send(result);
    });

    app.post("/quotes", async (req, res) => {
  const quoteData = req.body;

  try {
    quoteData.createdAt = new Date();

    const result = await quotesCollection.insertOne(quoteData);

    res.status(201).send({ message: "Quote saved", insertedId: result.insertedId });
  } catch (error) {
    console.error("Error saving quote:", error);
    res.status(500).send({ message: "Server error while saving quote" });
  }
});

   


  app.post("/users", async (req, res) => {
  try {
    const user = req.body;

    if (!user?.email ) {
      return res.status(400).send({ message: "Name and email are required" });
    }

    // Check if user already exists
    const existingUser = await userCollection.findOne({ email: user.email });
    if (existingUser) {
      return res.status(409).send({ message: "User already exists" });
    }

    user.status = "active";

    const result = await userCollection.insertOne(user);
    res.send(result);

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({ message: "Server error. Please try again later." });
  }
});

app.patch('/applications/:id/assign', async (req, res) => {
  const appId = req.params.id;
  const { agentEmail } = req.body;

  try {
    const result = await applicationsCollection.updateOne(
      { _id: new ObjectId(appId) },
      {
        $set: {
          agentEmail,
          status: "Approved", // You can change this logic if needed
          assignedAt: new Date(),
        },
      }
    );
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: 'Failed to assign agent' });
  }
});


app.patch('/applications/:id/reject', async (req, res) => {
  const appId = req.params.id;

  try {
    const result = await applicationsCollection.updateOne(
      { _id: new ObjectId(appId) },
      {
        $set: {
          status: "Rejected",
          rejectedAt: new Date(),
        },
      }
    );
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: 'Failed to reject application' });
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
