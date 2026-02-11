require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")
const path = require("path")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))
app.use("/view", express.static(path.join(__dirname, "view")))

mongoose.connect("mongodb://127.0.0.1:27017/labtest1")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "view/login.html"))
})

io.on("connection", (socket) => {
    console.log("User connected:", socket.id)

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id)
    })
})

const PORT = 5000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
