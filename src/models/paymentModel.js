import mongoose, { Schema } from "mongoose";
const paymentSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: "Order" },
  paymentMethod: { type: String, required: true },
  paymentAmount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
  paymentDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);

const Product =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;
