import dbConnect from "@/app/lib/dbConnect";
import "@/models/address.model";
import "@/models/orderModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await dbConnect(); // Ensure database connection is established

    const user = await User.findById(id)
      .populate("address")
      .populate("orderHistory");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
