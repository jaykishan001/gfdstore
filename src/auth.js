import NextAuth, { CredentialsSignin } from "next-auth";
import credentialProvider from "next-auth/providers/credentials";
import User from "./models/userModel.js";
export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    credentialProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (Credentials) => {
        const email = Credentials.email;
        const password = Credentials.password;

        if (!email || !password)
          throw new CredentialsSignin("Please provide email and password");

        const user = await User.findOne({ email });

        if (!user) throw new CredentialsSignin("Invalid email or password");

        const isMatch = user.password === password;

        if (!isMatch) throw new CredentialsSignin("Invalid password");

        return { name: user.name, email: user.email, id: user.id };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
});
