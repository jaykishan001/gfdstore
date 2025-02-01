"use server";

import dbConnect from "@/app/lib/dbConnect";
import User from "@/models/userModel";

export const signup = async (formData) => {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (!name || !email || !password) throw new Error("Please fill all fields");
  await dbConnect();
  try {
    const user = await User.findOne({ email });
    if (user) throw new Error("User already exists");
    await User.create({ name, email, password });
  } catch (error) {
    console.error("Signup failed: ", error);
    return error.message;
  }
};
