import dbConnect from "@/app/lib/dbConnect";
import Order from "@/models/orderModel";
import User from "@/models/userModel";

export async function POST(req) {
    const { userId, AddressId, products, totalAmount, discountedAmount } =
      await req.json();
  
    if (!userId || AddressId || products || totalAmount) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    await dbConnect();
    try {

      const user = await User.findOne(userId);
      if(!user){
        return NextResponse.json(
          { message: "User not found so we can't placed your order" },
          { status: 404 }
        );
      }
      const order = await Order.create({products: products, totalAmount: totalAmount})

      await user.orderHistory.push(order._id);

      return NextResponse.json({
        message: "Order placed successfully",
        order,
        user
      })

      
    } catch (error) {
      console.error("Error creating order:", error);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }

  }
  
