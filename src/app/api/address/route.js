
import dbConnect from "@/app/lib/dbConnect";
import Address from "@/models/address.model";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { street, city, state, postalCode, country, user_Id, phone } =
      await req.json();
    if (!street || !city || !state || !postalCode || !country || !phone) {
      return NextResponse.json(
        { message: "All fields are required"},
        { status: 400 }
      );
    }

    await dbConnect();

    const address = await Address.create({street, city, state, postalCode, country, phone});

    const user = await User.findByIdAndUpdate(user_Id, {
        $push: { address: address._id },
      }, { new: true });

      if(!user){
        return NextResponse.json({ message: "User not found"}, { status: 404 });
      }

      return NextResponse.json({ message: "Address added successfully", address });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}

export async function GET(req){
    const {searchParams} = new URL(req.url);
    const userId = searchParams.get("userId");
    if(!userId) {
        return NextResponse.json({ message: "User ID is required"}, { status: 400 });
    }
    const user = await User.findById(userId).populate("address");
    if(user.address.length === 0){
        return NextResponse.json({ message: "User does not have any addresses"}, { status: 404 });
    }

    return NextResponse.json({address: user.address}, {status: 200});
}