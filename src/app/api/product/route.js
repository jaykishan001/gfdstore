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
    const price = parseFloat(formData.get("price"));
    const stock = parseInt(formData.get("stock"));
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
      $push: { products: product._id },
    });

    return NextResponse.json(
      { message: "Product created successfully", product },
      { status: 201 }
    );
  } catch (error) {
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
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 10;
    const categories = url.searchParams.get("categories");
    const minPrice = Number(url.searchParams.get("minPrice")) || 0;
    const maxPrice = Number(url.searchParams.get("maxPrice")) || Infinity;
    const sizes = url.searchParams.get("sizes");
    const search = url.searchParams.get("search")?.trim() || "";

    const pageNum = Number(page?.trim()) || 1;
    const limitNum = Number(limit?.trim()) || 10;

    let filter = {
      price: { $gte: minPrice, $lte: maxPrice },
    };

    if (categories) filter.category = { $in: categories.split(",") };
    if (sizes) filter.sizeOptions = { $in: sizes.split(",") };
    if (search) filter.name = { $regex: search, $options: "i" };

    const productsData = await Product.aggregate([
      { $match: filter },
      { $sort: { updatedAt: -1 } },
      {
        $facet: {
          metadata: [{ $count: "totalCount" }],
          data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
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
    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const productId = url.searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Find the product to get its category
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    await Category.findByIdAndUpdate(product.category, {
      $pull: { products: { _id: productId } },
    });

    // Delete the product
    await Product.findByIdAndDelete(productId);

    console.log("Product deleted successfully");
    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error deleting product", error: error.message },
      { status: 500 }
    );
  }
}
export async function PUT(req) {
  try {
    await dbConnect();
    const formData = await req.formData();
    const productId = formData.get("id");
    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const name = formData.get("name") || existingProduct.name;
    const description =
      formData.get("description") || existingProduct.description;
    const category = formData.get("category") || existingProduct.category;
    const price = formData.get("price") || existingProduct.price;
    const stock = formData.get("stock") || existingProduct.stock;
    const sizeOptions =
      formData.getAll("sizeOptions").length > 0
        ? formData.getAll("sizeOptions")
        : existingProduct.sizeOptions;
    const newImages = formData.getAll("images");

    let updatedImages = existingProduct.images;
    if (newImages.length > 0) {
      updatedImages = await uploadMultipleImages(newImages, "products");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        description,
        category,
        price,
        stock,
        sizeOptions,
        images: updatedImages,
      },
      { new: true }
    );

    if (category !== existingProduct.category) {
      await Category.findByIdAndUpdate(existingProduct.category, {
        $pull: { products: { _id: productId } },
      });

      await Category.findByIdAndUpdate(category, {
        $push: { products: { _id: productId } },
      });
    }

    return NextResponse.json(
      { message: "Product updated successfully", product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error updating product", error: error.message },
      { status: 500 }
    );
  }
}
