import dbConnect from "@app/lib/dbConnect";
import Category from "@models/categoryModel";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");

  if (!categoryId) {
    return NextResponse.json(
      { message: "Category Id is required" },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    const category = await Category.findById(categoryId).populate("products");

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    if (!Array.isArray(category.products) || category.products.length === 0) {
      return NextResponse.json(
        { message: "No Products found for this category" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: category.products },
      { status: 200 }
    );
  } catch (error) {
    console.error("Products fetching failed: ", error);
    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
