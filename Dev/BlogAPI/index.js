const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://ayush:qMyxXcwm5G69KZ3@cluster0.dcubcr0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("Failed to connect to MongoDB:", err);
});

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  publicationDate: Date,
  author: String
});

const Blog = mongoose.model("Blog", blogSchema);

// Routes

// Get all blog posts
app.get('/posts', async (req, res) => {
  try {
    const { sortBy, filterByAuthor } = req.query;
    let query = {};
    if (filterByAuthor) {
      query = { author: filterByAuthor };
    }
    const posts = await Blog.find(query).sort(sortBy || '-publicationDate');
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new blog post
app.post('/create', async (req, res) => {
  const { title, content, author } = req.body;
  const publicationDate = new Date();
  try {
    const blog = new Blog({ title, content, publicationDate, author });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a blog post
app.put('/posts/:id', async (req, res) => {
  const postId = req.params.id;
  const { title, content, author } = req.body;
  try {
    const updatedPost = await Blog.findByIdAndUpdate(postId, { title, content, author }, { new: true });
    if (!updatedPost) {
      res.status(404).json({ error: 'Post not found' });
    } else {
      res.json(updatedPost);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a blog post
app.delete('/posts/:id', async (req, res) => {
  const postId = req.params.id;
  try {
    const deletedPost = await Blog.findByIdAndDelete(postId);
    if (!deletedPost) {
      res.status(404).json({ error: 'Post not found' });
    } else {
      res.status(204).end();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
