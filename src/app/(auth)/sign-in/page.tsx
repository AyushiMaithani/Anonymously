'use client';

import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import * as z from "zod";
import { signIn } from 'next-auth/react';
import { useState} from "react";
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import Link from "next/link";



export default function SignInForm() {

    const[isSubmitting,setIsSubmitting]=useState(false)
    const router=useRouter()

    //zod implementation for validating the username on the client side before sending the request to the server
    const form=useForm<z.infer<typeof signInSchema>>({
        resolver:zodResolver(signInSchema),
        defaultValues:{
            identifier:'',
            password:''
        }
    })

// in onSubmit you get data through handlesubmit which has all the default values defined in useForm and you can use them to send the request to the server. 
    const onSubmit=async(data:z.infer<typeof signInSchema>)=>{
      try{
       const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        })
        if (result?.error){
            toast.error(result.error, {
  description: "Login Failed",
})
   }

   if(result?.url){
    router.replace('/dashboard')
   }
  }
  finally {
    setIsSubmitting(false)
}
    }
    

  return (
     <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back To Anonymously
          </h1>
          <p className="mb-4">Sign in to continue your conversations</p>
        </div>
         <form onSubmit={form.handleSubmit(onSubmit)}>
  <FieldGroup>

    {/* identifier */}
    <Controller
      name="identifier"
      control={form.control}
      render={({ field}) => (
        <>
        <Field>
          <FieldLabel htmlFor="identifier">
            Email/Username
          </FieldLabel>

          <Input 
            {...field}
            id="identifier"
            placeholder="Enter your username or email"
          />

        </Field>
  </>
      )}
    />

    {/* password */}
    <Controller
      name="password"
      control={form.control}
      render={({ field }) => (
        <Field>
          <FieldLabel htmlFor="password">
            Password
          </FieldLabel>

          <Input
            {...field}
            id="password"
            type="password"
            placeholder="Enter your password"
          />
        </Field>
      )}
    />

  </FieldGroup>

  <button
    type="submit"
    className="w-full bg-black text-white py-2 rounded-md mt-4"
    disabled={isSubmitting}
  >
    {
      isSubmitting?
      (
        <>
        <Loader2 className="mr-2 h-4 w-2 animate-spin"/>
        Please Wait
        </>
      ):(
        'Sign In'

      )}
  </button>
</form>
<div className="text-center mt-4">
  <p>
    Don't have an account?{' '}
    <Link href='/sign-up' className="text-blue-600 hover:text-blue-800">
      Sign Up
    </Link>
  </p>
</div>
    </div>
      </div>
  )}


