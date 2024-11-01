import { supabase } from "@/supabaseClient";
import { useEffect, useState } from "react";
// import { useToast } from "@/hooks/use-toast";
import { useSnackbar } from 'notistack'

interface LoginCredentials {
    email: string;
    password: string;
}

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        setLoading(true)
        // Check current session on load
        const session = supabase.auth.getSession();
        session.then(({ session }: any) => {
            setUser(session?.user ?? null);
            setIsAuthenticated(Boolean(session?.user));
            setLoading(false)
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

    const login = async ({ email, password }: LoginCredentials) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        console.log("data............");
        console.log(data);
        console.log("error...............");
        console.log(error);

        if (error) {
            enqueueSnackbar('Invalid credentials')
            return;
        }

        enqueueSnackbar('Logged in successfully')
        setIsAuthenticated(true);
        setUser(data.user);
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            enqueueSnackbar('Error signing out')
            return;
        }

        setIsAuthenticated(false);
    };

    return {
        loading,
        isAuthenticated,
        user,
        login,
        logout,
    };
}
