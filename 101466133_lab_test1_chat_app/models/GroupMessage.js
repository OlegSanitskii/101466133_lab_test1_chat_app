const mongoose = require("mongoose")

const groupMessageSchema = new mongoose.Schema(
  {
    roomName: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true },
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true, minlength: 1, maxlength: 1000 },
  },
  { timestamps: true }
)

module.exports = mongoose.model("GroupMessage", groupMessageSchema)
