const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema({
    title: { type: String, require: true, unique: true },
    excerpt: { type: String, require: true },
    userId: { type: ObjectId, ref: "user" },
    ISBN: { type: String, require: true, unique: true },
    category: { type: String, require: true },
    subcategory: { type: String, require: true },
    reviews: { type: Number, default: 0, comment: "Hold number of review" },
    deletedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
    releasedAt: { type: Date, require: true },
}, { timestamp: true });

module.exports = mongoose.model('Book', bookSchema)

