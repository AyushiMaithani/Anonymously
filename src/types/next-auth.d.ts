import 'next-auth'

//modyfying or redefining existing data types of next-auth
//first importing the module i.e next-auth and them inisde it we are redefining the user and session data types to include our custom fields which we have in our user model in the database
declare module 'next-auth' {
    interface User{
        _id?:string;
        isVerified?:boolean;
        isAcceptingMessages?:boolean;
              username?:string;
    }

    interface Session {
        user: {
            _id?:string;
            isVerified?:boolean;
            isAcceptingMessages?:boolean;
            username?:string;
        }& DefaultSession["user"];
    }
}