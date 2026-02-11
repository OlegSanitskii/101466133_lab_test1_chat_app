require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")
const path = require("path")

const authRoutes = require("./routes/auth.routes")
const messageRoutes = require("./routes/messages.routes")

const GroupMessage = require("./models/GroupMessage")
const PrivateMessage = require("./models/PrivateMessage")

const app = express()
const server = http.createServer(app)

// socket.io + CORS
const io = new Server(server, {
  cors: { origin: "*" },
})

// middleware
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))
app.use("/view", express.static(path.join(__dirname, "view")))

// routes
app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

// db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err))

// default page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "view/login.html"))
})

// sockets
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id)

  // ===== GROUP =====
  socket.on("joinRoom", (roomName) => {
    const clean = (roomName || "").trim()
    if (!clean) return

    socket.join(clean)
    console.log(`👥 Socket ${socket.id} joined room: ${clean}`)
  })

  socket.on("sendGroupMessage", async (data) => {
    try {
      const { roomName, username, firstname, lastname, message } = data || {}
      if (!roomName || !username || !firstname || !lastname || !message) return

      const newMessage = await GroupMessage.create({
        roomName,
        username,
        firstname,
        lastname,
        message,
      })

      io.to(roomName).emit("newGroupMessage", newMessage)
    } catch (err) {
      console.log("❌ sendGroupMessage error:", err)
    }
  })

  // ===== PRIVATE =====
  socket.on("registerUser", (username) => {
    const clean = (username || "").trim()
    if (!clean) return

    socket.join(`user:${clean}`)
    console.log(`🔐 Socket ${socket.id} registered as user:${clean}`)
  })

  socket.on("sendPrivateMessage", async (data) => {
    try {
      const { from, to, message } = data || {}
      if (!from || !to || !message) return

      const newMsg = await PrivateMessage.create({ from, to, message })

      io.to(`user:${from}`).emit("newPrivateMessage", newMsg)
      io.to(`user:${to}`).emit("newPrivateMessage", newMsg)
    } catch (err) {
      console.log("❌ sendPrivateMessage error:", err)
    }
  })

  // ===== TYPING INDICATOR (GROUP + PRIVATE) =====

  // GROUP typing: notify everyone else in the room
  socket.on("typingRoom", ({ roomName, username } = {}) => {
    const cleanRoom = (roomName || "").trim()
    const cleanUser = (username || "").trim()
    if (!cleanRoom || !cleanUser) return

    // debug
    console.log(`⌨️ [GROUP typing] room=${cleanRoom} user=${cleanUser}`)

    socket.to(cleanRoom).emit("userTypingRoom", { username: cleanUser })
  })

  socket.on("stopTypingRoom", ({ roomName, username } = {}) => {
    const cleanRoom = (roomName || "").trim()
    const cleanUser = (username || "").trim()
    if (!cleanRoom || !cleanUser) return

    // debug
    console.log(`🛑 [GROUP stopTyping] room=${cleanRoom} user=${cleanUser}`)

    socket.to(cleanRoom).emit("userStopTypingRoom", { username: cleanUser })
  })

  // PRIVATE typing: notify only the target user (to)
  socket.on("typingPrivate", ({ from, to } = {}) => {
    const cleanFrom = (from || "").trim()
    const cleanTo = (to || "").trim()
    if (!cleanFrom || !cleanTo) return

    // debug
    console.log(`⌨️ [PRIVATE typing] from=${cleanFrom} to=${cleanTo} -> room=user:${cleanTo}`)

    io.to(`user:${cleanTo}`).emit("userTypingPrivate", { from: cleanFrom })
  })

  socket.on("stopTypingPrivate", ({ from, to } = {}) => {
    const cleanFrom = (from || "").trim()
    const cleanTo = (to || "").trim()
    if (!cleanFrom || !cleanTo) return

    // debug
    console.log(`🛑 [PRIVATE stopTyping] from=${cleanFrom} to=${cleanTo} -> room=user:${cleanTo}`)

    io.to(`user:${cleanTo}`).emit("userStopTypingPrivate", { from: cleanFrom })
  })

  socket.on("disconnect", () => {
    console.log("👋 User disconnected:", socket.id)
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
