import { SupabaseAdapter } from "@auth/supabase-adapter"
import NextAuth from "next-auth"
import Twitter from "next-auth/providers/twitter"
import jwt from "jsonwebtoken"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Twitter],
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  callbacks: {
    async session({ session, user }) {
      const signingSecret = process.env.SUPABASE_JWT_SECRET!
      if (signingSecret) {
        const payload = {
          aud: "authenticated",
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: user.id,
          email: user.email,
          role: "authenticated",
        }
        const supabaseAccessToken = jwt.sign(payload, signingSecret)
        return {
          ...session,
          supabaseAccessToken,
        }
      }
      return session
    },
  },
})