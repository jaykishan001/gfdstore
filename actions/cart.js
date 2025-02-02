"use server";

const { default: dbConnect } = require("@/app/lib/dbConnect");
const { auth } = require("@/auth");
const { default: Cart } = require("@/models/cartmodel");
const { getServerSession } = require("next-auth");

const updatequantity = async (quantity, productId) => {
  const userId = getServerSession(auth);
  await dbConnect();

  const cart = Cart.findOneAndUpdate();
};
