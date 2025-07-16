require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const stripe = require('stripe')(process.env.PAYMENT_GATEWAY_KEY);

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
    const userCollection = database.collection('users')
    const policiesCollection = database.collection('policies')
    const applicationsCollection = database.collection('applications')
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

app.get("/applications/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const application = await applicationsCollection.findOne({ _id: new ObjectId(id) });

    if (!application) {
      return res.status(404).send({ message: "Application not found" });
    }

    res.send(application);
  } catch (err) {
    res.status(500).send({ message: "Failed to fetch application", error: err });
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

app.get("/applications/assigned/:email", async (req, res) => {
  const email = req.params.agentEmail;
  try {
    const result = await 
      applicationsCollection.find({ assignedAgent: email })
      .toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch assigned applications", error });
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

app.get("/users", async (req, res) => {
  try {
    const result = await userCollection.find().toArray();
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "Failed to fetch users" });
  }
});

app.get("/agents/featured", async (req, res) => {
  try {
    const agents = await userCollection
      .find({ role: "agent" })
      .sort({ _id: -1 })
      .limit(3)
      .toArray();
    res.send(agents);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch agents" });
  }
});


// GET: Latest 5 customer reviews
app.get("/reviews", async (req, res) => {
  try {
    const reviews = await reviewsCollection
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    res.send(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).send({ message: "Failed to fetch reviews" });
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


app.get("/policy", async (req, res) => {
  try {
    const policies = await policiesCollection.find().toArray();
    res.send(policies);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch policies", error });
  }
});
app.get("/users/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: "Failed to fetch user", error: err.message });
  }
});



    app.get('/policies', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const category = req.query.category;
    const search = req.query.search;

    const query = {};
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

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

app.get("/users/:email", async (req, res) => {
  const email = req.params.email;

  try {
    const user = await userCollection.findOne({ email });
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch user profile", error });
  }
});

app.get("/claims/user/:email", async (req, res) => {
  const email = req.params.email;
  const claims = await claimsCollection.find({ userEmail: email }).toArray();
  res.send(claims);
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

app.get('/blogs/agent/:email', async (req, res) => {
  const email = req.params.email;
  try {
    const blogs = await blogsCollection.find({ email }).toArray();
    res.send(blogs);
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch blogs' });
  }
});
app.get("/claims", async (req, res) => {
  try {
    const claims = await claimsCollection.find().sort({ _id: -1 }).toArray(); // newest first
    res.send(claims);
  } catch (err) {
    res.status(500).send({ message: "Failed to fetch claims" });
  }
});


// GET: Top 6 Most Purchased Policies
app.get("/popular-policies", async (req, res) => {
  try {
    const popularPolicies = await policiesCollection
      .find({})
      .sort({ purchaseCount: -1 }) // Sort by most purchased
      .limit(6) // Limit to top 6
      .toArray();

    res.status(200).send(popularPolicies);
  } catch (err) {
    console.error(" Error fetching popular policies:", err);
    res.status(500).send({ message: "Failed to fetch popular policies" });
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

app.get("/transactions", async (req, res) => {
  try {
    const paidApps = await applicationsCollection.find({ paymentStatus: "Paid" }).toArray();

    const transactions = paidApps.map(app => ({
      transactionId: app.transactionId || "N/A",
      email: app.email,
      policyName: app.policyName,
      amount: app.premium,
      date: new Date(app.updatedAt || app.createdAt || Date.now()).toLocaleDateString(),
      status: "Success"
    }));

    res.send(transactions);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch transactions" });
  }
});


app.get("/transactions/total-income", async (req, res) => {
  try {
    const paidApps = await applicationsCollection.find({ paymentStatus: "Paid" }).toArray();
    const total = paidApps.reduce((sum, app) => sum + parseFloat(app.premium || 0), 0);
    res.send({ totalIncome: total });
  } catch (error) {
    res.status(500).send({ message: "Failed to calculate total income" });
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

app.patch("/users/:email", async (req, res) => {
  const email = req.params.email;
  const updateData = req.body;

  try {
    const result = await userCollection.updateOne(
      { email },
      { $set: updateData }
    );

    if (result.modifiedCount > 0) {
      res.send({ message: "Profile updated successfully" });
    } else {
      res.status(400).send({ message: "No changes made or user not found" });
    }
  } catch (err) {
    res.status(500).send({ message: "Failed to update user", error: err.message });
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

app.patch("/claims/:id/approve", async (req, res) => {
  const claimId = req.params.id;

  try {
    const result = await claimsCollection.updateOne(
      { _id: new ObjectId(claimId) },
      { $set: { status: "Approved" } }
    );

    if (result.modifiedCount > 0) {
      res.send({ message: "Claim approved" });
    } else {
      res.status(404).send({ message: "Claim not found or already approved" });
    }
  } catch (err) {
    res.status(500).send({ message: "Failed to approve claim" });
  }
});


app.patch("/applications/:id/reject", async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason) {
    return res.status(400).send({ message: "Rejection reason is required" });
  }

  try {
    const result = await applicationsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "Rejected",
          adminFeedback: reason,
          rejectedAt: new Date()
        }
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).send({ message: "Application not found or already rejected" });
    }

    res.send({ message: "Application rejected successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Failed to reject application" });
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

app.post('/blogs', async (req, res) => {
  const blog = req.body;
  try {
    const result = await blogsCollection.insertOne(blog);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Failed to create blog' });
  }
});

// Route: POST /create-payment-intent
app.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount < 100) {
    return res.status(400).send({ error: "Invalid amount" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "bdt",
      payment_method_types: ["card"],
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe Error:", err.message);
    res.status(500).send({ error: err.message });
  }
});
app.post("/claims", async (req, res) => {
  const claim = req.body;
  const result = await claimsCollection.insertOne(claim);
  res.send(result);
});



app.patch('/blogs/:id', async (req, res) => {
  const id = req.params.id;
  const updatedBlog = req.body;

  try {
    const result = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedBlog }
    );
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Failed to update blog' });
  }
});





app.patch("/applications/:id/status", async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  try {
    // Update application status
    const updateRes = await applicationsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );


    if (status === "Approved") {
      const application = await applicationsCollection.findOne({ _id: new ObjectId(id) });
      if (application?.policyId) {
        await policiesCollection.updateOne(
          { _id: new ObjectId(application.policyId) },
          { $inc: { purchaseCount: 1 } }
        );
      }
    }

    res.send(updateRes);
  } catch (error) {
    res.status(500).send({ message: "Failed to update status", error });
  }
});

// Route: PATCH /applications/:id/pay
app.patch("/applications/:id/pay", async (req, res) => {
  const { id } = req.params;
  const { transactionId } = req.body;

  try {
    const result = await applicationsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          paymentStatus: "Paid",
          transactionId,
          paymentDate: new Date(),
        },
      }
    );
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Payment update failed" });
  }
});


app.patch("/applications/:id/assign", async (req, res) => {
  try {
    const id = req.params.id;
    const { agentEmail } = req.body;

    const result = await applicationsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { agentEmail: agentEmail } }
    );

    if (result.modifiedCount > 0) {
      res.send({ message: "Agent assigned successfully", success: true });
    } else {
      res.status(404).send({ message: "Application not found", success: false });
    }
  } catch (error) {
    res.status(500).send({ message: "Server error", error });
  }
});


app.patch("/users/promote/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await userCollection.updateOne(
      { _id: new ObjectId(id), role: "user" },
      { $set: { role: "agent" } }
    );
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "Failed to promote user" });
  }
});

// PATCH demote agent to customer
app.patch("/users/demote/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await userCollection.updateOne(
      { _id: new ObjectId(id), role: "agent" },
      { $set: { role: "user" } }
    );
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "Failed to demote user" });
  }
});

app.patch("/policies/:id", async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;

  try {
    const result = await policiesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to update policy", error });
  }
});

app.post("/policies", async (req, res) => {
  const policy = req.body;

  try {
    const result = await policiesCollection.insertOne(policy);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to create policy", error });
  }
});

app.delete("/policies/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await policiesCollection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to delete policy", error });
  }
});

app.delete('/blogs/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Failed to delete blog' });
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
