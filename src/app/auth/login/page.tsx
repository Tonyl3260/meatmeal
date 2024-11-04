"use client";
import React, { useEffect, useState } from 'react';
import './login.css';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SignInValidation } from '@/lib/validate';
import { Button } from "@/components/ui/button";
import PropagateLoader from "react-spinners/PropagateLoader";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';
import { setPersistence, browserLocalPersistence, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase/firebase';
import Link from 'next/link';

const Login = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof SignInValidation>>({
        resolver: zodResolver(SignInValidation),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        setPersistence(auth, browserLocalPersistence).catch(error => {
            console.error('Error setting persistence:', error);
        });
    }, []);

    async function onSubmit(values: z.infer<typeof SignInValidation>) {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, values.email, values.password);
            router.push('/');
        } catch (e) {
            console.error('There was an error with sign in:', e);
        }
        setLoading(false);
    }

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="login-header">
                    <h2>Login</h2>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="login-form">
                        <div className="input-group">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="sr-only">Email address</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="email-address"
                                                type="email"
                                                autoComplete="email"
                                                required
                                                className="login-input"
                                                placeholder="Email address"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="sr-only">Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="password"
                                                type="password"
                                                autoComplete="current-password"
                                                required
                                                className="login-input"
                                                placeholder="Password"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Link href="/auth/forgotpassword" className="forgot-password">
                                Forgot your password?
                            </Link>
                        </div>

                        <div className="auth-button-container">
                            <button
                                type="submit"
                                className="login-button"
                                disabled={loading}
                            >
                                {loading ? (
                                    <PropagateLoader color="#ffffff" size={8} />
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </div>
                    </form>
                </Form>
                <div className="text-center">
                    <span>New to meatmeal? </span>
                    <Link href="/auth/signup" className="login-link">
                        Join now
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
