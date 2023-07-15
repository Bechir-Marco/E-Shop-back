const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        defualt: '',
    },
    phone: {
        type: String,
        required: true,
    },
    isAdmin: { type: Boolean, default: false },   
    apartment: {
        type: String,
        default: '',
    },
    city: {
        type: String,
        default: '',
    },
    zip: {
        type: String,
        default: '',
    },
    country: {
        default: String,
    },


}, { timestamps: true });

userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
userSchema.set('toJSON', {
  virtuals: true,
});
exports.User = mongoose.model('User', userSchema);
