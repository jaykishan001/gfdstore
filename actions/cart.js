"use server";

import dbConnect from "@/app/lib/dbConnect";
import { auth } from "@/auth";
import Cart from "@/models/cartmodel";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export const updateQuantity = async (quantity, productId) => {
  try {
    await dbConnect();

    const session = await getServerSession(auth);

    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    // Validate and convert quantity
    const quantity1 = parseInt(quantity, 10);

    if (isNaN(quantity1) || quantity1 < 1) {
      throw new Error("Invalid quantity. Must be a positive number.");
    }

    // Convert productId to ObjectId
    let objectIdProductId;
    try {
      objectIdProductId = new mongoose.Types.ObjectId(productId);
    } catch (error) {
      throw new Error("Invalid productId format");
    }

    const userId = session.user.id;

    const updatedCart = await Cart.findOneAndUpdate(
      { userId, "products.productId": objectIdProductId },
      { $set: { "products.$.quantity": quantity1 } },
      { new: true }
    );

    if (!updatedCart) {
      throw new Error("Cart not found or product does not exist");
    }

    revalidatePath("/cart");

    return { message: "Quantity updated", cart: updatedCart };
  } catch (error) {
    throw new Error("Failed to update cart quantity: " + error.message);
  }
};

export const removeproduct = async (productId) => {
  try {
    // Establish DB connection
    await dbConnect();

    // Get the session (user information)
    const session = await getServerSession(auth);

    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    // Extract userId from the session
    const userId = session.user.id;

    // Remove the product from the cart
    const updatedCart = await Cart.findOneAndUpdate(
      { userId, "products.productId": productId }, // Filter for the product to remove
      { $pull: { products: { productId: productId } } }, // Remove the product from the products array
      { new: true }
    );

    if (!updatedCart) {
      throw new Error("Product not found in cart");
    }

    revalidatePath("/api/cart");
    revalidatePath("/cart");

    return { message: "Product removed from cart", cart: updatedCart };
  } catch (error) {
    console.error("Error removing item from cart:", error);
    throw new Error("Failed to remove product from cart: " + error.message);
  }
};
