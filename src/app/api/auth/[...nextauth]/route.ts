// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthFile } from "@/lib/github";
import { verifyMessage } from "viem";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          if (!credentials?.address || !credentials?.signature) {
            return null;
          }

          const registertext = await AuthFile("data/register.json");
          const registerData=JSON.parse(registertext)
          const user = registerData[credentials.address as string];

          if (!user) {
            return null;
          }

          const message = "login LxDao";
          const isValidSignature = await verifyMessage({
            address: credentials.address as `0x${string}`,
            message,
            signature: credentials.signature as `0x${string}`,
          });

          if (!isValidSignature) {
            return null;
          }

          // 只有已批准的用户才能登录
          if (user.approvalStatus === "approved") {
            return { 
              id: credentials.address,
              address: credentials.address,
              status: "approved"
            };
          } else {
            // 其他状态的用户不允许登录，但前端会根据预检查API的响应进行适当处理
            return null;
          }
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.address = user.address;
        token.status = user.status;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token && session.user) {
        session.user.address = token.address as string;
        session.user.status = token.status as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };