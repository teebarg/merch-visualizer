import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
// import { supabase } from "../lib/supabase";

const Auth: React.FC = () => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const session = supabase.auth.session();
        setUser(session?.user ?? null);
        supabase.auth.onAuthStateChange((_event: any, session: any) => {
            setUser(session?.user ?? null);
        });
    }, []);

    const signIn = () => supabase.auth.signIn({ provider: "google" });
    const signOut = () => supabase.auth.signOut();

    return (
        <div className="p-4">
            {user ? (
                <button onClick={signOut} className="btn-primary">
                    Logout
                </button>
            ) : (
                <button onClick={signIn} className="btn-primary">
                    Login
                </button>
            )}
        </div>
    );
};

export default Auth;
