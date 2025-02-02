import dbConnect from "@/app/lib/dbConnect";
import Category from "@/models/categoryModel";
import Product from "@/models/productModel";
import { uploadMultipleImages } from "../../lib/imageuploader";

import { NextResponse } from "next/server";
export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const category = formData.get("category");
    const price = formData.get("price");
    const stock = formData.get("stock");
    const sizeOptions = formData.getAll("sizeOptions");
    const images = formData.getAll("images");

    if (!name || !category || !price || !stock) {
      
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const uploadedImages = await uploadMultipleImages(images, "products");

    await dbConnect();

    const product = await Product.create({
      name,
      description,
      category,
      price,
      stock,
      images: uploadedImages,
      sizeOptions: sizeOptions || [],
    });

    await Category.findByIdAndUpdate(category, {
      $push: { products: { _id: product._id } },
    });

    console.log("product is created");
    return NextResponse.json(
      { message: "Product created", product },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error creating product", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const page = url.searchParams.get("page");
    const limit = url.searchParams.get("limit");
    const categories = url.searchParams.get("categories");
    const minPrice = Number(url.searchParams.get("minPrice")) || 0;
    const maxPrice = Number(url.searchParams.get("maxPrice")) || Infinity;
    const sizes = url.searchParams.get("sizes");

    const pageNum = Number(page?.trim()) || 1;
    const limitNum = Number(limit?.trim()) || 10;

    let filter = {
      price: { $gte: minPrice, $lte: maxPrice },
    };

    if (categories) {
      filter.category = { $in: categories.split(",") };
    }

    if (sizes) {
      filter.sizeOptions = { $in: sizes.split(",") };
    }

    const articles = await Product.aggregate([
      { $match: filter },
      {
        $facet: {
          metadata: [{ $count: "totalCount" }],
          data: [{ $skip: (pageNum - 1) * limitNum }, { $limit: limitNum }],
        },
      },
    ]);

    const totalProducts = articles[0].metadata[0]
      ? articles[0].metadata[0].totalCount
      : 0;
    const totalPages = Math.ceil(totalProducts / limitNum);

    return NextResponse.json(
      {
        products: articles[0].data,
        totalProducts,
        totalPages,
        currentPage: pageNum,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 }
    );
  }
}