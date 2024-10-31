import { supabase } from "@/supabaseClient";
import { useEffect, useState } from "react";
// import { useToast } from "@/hooks/use-toast";

interface LoginCredentials {
    email: string;
    password: string;
}

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);
    // const { toast } = useToast();

    useEffect(() => {
        // Check current session on load
        const session = supabase.auth.getSession();
        session.then(({ session }: any) => {
            setUser(session?.user ?? null);
            setIsAuthenticated(Boolean(session?.user));
        });

        // Listen for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
            setUser(session?.user ?? null);
            setIsAuthenticated(Boolean(session?.user));
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    const login = async (credentials: LoginCredentials) => {
        console.log(credentials);
        const { data, error } = await supabase.auth.signInWithPassword({
            email: "test@test.com",
            password: "password",
        });
        console.log("data............");
        console.log(data);
        console.log("error...............");
        console.log(error);

        if (error) {
            console.log("Invalid credentials");
            // toast({
            //     title: "Error",
            //     description: "Invalid credentials",
            //     variant: "destructive",
            // });
            return;
        }

        // toast({
        //     title: "Success",
        //     description: "Logged in successfully",
        // });
        setIsAuthenticated(true);
        setUser(data.user);
        // // In a real app, this would make an API call
        // if (credentials.email && credentials.password) {
        //     setIsAuthenticated(true);
        //     console.log("Logged in successfully");
        //     console.log("isAuthenticated3333333333333");
        //     console.log(isAuthenticated);
        //     // toast({
        //     //     title: "Success",
        //     //     description: "Logged in successfully",
        //     // });
        // } else {
        //     console.log("Invalid credentials");
        //     // toast({
        //     //     title: "Error",
        //     //     description: "Invalid credentials",
        //     //     variant: "destructive",
        //     // });
        // }
        // console.log("isAuthenticated22222222");
        // console.log(isAuthenticated);
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.log("Error signing out");
            return;
        }

        setIsAuthenticated(false);
        // console.log("Invalid credentials");
        // toast({
        //     title: "Success",
        //     description: "Logged out successfully",
        // });
    };

    return {
        isAuthenticated,
        user,
        login,
        logout,
    };
}
