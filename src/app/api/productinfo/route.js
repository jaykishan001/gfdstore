import Product from "../../../models/productModel.js";
import dbConnect from "../../lib/dbConnect.js";

import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json(
      { message: "Product Id is required" },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error) {
    console.error("Product fetching failed: ", error);
    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
