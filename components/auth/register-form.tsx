"use client"
import CardWrapper from "./card-wrapper"
import {useForm} from "react-hook-form";
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod"

import {
  Form, 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { RegisterSchema } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import {register} from "@/actions/register";
import { useState, useTransition } from "react";


const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues:{
      email:"",
      password:"",
      name:""
    }
  })

  const onSubmit = (values: z.infer<typeof RegisterSchema>) =>{
    setError("")
    setSuccess("")
    startTransition(()=>{
      register(values)
      .then((data)=>{
        setError(data.error);
        setSuccess(data.success);
      })
    })
  } 
  return (
    <CardWrapper
        headerLabel="Create an account"
        backButtonLabel="Already have an account?"
        backButtonHref="/auth/login"
        showSocial
    >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({field})=>(
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="John Doe"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            >
            </FormField>

            <FormField
              control={form.control}
              name="email"
              render={({field})=>(
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="john.doe@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            >
            </FormField>

            <FormField
              control={form.control}
              name="password"
              render={({field})=>(
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="*******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            >
            </FormField>
            </div>

            <FormError message={error}/>
            <FormSuccess message={success}/>

            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
            >
              Register
            </Button>
          </form>
        </Form>
    </CardWrapper>
  )
}

export default RegisterForm