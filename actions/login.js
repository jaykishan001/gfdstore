"use server";

import dbConnect from "@/app/lib/dbConnect";
import signIn from "@/auth";

export const loginhandler = async (email, password) => {
  await dbConnect();

  try {
    const response = await signIn("credentials", {
      email,
      password,
    });

    return response;
  } catch (error) {
    console.error("Login failed: ", error);

    return error.message;
  }
};
