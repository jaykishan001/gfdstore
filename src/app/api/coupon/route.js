import dbConnect from "@app/lib/dbConnect";
import Coupon from "@models/couponModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();

    const { code, discountPercentage, expiryDate } = await req.json();
    if (!code || !discountPercentage || !expiryDate) {
      return NextResponse.json(
        { message: "Please fill all fields" },
        { status: 400 }
      );
    }

    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return NextResponse.json(
        { message: "Coupon code already exists" },
        { status: 400 }
      );
    }

    const coupon = await Coupon.create({
      code,
      discountPercentage,
      expiryDate,
    });

    return NextResponse.json(
      { message: "Coupon created successfully", coupon },
      { status: 201 }
    );
  } catch (error) {
    console.error("Coupon creation failed: ", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();

  try {
    const coupons = await Coupon.find({});
    if (coupons.length === 0) {
      return NextResponse.json(
        { message: "No Coupons found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: coupons }, { status: 200 });
  } catch (error) {
    console.error("Coupons fetching failed: ", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
