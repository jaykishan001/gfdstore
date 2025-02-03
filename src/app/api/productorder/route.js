import dbConnect from "@/app/lib/dbConnect";
import Order from "@/models/orderModel";
import User from "@/models/userModel"; // Fix import

import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { orderId, userId } = await req.json();
    console.log("server orderId and userid", orderId, userId);

    await dbConnect();

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (order.status !== "Pending") {
      return NextResponse.json(
        { message: "Order cannot be canceled" },
        { status: 400 }
      );
    }

    // ✅ Fix: Use "Cancelled" instead of "Canceled"
    order.status = "Cancelled"; 
    await order.save();

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { orderHistory: orderId } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully",
      userOrderHistory: user.orderHistory,
    });
  } catch (error) {
    console.log("Error canceling order:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
