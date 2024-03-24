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
import { LoginSchema } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import {login} from "@/actions/login";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";


const LoginForm = () => {
  const searchParams = useSearchParams();
  console.log(searchParams.get("error"))
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
    ? "Email already in use with different provider!"
    : ""

  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues:{
      email:"",
      password:"",
    }
  })

  const onSubmit = (values: z.infer<typeof LoginSchema>) =>{
    setError("")
    setSuccess("")
    startTransition(()=>{
      login(values)
      .then((data)=>{
        if(data?.error){
          form.reset();
          setError(data?.error)
        }
        if(data?.success){
          form.reset();
          setSuccess(data.success)
        }
        if(data?.twoFactor){
          setShowTwoFactor(true);
        }
      }).catch(()=>setError("Something went wrongh"))
    })
  } 
  return (
    <CardWrapper
        headerLabel="Welcome back"
        backButtonLabel="Dont have an account?"
        backButtonHref="/auth/register"
        showSocial
    >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              {showTwoFactor && (
                 <FormField
                 control={form.control}
                 name="code"
                 render={({field})=>(
                   <FormItem>
                     <FormLabel>Two Factor Code</FormLabel>
                     <FormControl>
                       <Input
                         {...field}
                         disabled={isPending}
                         placeholder="123456"
                       />
                     </FormControl>
                     <FormMessage/>
                   </FormItem>
                 )}
               >
                   </FormField>
              )}
            {!showTwoFactor && (
              <>
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
                  <Button
                    size={"sm"}
                    variant={"link"}
                    asChild
                    className="px-0 font-normal"
                  >
                    <Link href="/auth/reset"
                    >
                      Forgot password?
                    </Link>
                  </Button>
                  <FormMessage/>
                </FormItem>
              )}
            >
                </FormField>
              </>
            )}
            </div>

            <FormError message={error || urlError}/>
            <FormSuccess message={success}/>

            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
            >
              {showTwoFactor ? "Confirm": "Login"}
            </Button>
          </form>
        </Form>
    </CardWrapper>
  )
}

export default LoginForm