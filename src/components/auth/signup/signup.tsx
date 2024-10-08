"use client"
import React, { useState } from 'react'
import '../style/auth.css'; // Add the CSS file

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { SignUpValidation } from '@/lib/validate'
import { Button } from "@/components/ui/button"
import PropagateLoader from "react-spinners/PropagateLoader"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '@/firebase/firebase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAppDispatch } from '@/lib/redux/hooks/redux';
import { setAuthState } from '@/lib/redux/features/auth/authSlice';

const SignUpSchema = SignUpValidation.extend({
    username: z.string().min(1, { message: "Username is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string()
});

const signup = () => {
    const router = useRouter();
    const dispatch = useAppDispatch(); 
    const [loading, setLoading] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: z.infer<typeof SignUpSchema>) {
        if (values.password !== values.confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, values.email, values.password);
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: values.username
                });

                dispatch(setAuthState({
                    isAuthenticated: true,
                    user: {
                        displayName: values.username,
                        uid: auth.currentUser.uid,
                        email: values.email,
                    },
                }));

                router.push('/');
            }
        } catch (error: any) {
            setLoading(false); 
            if (error.code === 'auth/email-already-in-use') {
                alert("The email address is already in use by another account.");
            } else {
                alert(error.message);
            }
        }
    }

    return (
        <div className="auth-center-container-signup">
            <Form {...form}>
                <div className="sm:w-420 flex-center flex-col py-3">
                    <h2 className="font-bold text-4xl pb-1 text-center">meatmeal</h2>
                    <h3 className="text-center">Create an Account</h3>
                </div>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your username" {...field} />
                                </FormControl>
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
                                    <Input placeholder="Enter your email" {...field} />
                                </FormControl>
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
                                    <Input placeholder="Enter your password" type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                            <Input placeholder="Confirm your password" type="password" {...form.register('confirmPassword')} />
                        </FormControl>
                        {passwordError && <p className="text-red-600">{passwordError}</p>}
                        <FormMessage />
                    </FormItem>

                    <div className="flex justify-center">
                        {loading ? (
                            <PropagateLoader className="align-self-center" />
                        ) : (
                            <Button id="signup-button" className="w-full hover:bg-blue-700" type="submit">Sign Up</Button>
                        )}
                    </div>
                    <h3 id="new-to-meatmeal">Already have an account? <Link href="/auth/login" id="join-now">Login</Link></h3>
                </form>
            </Form>
        </div>
    )
}

export default signup;
