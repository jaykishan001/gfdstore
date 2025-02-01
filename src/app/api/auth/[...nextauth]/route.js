// app/api/auth/[...nextauth]/route.js

import dbConnect from "@/app/lib/dbConnect"; // Adjust according to your DB connection logic
import User from "@/models/userModel"; // Adjust according to your User model path
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Make sure to establish a database connection
        await dbConnect();

        // Find the user by email in the database
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        // Check if the password matches (assuming plain text comparison)
        if (credentials.password !== user.password) {
          throw new Error("Invalid password");
        }

        // If successful, return the user object
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // Don't forget to set this in your environment variables
  pages: {
    signIn: "/login", // Optional: specify the path for the login page
  },
  callbacks: {
    async jwt({ token, user }) {
      // Persist the user's ID in the token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Attach the user's ID to the session object
      session.user.id = token.id;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
