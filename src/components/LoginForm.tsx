import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { useState } from "react";

interface LoginFormProps {
    onLogin: (data: any) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogin = async () => {
        setLoading(true);
        await onLogin({ email, password });
        setLoading(false);
    };

    return (
        <React.Fragment>
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 min-h-screen text-center">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-105 duration-300">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">Login</h2>

                    <p className="text-gray-600 mb-6">login to start your data journey.</p>

                    <form className="grid gap-4">
                        <div className="grid gap-2">
                            <label htmlFor="username" className="block text-xs font-medium text-gray-500 text-left">
                                Email
                            </label>
                            <Input id="username" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="password" className="block text-xs font-medium text-gray-500 text-left">
                                Password
                            </label>
                            <Input id="password" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        <Button
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors group mt-6"
                            type="button"
                            onClick={handleLogin}
                        >
                            {loading && (
                                <div aria-label="Loading" className="relative inline-flex flex-col gap-2 items-center justify-center">
                                    <div className="relative flex w-5 h-5">
                                        <i className="absolute w-full h-full rounded-full animate-spinner-ease-spin border-solid border-t-transparent border-l-transparent border-r-transparent border-2 border-b-current" />
                                        <i className="absolute w-full h-full rounded-full opacity-75 animate-spinner-linear-spin border-dotted border-t-transparent border-l-transparent border-r-transparent border-2 border-b-current" />
                                    </div>
                                </div>
                            )}
                            Login
                        </Button>
                    </form>
                    <div className="mt-6 text-xs text-gray-500">Tip: check login details in Readme</div>
                </div>
            </div>
        </React.Fragment>
    );
}
