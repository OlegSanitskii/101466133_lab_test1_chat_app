const express = require("express")
const GroupMessage = require("../models/GroupMessage")
const PrivateMessage = require("../models/PrivateMessage")

const router = express.Router()

// GET /api/messages/group?roomName=General
router.get("/group", async (req, res) => {
  try {
    const { roomName } = req.query
    if (!roomName) return res.status(400).json({ ok: false, message: "roomName is required" })

    const messages = await GroupMessage.find({ roomName }).sort({ createdAt: 1 }).limit(200)
    res.json({ ok: true, messages })
  } catch (err) {
    console.log(err)
    res.status(500).json({ ok: false, message: "Server error" })
  }
})

// GET /api/messages/private?userA=oleg1&userB=alex1
router.get("/private", async (req, res) => {
  try {
    const { userA, userB } = req.query
    if (!userA || !userB) return res.status(400).json({ ok: false, message: "userA and userB are required" })

    const messages = await PrivateMessage.find({
      $or: [
        { from: userA, to: userB },
        { from: userB, to: userA },
      ],
    })
      .sort({ createdAt: 1 })
      .limit(200)

    res.json({ ok: true, messages })
  } catch (err) {
    console.log(err)
    res.status(500).json({ ok: false, message: "Server error" })
  }
})

module.exports = router
