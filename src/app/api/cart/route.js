import dbConnect from "@/app/lib/dbConnect";
import Cart from "@/models/cartmodel";
import "@/models/productModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId, products } = await req.json();

    await dbConnect();

    if (!userId || !products?.length) {
      return new Response(
        JSON.stringify({ error: "User ID and products are required" }),
        { status: 400 }
      );
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products });
    } else {
      products.forEach(({ productId, quantity }) => {
        const existingProduct = cart.products.find(
          (p) => p.productId.toString() === productId
        );
        existingProduct
          ? (existingProduct.quantity += quantity)
          : cart.products.push({ productId, quantity });
      });
    }

    await cart.save();
    return NextResponse.json({ message: "Cart updated", cart });
  } catch (error) {
    return NextResponse.json("error", { status: 500 });
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    const userId = new URL(req.url).searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "products.productId",
      select: "name price description images",
    });

    // console.log("Cart after populate:", JSON.stringify(cart, null, 2));

    if (!cart) {
      return NextResponse.json(
        { message: "Cart not found", cart: [] },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Cart found", cart }, { status: 200 });
  } catch (error) {
    console.error("Error details:", error); // Add this line
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// File: app/api/cart/updateQuantity/route.js (for Next.js 13 or later with app directory)

import { auth } from "@/auth";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

export async function PUT(request) {
  try {
    // Extract data from request body
    const { quantity, productId } = await request.json();

    await dbConnect();
    const session = await getServerSession(auth);

    if (!session?.user?.id) {
      return new Response("User not authenticated", { status: 401 });
    }

    // Validate and convert quantity
    const quantity1 = parseInt(quantity, 10);
    if (isNaN(quantity1) || quantity1 < 1) {
      return new Response("Invalid quantity. Must be a positive number.", {
        status: 400,
      });
    }

    // Convert productId to ObjectId
    let objectIdProductId;
    try {
      objectIdProductId = new mongoose.Types.ObjectId(productId);
    } catch (error) {
      return new Response("Invalid productId format", { status: 400 });
    }

    const userId = session.user.id;
    const updatedCart = await Cart.findOneAndUpdate(
      { userId, "products.productId": objectIdProductId },
      { $set: { "products.$.quantity": quantity1 } },
      { new: true }
    );

    if (!updatedCart) {
      return new Response("Cart not found or product does not exist", {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Quantity updated", cart: updatedCart }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response("Failed to update cart quantity: " + error.message, {
      status: 500,
    });
  }
}

export async function DELETE(request) {
  try {
    // Extract data from request body
    const { productId } = await request.json();

    if (!productId) {
      return new Response("Product ID is required", { status: 400 });
    }

    // Establish DB connection
    await dbConnect();

    // Get the session (user information)
    const session = await getServerSession(auth);

    if (!session?.user?.id) {
      return new Response("User not authenticated", { status: 401 });
    }

    const userId = session.user.id;

    // Log userId and productId for debugging
    console.log("Removing product:", productId, "for user:", userId);

    // Remove the product from the cart
    const updatedCart = await Cart.findOneAndUpdate(
      { userId, "products.productId": productId },
      { $pull: { products: { productId } } },
      { new: true }
    );

    if (!updatedCart) {
      return new Response("Product not found in cart", { status: 404 });
    }

    // Return the updated cart
    return new Response(
      JSON.stringify({
        message: "Product removed from cart",
        cart: updatedCart,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing item from cart:", error);
    // More detailed error logging
    return new Response(
      "Failed to remove product from cart: " + error.message,
      { status: 500 }
    );
  }
}
