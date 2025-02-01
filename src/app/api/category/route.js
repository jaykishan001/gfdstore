import dbConnect from "@/app/lib/dbConnect";
import Category from "@/models/categoryModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { name, description = "" } = await req.json();

  if (!name) {
    return NextResponse.json({ message: "Name is required" });
  }

  const categoryName = name.toLowerCase().trim();

  await dbConnect();

  try {
    const existedCategory = await Category.findOne({ name: categoryName });
    if (existedCategory) {
      return NextResponse.json({ message: "Category already exists" });
    }
    const category = await Category.create({ name: categoryName, description });

    if (!category) {
      return NextResponse.json({ message: "Category creation failed" });
    }

    return NextResponse.json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    console.error("Category creation failed: ", error);
    return NextResponse.json({ message: error.message });
  }
}

export async function GET() {
  await dbConnect();

  try {
    const categories = await Category.find({});
    if (categories.length === 0) {
      return NextResponse.json(
        { message: "No categories found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, data: categories },
      { status: 200 }
    );
  } catch (error) {
    console.error("Category fetching failed: ", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    const { id } = req.query;
    await dbConnect();
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return NextResponse.json({ message: "Category not found" });
    }
    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
      console.error("Category deletion failed: ", error);
      return NextResponse.json({ message: error.message });
  }
}