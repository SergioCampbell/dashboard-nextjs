'use client'

import React, { useActionState, useEffect, useRef, useContext } from "react"
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { login } from "@/app/actions/auth"
import { FormState } from "@/lib/definitions"
import { UserContext } from "@/components/providers/user-provider";

const initialState: FormState | undefined = undefined;

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [state, formAction, pending] = useActionState<FormState | undefined, FormData>(login, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("LoginForm must be used within a UserProvider");
  }
  const { setUser } = userContext;


  useEffect(() => {
    if (state?.user) {
      console.log("Login successful via form, updating context...");
      setUser(state.user);
      formRef.current?.reset();

      router.push('/dashboard');

    }
  }, [state, setUser, router]);


  return (
    <div data-testid="login-page" className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state?.message && !state?.user && (
            <p className={`mb-4 text-red-600`}>
              {state.message}
            </p>
          )}
          <form ref={formRef} action={formAction}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    tabIndex={-1}
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                />
              </div>
              <Button disabled={pending} type="submit" className="w-full mt-2">
                {pending ? "Logging in..." : "Login"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}