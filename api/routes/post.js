const express = require("express");
const Post = require("../models/post_model");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();
const User = require("../models/user_model");

// Create a new post
router.post("/", authenticate, async (req, res) => {
    try {
      const { title, content, tag } = req.body;

      // Fetch the user's name from the database using the ID from req.user
      const user = await User.findById(req.user.id).select("name");
      if (!user) {
        return res.status(404).json({ ok: false, msg: "User not found" });
      }
      const author = user.name; // Assuming req.user is the authenticated user and contains the ID
  
      const newPost = new Post({ title, content, author, tag: tag || null });
      await newPost.save();
  
      res.status(201).json({
        ok: true,
        msg: "Post created successfully",
        post: newPost.toJSON({ virtuals: true })
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Failed to create post" });
    }
  });
// Read all posts


// Read all posts with pagination
router.get("/", async (req, res) => {
    try {
      // Get pagination parameters (default to page 1 and limit 10)
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
  
      // Calculate the number of posts to skip based on the page
      const skip = (page - 1) * limit;
  
      // Find posts and apply pagination (skip, limit) and populate the author field
      const posts = await Post.find()
        .skip(skip) // Skip posts based on the page number
        .limit(limit) // Limit the number of posts per page
        .populate("author", "name") // Populate the author's name
        .exec();
  
      // Count the total number of posts for pagination metadata
      const totalPosts = await Post.countDocuments();
  
      // Calculate the total number of pages
      const totalPages = Math.ceil(totalPosts / limit);
  
      // Return the paginated posts along with pagination info
      res.status(200).json({
        ok: true,
        msg: "Posts fetched successfully",
        posts: posts.map(post => post.toJSON({ virtuals: true })),
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalPosts: totalPosts,
          postsPerPage: limit
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ ok: false, msg: "Failed to fetch posts" });
    }
  });
  
// Read a single post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ ok: false, msg: "Post not found" });
    res.status(200).json({ ok: true, msg: "Post fetched successfully", post: post.toJSON({ virtuals: true }) });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Failed to fetch post" });
  }
});

// Update a post
router.put("/:id", authenticate, async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedPost) return res.status(404).json({ ok: false, msg: "Post not found" });
    res.status(200).json({ ok: true, msg: "Post updated successfully", post: updatedPost.toJSON({ virtuals: true }) });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Failed to update post" });
  }
});

// Delete a post
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ ok: false, msg: "Post not found" });
    res.status(200).json({ ok: true, msg: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Failed to delete post" });
  }
});

module.exports = router;
