const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     String,
  image:    String,
  price:    Number,
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  user:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems:      [orderItemSchema],
  shippingAddress: {
    fullName: String,
    phone:    String,
    street:   String,
    city:     String,
    state:    String,
    pincode:  String,
  },
  paymentMethod:   { type: String, enum: ['stripe', 'cod'], default: 'cod' },
  paymentStatus:   { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  stripePaymentId: { type: String },
  orderStatus:     {
    type: String,
    enum: ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'processing',
  },
  itemsPrice:      { type: Number, required: true },
  shippingPrice:   { type: Number, default: 0 },
  taxPrice:        { type: Number, default: 0 },
  totalPrice:      { type: Number, required: true },
  deliveredAt:     Date,
  paidAt:          Date,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
