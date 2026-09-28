const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.urlencoded({ extended: true }));

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

let db;

async function connectDB() {
    await client.connect();
    db = client.db("loginDB");
    console.log("Connected to MongoDB");
}
connectDB();


// REGISTER
app.post("/save", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const collection = db.collection("users");

        const existing = await collection.findOne({ email });
        if (existing) {
            return res.send("User already exists");
        }

        await collection.insertOne({ name, email, password });
        res.send("Registered successfully");

    } catch (err) {
        res.send(err.message);
    }
});


// LOGIN
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const collection = db.collection("users");

        const user = await collection.findOne({ email, password });

        if (!user) {
            return res.send("Invalid email or password");
        }

        res.send("Login successful");

    } catch (err) {
        res.send(err.message);
    }
});


// DISPLAY
app.get("/display", async (req, res) => {
    try {
        const users = await db.collection("users").find().toArray();
        res.send(users);
    } catch (err) {
        res.send(err.message);
    }
});


// UPDATE
app.post("/update", async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await db.collection("users").updateOne(
            { email },
            { $set: { password } }
        );

        if (result.matchedCount === 0) {
            return res.send("User not found");
        }

        res.send("User updated successfully");

    } catch (err) {
        res.send(err.message);
    }
});


// DELETE
app.post("/delete", async (req, res) => {
    try {
        const { email } = req.body;

        const result = await db.collection("users").deleteOne({ email });

        if (result.deletedCount === 0) {
            return res.send("User not found");
        }

        res.send("User deleted successfully");

    } catch (err) {
        res.send(err.message);
    }
});


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});