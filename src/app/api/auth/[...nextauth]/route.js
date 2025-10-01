
import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import jwt from "jsonwebtoken"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt"
import connectToDB from '@/lib/db';
import User from '@/lib/models/user.model';
import GoogleProvider from "next-auth/providers/google" 

export const authoptions = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;

        // Compare plaintext password directly
        const isValid = await bcrypt.compare( credentials.password , user.password);
        if (!isValid) return null;

        return {
          id: user._id,
          email: user.email,
          username: user.username
        };
      }

    }),
  ],

  session: {
    strategy: 'jwt',
  },
  //   callbacks: {
  //     async signIn({ user, account, profile, email }) {
  //       if (account.provider !== 'github') return true;

  //       await connectToDB();
  //       const userEmail = email || user.email || profile?.email;
  //       if (!userEmail) return false;

  //       const existingUser = await User.findOne({ email: userEmail });
  //       if (!existingUser) {
  //         await User.create({
  //           email: userEmail,
  //           username: userEmail.split('@')[0],
  //           name: profile?.name || user.name || userEmail.split('@')[0],
  //         });
  //       }

  //       return true;
  //     },

  //     async session({ session }) {
  //   await connectToDB();
  //   const dbUser = await User.findOne({ email: session.user.email });
  //   if (dbUser) {
  //     session.user.name = dbUser.username;
  //     session.user.id = dbUser._id.toString();
  //   }
  //   console.log(session,"hi")
  //   return session;
  //     },
  //   },
  callbacks: {
    async signIn({ user, email, profile, account }) {
        console.log(user)
        user.account=account.provider
      if (account.provider !== "google") return true;
      await connectToDB();
      const userEmail = email || profile?.email || user.email
      if (!userEmail) return false
      const existingUser = await User.findOne({ email: userEmail });
      if (!existingUser) {
    // Block sign-in but send them to /auth/register using an error param
    throw new Error("NEW_USER");
    
  }
      user.id = existingUser._id;
      user.username = existingUser.username;
      // if (!existingUser) {
      // const newuser=new User({
      //     username:userEmail.split("@")[0],
      //     email:userEmail,
      //     name:profile.name || user.name || userEmail.split("@")[0]
      // })
      // await newuser.save();
      // }
      return true
    },
    async redirect({ url, baseUrl }) {
      // Redirect NEW_USERs to register page with message
      if (url.includes("error=NEW_USER")) {
        return `${baseUrl}/auth/?message=Please+register+first`;
      }

      // Normal redirects
    //   if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
    },
    async jwt({ token, user }) {
        console.log(user)
      if (user) {
          token.id = user.id;
          token.username = user.username;
          token.email = user.email;
        
      }

      return token;
    },

    async session({ session, token }) {
      await connectToDB();
      // const dbUser = await User.findOne({ email: session.user.email });
      if (token) {
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.id = token.id?.toString();
      }
      return session;
    }
  }
});

export { authoptions as GET, authoptions as POST };
