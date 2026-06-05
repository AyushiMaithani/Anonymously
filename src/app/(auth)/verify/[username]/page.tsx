"use client"
import { useParams, useRouter } from 'next/navigation'
import { toast } from "sonner"
import * as z from "zod";
import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifySchema } from '@/schemas/verifySchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

const VerifyAccount = () => {
    const router=useRouter()
    const param=useParams<{username: string}>()

    const form=useForm<z.infer<typeof verifySchema>>({
            resolver:zodResolver(verifySchema),
        })
    
    const onSubmit=async(data:z.infer<typeof verifySchema>)=>{
        try {
            const response=await axios.post('/api/verify-code', {
                username:param.username,
            })
            toast.success("Account verified successfully!")
            router.replace('sign-in')
        } catch (error) {
                    console.error("Error in verification of user", error)
                    const axiosError=error as AxiosError<ApiResponse>

                    toast.error(axiosError.response?.data.message || "Verification failed", {
                        description: "Please try again",
                    })
        }
    }

  return (
        <div className="flex justify-center items-center min-h-screen  bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Controller
      name="code"
      control={form.control}
      render={({ field }) => (
        <Field>
          <FieldLabel htmlFor="code">
            Verification Code
          </FieldLabel>

          <Input
            {...field}
            id="code"
            placeholder="Enter verification code"
          />
        </Field>
      )}
    />
    <Button type="submit"
    className="w-full bg-black text-white py-5 rounded-md mt-4">Verify</Button>
    </form>
      </div>
    </div>
  )
}

export default VerifyAccount
