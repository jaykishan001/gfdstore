import mongoose from "mongoose";
const { Schema } = mongoose;

const addressSchema = new Schema({
  street: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
  phone: String,

  createdAt: { type: Date, default: Date.now },
});

const Address =
  mongoose.models.Address || mongoose.model("Address", addressSchema);

export default Address;
