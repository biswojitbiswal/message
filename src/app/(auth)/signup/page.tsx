'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useDebounceValue, useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { signupValidation } from "@/schema/signup.schema"
import { useRouter } from "next/navigation"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {Loader2} from 'lucide-react'


export default function Component() {
  const [username, setUsername] = useState("");
  const [usernameMsg, setUsernameMsg] = useState("");
  const [isChecking, setIsChecking] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 600);
  const router = useRouter();

  const form = useForm<z.infer<typeof signupValidation>>({
    resolver: zodResolver(signupValidation),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    }
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsChecking(true);
        setUsernameMsg('');

        try {
          const response = await axios.get(`/api/check-username-validation?username=${username}`);

          setUsernameMsg(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMsg(axiosError?.response?.data?.message || 'Error Checking Username')
        } finally {
          setIsChecking(false)
        }
      }
    }

    checkUsernameUnique();
  }, [username])

  const onSubmit = async (data: z.infer<typeof signupValidation>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("api/signup", data);

      toast.success("Sign Up Successfull", {
        description: response.data.message
      })
      router.replace(`/verify/${username}`);
      setIsSubmitting(false)
    } catch (error) {
      console.log("Error Sign Up", error);
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data?.message
      toast.error("Erro Sign Up", {
        description: errorMessage,
      })
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <h1>Sign In Page</h1>
      <button className="bg-orange-500 px-3 py-2 m-4 rounded">Sign in</button>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      {...field}
                       onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                       }}
                    />
                  </FormControl>
                    {
                      isChecking && <Loader2 className="animate-"/>
                    }
                    <p className={`text-sm ${usernameMsg === 'Username is Unique' ? 'text-green-500' : 'text-red-500'}`}>
                      {usernameMsg}
                    </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>{isSubmitting? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}</Button>
          </form>
        </Form>
      </div>
    </>
  )
}