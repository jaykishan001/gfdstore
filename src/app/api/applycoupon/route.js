import dbConnect from "@/app/lib/dbConnect";
import Coupon from "@/models/couponModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { code, cartTotal } = await req.json();
    console.log("code ", code, cartTotal);
    if (!code || cartTotal == null || isNaN(cartTotal) || cartTotal < 0) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 }
      );
    }

    await dbConnect();

    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return NextResponse.json(
        { message: "Invalid coupon code" },
        { status: 400 }
      );
    }

    if (new Date(coupon.expiryDate).getTime() < Date.now()) {
      return NextResponse.json(
        { message: "Coupon code has expired" },
        { status: 400 }
      );
    }

    // Check minimum cart value if applicable
    // if (coupon.minCartValue && cartTotal < coupon.minCartValue) {
    //   return NextResponse.json(
    //     { message: `Minimum cart value required is ₹${coupon.minCartValue}` },
    //     { status: 400 }
    //   );
    // }

    const discount = (cartTotal * coupon.discountPercentage) / 100;
    const discountedTotal = cartTotal - discount;

    return NextResponse.json(
      {
        message: "Coupon applied successfully",
        discount,
        discountedTotal,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Coupon application failed: ", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
