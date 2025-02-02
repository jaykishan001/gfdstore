import dbConnect from "@/app/lib/dbConnect";
import Order from "@/models/orderModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  const {
    userId,
    products,
    totalAmount,
    payment,
    guestShippingAddress,
    guestDetails,
    shippingAddress,
  } = await req.json();
  try {
    await dbConnect();

    if (!products || !totalAmount || !payment) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    if (!userId) {
      const order = Order.create({
        guestDetails,
        isguest: true,
        products,
        totalAmount,
        payment,
        guestShippingAddress,
      });
      if (order) {
        return NextResponse.json({ message: "Order created" }, { status: 201 });
      }
    } else {
      const order = await Order.create({
        user: userId,
        products,
        totalAmount,
        payment,
        shippingAddress,
      });
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $push: { orderHistory: order._id },
        },
        { new: true }
      );
      if (order) {
        return NextResponse.json(
          { success: true },
          { message: "Order created" },
          { status: 201 }
        );
      }
    }
  } catch (error) {
    console.log("Error creating order:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  const searchparams = new URLSearchParams(req.query);
  const orderId = searchparams.get("orderId");
  try {
    await dbConnect();
    if (orderId) {
      const order = await Order.findById(orderId);
      if (order) {
        return NextResponse.json({ order });
      } else {
        return NextResponse.json(
          { message: "Order not found" },
          { status: 404 }
        );
      }
    }
  } catch (error) {
    console.log("Error fetching order:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
