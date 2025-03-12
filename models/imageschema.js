const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    fileName: { type: String, required: true },
    category: { type: String, required: true } // Example: "wedding", "catering"
});

module.exports = mongoose.model("Image", ImageSchema);