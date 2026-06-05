import NextAuth  from "next-auth/next";
import { authOptions } from "./options";

//NextAuth is a function that takes in the authOptions and returns a handler that can be used to handle authentication requests. The authOptions is an object that contains the configuration for the authentication providers, callbacks, and other settings.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
//Exporting the handler for both GET and POST requests to handle authentication requests.