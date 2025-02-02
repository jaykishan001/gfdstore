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
