import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },

    isGuest: { type: Boolean, default: false },

    guestDetails: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
    },

    products: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],

    totalAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
      index: true,
    },

    payment: {
      type: String,
      enum: ["Card", "UPI", "NetBanking", "COD", "Wallet"],
    },

    shippingAddress: { type: Schema.Types.ObjectId, ref: "Address" },

    guestShippingAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
