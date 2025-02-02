import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "./models/userModel"; // Adjust the path as needed

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        if (!email || !password) {
          throw new Error("Please provide email and password");
        }

        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        // Check if the password matches
        const isMatch = user.password === password;

        if (!isMatch) {
          throw new Error("Invalid password");
        }

        // Return the user object with necessary fields
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/login", // Optional: specify the path for your login page
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Store the user ID in the token
        token.email = user.email; // Store the email as well if needed
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id; // Add the user ID to the session
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure you have this in your .env
};

// Get the default export (handler) and the individual methods you need
const nextAuthHandler = NextAuth(authOptions);

// Now export them
export const { signIn, signOut } = nextAuthHandler;
export const handlers = nextAuthHandler; // NextAuth handler for API routes
export const auth = authOptions; // The auth options themselves (for reference)
export default nextAuthHandler; // Default export for Next.js API routes
