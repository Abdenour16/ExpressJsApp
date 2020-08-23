const mongoose = require('mongoose')
const coverImageBasePath = 'uplaods/productCovers'

const productSchema = new  mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    },
    price: {
        type: Number,
        required: true
    },
    publishDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    description: {
        type: String,
    },
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    }
})
  
  module.exports = mongoose.model('Product', productSchema)
  module.exports.coverImageBasePath = coverImageBasePath