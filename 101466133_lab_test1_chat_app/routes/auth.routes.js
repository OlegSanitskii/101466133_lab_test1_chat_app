const express = require("express")
const router = express.Router()
const User = require("../models/User")

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { username, firstname, lastname, password } = req.body

    const user = await User.create({ username, firstname, lastname, password })

    res.json({
      ok: true,
      message: "User created",
      user: {
        _id: user._id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    })
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(400).json({ ok: false, message: "Username already exists" })
    }
    if (err && err.name === "ValidationError") {
      return res.status(400).json({ ok: false, message: err.message })
    }

    console.log(err)
    res.status(500).json({ ok: false, message: "Server error" })
  }
})

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    if (!user) return res.status(400).json({ ok: false, message: "Invalid credentials" })

    if (user.password !== password) {
      return res.status(400).json({ ok: false, message: "Invalid credentials" })
    }

    res.json({
      ok: true,
      message: "Login success",
      user: {
        _id: user._id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ ok: false, message: "Server error" })
  }
})

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.json({ ok: true, message: "Logged out" })
})

module.exports = router
