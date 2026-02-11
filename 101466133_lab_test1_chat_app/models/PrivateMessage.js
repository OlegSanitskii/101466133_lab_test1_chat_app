const mongoose = require("mongoose")

const privateMessageSchema = new mongoose.Schema(
  {
    from: { type: String, required: true, trim: true },
    to: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true, minlength: 1, maxlength: 1000 },
  },
  { timestamps: true }
)

module.exports = mongoose.model("PrivateMessage", privateMessageSchema)
