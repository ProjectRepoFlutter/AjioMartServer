const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  // isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  email:{type:String},
  phone:{type:String},
  // contact: {
  //   type: { type: String, enum: ['mobile', 'email'], required: true },
  //   value: { type: String, required: true },
  // },
  // role: {
  //   type: String,
  //   enum: ['admin', 'vendor', 'customer'],
  //   default: 'customer',
  // },
  // addresses: [{
  //   type: String,
  // }],
  // wishlist: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Product',
  // }],
  // cart: [{
  //   product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  //   quantity: { type: Number, default: 1 },
  // }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
