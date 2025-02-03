import dbConnect from "@/app/lib/dbConnect";
import Product from "@/models/productModel";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ success: true, data: [] }, { status: 200 });
  }

  try {
    await dbConnect();
    const result = await Product.aggregate([
      {
        $search: {
          index: "auto_complete",
          text: {
            query: query,
            path: { wildcard: "*" },
          },
        },
      },
      { $limit: 5 }, // Limit results for suggestions
    ]);

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    console.error("Products fetching failed: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
