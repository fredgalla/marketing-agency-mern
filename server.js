require("dotenv").config();
const mongoose = require("mongoose");
const Contact = require("./models/Contact");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(function() {
    console.log("Connected to MongoDB");
  })
  .catch(function(error) {
    console.log("MongoDB connection error:", error);
  });

const submissions = [];

app.use(cors());
app.use(express.json());

app.get("/", function(req, res) {
  res.send("Server is running!");
});

app.post("/contact", async function(req, res) {
  try {

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
    return res.status(400).json({
    message: "Please fill out all fields."

  });
}
    
    const contact = new Contact(req.body);

    await contact.save();

    res.json({
      message: "Contact form saved to MongoDB"
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error. Please try again later."
    });
  }
});

const PORT = process.env.PORT || 3000;

function checkAuth(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

app.get("/submissions", checkAuth, async function(req, res) {
  const contacts = await Contact.find();
  res.json(contacts);
});

app.delete("/submissions/:id", checkAuth, async function(req, res) {
  try {
    await Contact.findByIdAndDelete(req.params.id);

    res.json({
      message: "Submission deleted successfully"
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error. Could not delete submission."
    });
  }
});

app.post("/login", function(req, res) {
  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign(
      { role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: "Invalid password" });
  }
});

app.listen(PORT, function() {
  console.log(`Server started on port ${PORT}`);
});

