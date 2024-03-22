import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { db } from "./lib/db"
import {PrismaAdapter} from "@auth/prisma-adapter"
import { getUserById } from "./data/user"


export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
    pages:{
        signIn:"/auth/login",
        error:"/auth/error",
    },
    events:{
       async linkAccount({user}){
        await db.user.update({
            where:{id: user.id},
            data:{emailVerified: new Date()}
        })
       } 
    },
    callbacks:{
        async session({token, session}){
            console.log({
                sessionToken:token,
            })
            if(token.sub && session.user){
                session.user.role = token.role as "ADMIN" | "USER";
            }
            return session
        },
        async jwt({token}){
            if(!token.sub) return token;
            const existingUser = await getUserById(token.sub);
            if(!existingUser) return token;
            token.role = existingUser.role;
            return token;
        }
    },
    adapter: PrismaAdapter(db),
    session:{strategy:"jwt"},
  ...authConfig
})