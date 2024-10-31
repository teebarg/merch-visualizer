// import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface LoginFormProps {
    onLogin: (data: any) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
    const [email, setEmail] = useState<any>([]);
    const [password, setPassword] = useState<any>([]);

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Login</h2>
            <form className="grid gap-4">
                <div className="grid gap-2">
                    <label htmlFor="username">Username</label>
                    <Input id="username" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {/* {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>} */}
                </div>

                <div className="grid gap-2">
                    <label htmlFor="password">Password</label>
                    <Input id="password" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {/* {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>} */}
                </div>

                <Button type="button" onClick={() => onLogin({ email, password })}>
                    {/* <LogIn className="w-4 h-4 mr-2" /> */}
                    Login
                </Button>
            </form>
        </div>
    );
}
