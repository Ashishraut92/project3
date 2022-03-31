const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const review = new mongoose.Schema({
    bookId: {
        type: ObjectId,
        required: true,
        ref: 'bookModel'
    },
    reviewedBy: {
        type: String,
        required: true,
        default: 'Guest',
        trim: true
    },
    reviewedAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true 
    },
    review: {
        type: String,
        default: 'No comments on this book yet.',
        trim: true 
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date 
    }

}, { timestamps: true })

module.exports = mongoose.model('reviewModel', review)
