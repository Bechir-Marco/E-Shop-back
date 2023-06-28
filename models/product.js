const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    richDescription: {
        type: String,
        default: ''
    },
    images: {
        type: String,
        default: ''
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    counInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    brand: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        default: 0
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
}, { timmestamps: true });

exports.Product = mongoose.model('Product', productSchema);
