'use client';

import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState,useEffect } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { signUpSchema } from "@/schemas/signUpSchema";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react";



export default function SignUpForm() {
    const[username,setUsername]=useState('')
    const[usernameMessage,setUsernameMessage]=useState('')
    const[isSubmitting,setIsSubmitting]=useState(false)
    const[isCheckingUsername,setIsCheckingUsername]=useState(false)

    const debounced=useDebounceCallback(setUsername, 500)
    const router=useRouter()

    //zod implementation for validating the username on the client side before sending the request to the server
    const form=useForm<z.infer<typeof signUpSchema>>({
        resolver:zodResolver(signUpSchema),
        defaultValues:{
            username:'',
            email:'',
            password:''
        }
    })


    useEffect(() => {
      const checkUsernameUnique=async()=>{
        if(username){
            setIsCheckingUsername(true)
            setUsernameMessage('')
            try {
                const response=await axios.get<ApiResponse>(`/api/check-username-unique?username=${username}`)
                setUsernameMessage(response.data.message)
                console.log(response.data.message)
                
            }catch (error) {
                const axiosError=error as AxiosError<ApiResponse>
                setUsernameMessage(axiosError.response?.data.message || 'Error checking username')
            }finally {                
                setIsCheckingUsername(false)
            }   
      }
      }
              checkUsernameUnique()
    }, [username])


// in onSubmit you get data through handlesubmit which has all the default values defined in useForm and you can use them to send the request to the server. 
    const onSubmit=async(data:z.infer<typeof signUpSchema>)=>{
        setIsSubmitting(true)
        try {
            const response=await axios.post<ApiResponse>('/api/sign-up',data)
            toast.success(response.data.message)
            router.replace(`/verify/${username}`)
            setIsSubmitting(false)
        } catch (error) {
            console.error("Error in signup of user", error)
            const axiosError=error as AxiosError<ApiResponse>
            const errorMessage=axiosError.response?.data.message

            toast.error(errorMessage, {
  description: "Sign Up Failed",
})

setIsSubmitting(false)


            
        }

    }
    

  return (
     <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Anonymously
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
         <form onSubmit={form.handleSubmit(onSubmit)}>
  <FieldGroup>

    {/* username */}
    <Controller
      name="username"
      control={form.control}
      render={({ field}) => (
        <>
        <Field>
          <FieldLabel htmlFor="username">
            Username
          </FieldLabel>

          <Input 
            {...field}
            id="username"
            placeholder="Enter your username"
            onChange={(e) => {
              field.onChange(e)
              debounced(e.target.value)
            }}
            
          />

        </Field>

         {isCheckingUsername && <Loader2 className="animate-spin" />}
          {!isCheckingUsername && usernameMessage && (
          <p
          className={`text-sm ${
            usernameMessage=== "Username is available" ? "text-green-500" : "text-red-500"
          }`}
          >
            {usernameMessage}
          </p>
  )}
  </>
      )}
    />

    {/* email */}
    <Controller
      name="email"
      control={form.control}
      render={({ field }) => (
        <Field>
          <FieldLabel htmlFor="email">
            Email
          </FieldLabel>

          <Input
            {...field}
            id="email"
            placeholder="Enter your email"
          />
           <p className='text-muted text-gray-400 text-sm'>We will send you a verification code</p>
        </Field>
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
        'Sign Up'

      )}
  </button>
</form>
<div className="text-center mt-4">
  <p>
    Already a member?{' '}
    <Link href='/sign-in' className="text-blue-600 hover:text-blue-800">
    Sign In
    </Link>
  </p>
</div>
    </div>
      </div>
  )
}

