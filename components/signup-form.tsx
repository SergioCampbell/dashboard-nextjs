'use client'

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
import { signup } from "@/app/actions/auth"
import React, { useActionState, useEffect, useRef } from "react"
import { FormState } from "@/lib/definitions"

const initialState: FormState | undefined = undefined;

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [state, formAction, pending] = useActionState<FormState | undefined, FormData>(signup, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.message && !state.errors) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Signup</CardTitle>
          <CardDescription>
            Fill in the form below to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state?.message && !state.errors && (
            <p className="mb-4 text-green-600">{state.message}</p>
          )}
          {state?.message && state.errors && Object.keys(state.errors).length === 0 && (
            <p className="mb-4 text-red-600">{state.message}</p>
          )}

          <form ref={formRef} action={formAction}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  required
                  aria-describedby={state?.errors?.name ? "name-error" : undefined}
                />
              </div>
              {state?.errors?.name && (
                <div id="name-error" className="text-sm text-red-600">
                  {state.errors.name.map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  aria-describedby={state?.errors?.email ? "email-error" : undefined}
                />
              </div>
              {state?.errors?.email && (
                <div id="email-error" className="text-sm text-red-600">
                  {state.errors.email.map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  aria-describedby={state?.errors?.password ? "password-error" : undefined}
                />
              </div>
              {state?.errors?.password && (
                <div id="password-error" className="text-sm text-red-600">
                  <p className="font-medium">Password must:</p>
                  <ul className="list-disc pl-5">
                    {state.errors.password.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Button disabled={pending} type="submit" className="w-full mt-2">
                {pending ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Do you have an account?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}