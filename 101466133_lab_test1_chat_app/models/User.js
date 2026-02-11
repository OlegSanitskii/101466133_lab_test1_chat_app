const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
    firstname: { type: String, required: true, trim: true, minlength: 2 },
    lastname: { type: String, required: true, trim: true, minlength: 2 },
    password: { type: String, required: true, minlength: 4 },
  },
  { timestamps: true }
)

module.exports = mongoose.model("User", userSchema)
