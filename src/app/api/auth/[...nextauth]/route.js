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
        // Establish a database connection
        await dbConnect();

        // Find the user by email in the database
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        // Compare the password directly (plain text comparison)
        if (credentials.password !== user.password) {
          throw new Error("Invalid password");
        }

        // If successful, return the user object with id, email, and name
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your .env file
  pages: {
    signIn: "/login", // Optional: specify the path for the login page
  },
  callbacks: {
    async jwt({ token, user }) {
      // Persist the user's ID in the token if user object is available
      if (user) {
        //   console.log("JWT Callback: user", user); // Add logging to see the user object
        token.id = user.id;
      }
      // console.log("JWT Callback: token", token); // Log token to verify if ID is added
      return token;
    },
    async session({ session, token }) {
      // Attach the user's ID to the session object
      if (token?.id) {
        session.user.id = token.id;
      }
      //   console.log("Session Callback: session", session); // Log session to verify if ID is attached
      return session;
    },
  },
});

export { handler as GET, handler as POST };
