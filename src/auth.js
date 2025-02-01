import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "./models/userModel.js";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;

        if (!email || !password)
          throw new Error("Please provide email and password");

        const user = await User.findOne({ email });

        if (!user) throw new Error("Invalid email or password");

        const isMatch = user.password === password;

        if (!isMatch) throw new Error("Invalid password");

        return { name: user.name, email: user.email, id: user.id };
      },
    }),
  ],
  pages: {
    signIn: "/login", // your custom login page
  },
});
