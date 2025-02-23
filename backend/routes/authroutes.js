const express = require("express");
const User = require("../models/user");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, age, gender, phone, password } = req.body;
    console.log("Received Signup Data:", req.body);

    const newUser = new User({ name, age, gender, phone, password });
    await newUser.save();
    
    console.log("User Saved:", newUser);
    res.json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Error signing up" });
  }
});

// ✅ LOGIN API
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    console.log("Login Request:", req.body);

    // Check for admin credentials
    if (phone === "1111111111" && password === "admin") {
      res.json({ success: true, message: "Admin login successful!", isAdmin: true });
      return;
    }

    // Regular user authentication
    const user = await User.findOne({ phone, password });
    if (user) {
      console.log("Login Success:", user);
      res.json({ success: true, message: "Login successful!", isAdmin: false });
    } else {
      console.log("Login Failed: User not found");
      res.status(401).json({ success: false, error: "Invalid phone or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/user/profile/:phone", async (req, res) => {
  try {
    const { phone } = req.params;
    const user = await User.findOne({ phone });
    
    if (user) {
      res.json({ 
        success: true, 
        user: {
          name: user.name,
          age: user.age,
          gender: user.gender,
          phone: user.phone
        }
      });
    } else {
      res.status(404).json({ success: false, error: "User not found" });
    }
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/users", async (req, res) => {
  try {
    // Find all users except admin (filtering by phone number)
    const users = await User.find({ phone: { $ne: "111" } });
    
    // Remove password field from response
    const sanitizedUsers = users.map(user => ({
      name: user.name,
      age: user.age,
      gender: user.gender,
      phone: user.phone
    }));
    
    res.json({ success: true, users: sanitizedUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
  }
});
router.put("/user/update/:phone", async (req, res) => {
  try {
    const { phone } = req.params;
    const { name, age, gender } = req.body;
    
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    user.name = name;
    user.age = age;
    user.gender = gender;
    await user.save();

    res.json({ 
      success: true, 
      user: {
        name: user.name,
        age: user.age,
        gender: user.gender,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
