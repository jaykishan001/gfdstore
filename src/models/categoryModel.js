import mongoose, { Schema } from "mongoose";
const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  createdAt: { type: Date, default: Date.now },
});

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
