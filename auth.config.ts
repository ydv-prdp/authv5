import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import { LoginSchema } from "./schemas"
import { getUserByEmail } from "./data/user";
import github from "next-auth/providers/github";
import google from "next-auth/providers/google";

export default {
  providers: [
    google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET
    }),
    github({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret:process.env.GITHUB_CLIENT_SECRET
    }),
    Credentials({
        async authorize(credentials){
            const validateFields = LoginSchema.safeParse(credentials);
            if(validateFields.success){
                const {email, password} = validateFields.data;
                const user = await getUserByEmail(email);
                if(!user || !user.password) {
                    return null;
                }

                const passwordMatch = await bcrypt.compare(
                    password,
                    user.password
                )

                if(passwordMatch) {
                    return user
                }
                return null
            }
        }
    })
],
secret: "Yo/0duPLAErkzTcBlgWGWR4eaVyivqU6a+M/ot0fo9c="
} satisfies NextAuthConfig