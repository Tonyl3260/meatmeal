"use client"
import React, { useState } from 'react'
import './signup.css';

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

const Signup = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
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

    async function onSubmit(values) {
        if (values.password !== values.confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            // Create the user in Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;

            // Update user profile in Firebase
            await updateProfile(user, { displayName: values.username });

            // Log to verify username
            console.log("Syncing with backend:", {
                uid: user.uid,
                email: values.email,
                username: values.username, // Check that this is populated
            });

            // Sync user with PostgreSQL
            await fetch('http://localhost:4000/users/sync', {  
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: user.uid,
                    email: values.email,
                    username: values.username,
                }),
            });

            // Update local auth state
            dispatch(setAuthState({
                isAuthenticated: true,
                user: {
                    displayName: values.username,
                    uid: user.uid,
                    email: values.email,
                },
            }));

            router.push('/');
        } catch (error) {
            setLoading(false);
            console.error("Error syncing with backend:", error);
            if (error.code === 'auth/email-already-in-use') {
                alert("The email address is already in use by another account.");
            } else {
                alert(error.message);
            }
        }
    }

    return (
        <div className="signup-container">
            <div className="signup-wrapper">
                <div className="signup-header">
                    <h2>Create an Account</h2>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="signup-form">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Enter your username" {...field} className="signup-input" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Enter your email" {...field} className="signup-input" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Enter your password" type="password" {...field} className="signup-input" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Confirm your password" type="password" {...form.register('confirmPassword')} className="signup-input" />
                            </FormControl>
                            {passwordError && <p className="text-red-600">{passwordError}</p>}
                            <FormMessage />
                        </FormItem>

                        <div className="auth-button-container">
                            {loading ? (
                                <PropagateLoader className="loading-spinner" />
                            ) : (
                                <Button type="submit" className="signup-button">Sign Up</Button>
                            )}
                        </div>
                        <div className="text-center new-account">
                            Already have an account? <Link href="/auth/login" className="signup-link">Login</Link>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default Signup;
