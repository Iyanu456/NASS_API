const express = require("express");
const router = express.Router();
const User = require ('../models/user_model');
const multer = require("multer");
const authenticate = require("../middlewares/authenticate");
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // Limit file size to 5MB

// Profile Picture Upload Route
router.post("/upload-profile-picture", authenticate, upload.single("profilePicture"), async (req, res) => {
  try {
    // Get the user ID from the request (usually passed as part of the authentication token)
    const userId = req.user.id; // Make sure to implement authentication

    // Get the profile picture (Base64 string or binary data)
    const profilePicture = req.file ? req.file.buffer.toString("base64") : null;

    // Find the user and update their profile picture
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ ok: false, msg: "User not found" });
    }

    res.status(200).json({ ok: true, msg: "Profile picture uploaded successfully", user: updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: "Failed to upload profile picture" });
  }
});

module.exports = router;
