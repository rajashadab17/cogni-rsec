"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Lock, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "./custom-toast";
import SubmitButton from "./submit-button";

interface AuthFormProps {
  ShowPage: "signin" | "signup";
}

const signInSchema = z.object({
  userEmail: z
    .string()
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const signUpSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" }),
    userEmail: z
      .string()
      .email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignInFormValues = z.infer<typeof signInSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function AuthForm({ ShowPage }: AuthFormProps) {
  const [isSignIn, setIsSignIn] = useState(ShowPage === "signin");
  const [signInData, setSignInData] = useState<SignInFormValues>({
    userEmail: "",
    password: "",
  });

  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInData((prev) => ({ ...prev, [name]: value }));
  };

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      userEmail: "",
      password: "",
    },
  });

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      userEmail: "",
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();

  async function onSignInSubmit() {
    const values = signInForm.getValues();

    const isAnyFieldEmpty = Object.values(values).some(
      (value) => !value?.toString().trim()
    );

    if (isAnyFieldEmpty) {
      toast.warning({
        title: "Warning",
        description: "Please fill all fields",
      });
      return;
    }

  }

  const onSignUpSubmit = async () => {
    const values = signUpForm.getValues();

    const isAnyFieldEmpty = Object.values(values).some(
      (value) => !value?.toString().trim()
    );

    if (isAnyFieldEmpty) {
      toast.warning({
        title: "Warning",
        description: "Please fill all fields",
      });
      return;
    }

    if (values.password != values.confirmPassword) {
      toast.warning({
        title: "Warning",
        description: "Confirm Password didn't match with Password",
      });
      return;
    }

    if (!values.userEmail.includes('@') || !values.userEmail.includes('.com')) {
      toast.warning({
        title: "Warning",
        description: "Plase input a valid email address",
      });
      return;
    }

  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md overflow-hidden rounded-xl border bg-card shadow-xl">
        <div className="relative h-full w-full">
          <div className="flex items-center justify-between border-b p-4">
            <h1 className="text-2xl font-bold text-card-foreground text-center w-full">
              {isSignIn ? "Welcome back" : "Create an account"}
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSignIn(!isSignIn)}
              aria-label={isSignIn ? "Switch to sign up" : "Switch to sign in"}
            >
              {isSignIn ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>
          </div>

          <div className="relative h-full w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={isSignIn ? "signin" : "signup"}
                initial={{ opacity: 0, x: isSignIn ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isSignIn ? 20 : -20 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                {isSignIn ? (
                  <Form {...signInForm}>
                    <form
                      onSubmit={signInForm.handleSubmit(onSignInSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={signInForm.control}
                        name="userEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="you@example.com"
                                  className="pl-10"
                                  {...field}
                                  value={signInData.userEmail}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    onChangeValue(e);
                                  }}
                                  name="userEmail"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signInForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="password"
                                  placeholder="••••••"
                                  className="pl-10"
                                  {...field}
                                  value={signInData.password}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    onChangeValue(e);
                                  }}
                                  name="password"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="remember"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <label
                            htmlFor="remember"
                            className="text-sm text-muted-foreground"
                          >
                            Remember me
                          </label>
                        </div>
                        <a
                          href="#"
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          Forgot password?
                        </a>
                      </div>

                      <SubmitButton
                        formType="signin"
                        buttonTitle="Sign in"
                        WhileLoading="Signing in..."
                        onClickFunction={onSignInSubmit}
                      />

                      <div className="mt-4 text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setIsSignIn(false)}
                          className="font-medium text-primary hover:underline cursor-pointer"
                        >
                          Sign up
                        </button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <Form {...signUpForm}>
                    <form
                      onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={signUpForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="johndoe"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signUpForm.control}
                        name="userEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="you@example.com"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signUpForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="password"
                                  placeholder="••••••"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signUpForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="password"
                                  placeholder="••••••"
                                  className="pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <SubmitButton
                        formType="signup"
                        buttonTitle="Create account"
                        WhileLoading="Signing up..."
                        onClickFunction={onSignUpSubmit}
                      />

                      <div className="mt-4 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setIsSignIn(true)}
                          className="font-medium text-primary hover:underline cursor-pointer"
                        >
                          Sign in
                        </button>
                      </div>
                    </form>
                  </Form>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
