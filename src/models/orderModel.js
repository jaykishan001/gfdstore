import mongoose, { Schema } from "mongoose";
const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  discountedAmount: { type: Number, default: 0 },

  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
  },
  shippingAddress: {
    type: Schema.Types.ObjectId,
    ref: "Address",
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
