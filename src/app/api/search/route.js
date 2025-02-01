import dbConnect from "@/app/lib/dbConnect";
import Product from "@/models/productModel";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  try {
    await dbConnect();
    const result = await Product.aggregate([
      {
        $search: {
          index: "default",
          text: {
            query: query,
            path: {
              wildcard: "*",
            },
          },
        },
      },
    ]);

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    console.error("Products fetching failed: ", error);
    return NextResponse.json("Internal server error. Please try again later.", {
      status: 500,
    });
  }
}
