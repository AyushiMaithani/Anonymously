import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
             },

             async authorize(credentials:any): Promise<any> {
                 //You need to provide your own logic here that takes the credentials
                //Returns either a object representing a user or null/error
                await dbConnect();
                try{

                    // If no error and we have user data, return it
                    // Return null if user data could not be retrieved
                    //So either way returning null or a user object
                    const user = await UserModel.findOne({
                        $or:[
                            {email:credentials.email},
                            {username:credentials.username}
                        ]
                    })

                    if (!user) {
                        throw new Error("No user found with the given email or username");
                    }

                    if(!user.isVerified){
                        throw new Error("Please verify your email before logging in");
                    }

                   const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if (isPasswordCorrect) {
                        return user

                    }
                    else{
                        throw new Error("Invalid password");
                    }
              
                }
               catch(err:any){
                    throw new Error(err);
                }
             }
            })
           ],
           callbacks:{
            async session({ session, token }) 
            {
                if (token) {
                    session.user._id = token._id as string;
                    session.user.isVerified = token.isVerified as boolean;  
                                }
                    return session
                    },
            async jwt({ token, user }) {
                if (user) {
                    token._id=user._id?.toString();
                    token.isVerified=user.isVerified;
                    token.isAcceptingMessages=user.isAcceptingMessages;
                    token.username=user.username
                }
                    return token
            }

                    },
           pages:{
            signIn:"/sign-in",
           },
           session:{
            strategy:"jwt",
           },
           secret:process.env.NEXTAUTH_SECRET,     
        }