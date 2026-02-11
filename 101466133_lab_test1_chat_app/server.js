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

const app = express()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: "*" } })

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
  console.log("User connected:", socket.id)

  socket.on("joinRoom", (roomName) => {
    socket.join(roomName)
    console.log(`Socket ${socket.id} joined room: ${roomName}`)
  })

  socket.on("sendGroupMessage", async (data) => {
    try {
      const { roomName, username, firstname, lastname, message } = data

      if (!roomName || !username || !firstname || !lastname || !message) {
        return
      }

      const newMessage = await GroupMessage.create({
        roomName,
        username,
        firstname,
        lastname,
        message,
      })

      io.to(roomName).emit("newGroupMessage", newMessage)
    } catch (err) {
      console.log(err)
    }
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})


const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))