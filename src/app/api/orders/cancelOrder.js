import dbConnect from "@/app/lib/dbConnect";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { orderId } = await req.json();
  
  try {
    await dbConnect();
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (order.status === "Processing") {
      order.status = "Canceled"; // Change the order status to Canceled
      await order.save();
      
      return NextResponse.json({ success: true, message: "Order canceled successfully" });
    } else {
      return NextResponse.json(
        { message: "Order cannot be canceled" },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.log("Error canceling order:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
