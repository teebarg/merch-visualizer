import "./App.css";
import React, { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { ProductAvailabilityChart } from "@/components/ProductAvailabilityChart";
import CompanyBarChart from "@/components/CompanyBarChart";
import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "@/components/LoginForm";
import { FileUpload } from "@/components/FileUpload";
import { useSnackbar } from "notistack";
import { Company } from "@/types";
import Loading from "@/components/Loading";

const App = () => {
    const { loading, isAuthenticated, user, login, logout } = useAuth();
    const [companyData, setCompanyData] = useState<any>([]);
    const [newData, setNewData] = useState<any>([]);
    const [fetching, setFetching] = useState<boolean>(false);
    const { enqueueSnackbar } = useSnackbar();

    const fetchData = async () => {
        setFetching(true);
        const { data: companies, error } = await supabase.from("companies").select(`
            id,
            name,
            ethics_rating,
            price_rating,
            quality_rating,
            products ( product_name, availability )
          `);

        if (error) {
            enqueueSnackbar("An error occured retrieving company data, contact Admin.");
            setFetching(false);
            return;
        }

        setCompanyData(companies);
        setFetching(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const newD = companyData.map((data: Company) => {
            return {
                company: data.name,
                products: data.products,
            };
        });
        setNewData(newD);
    }, [companyData]);

    if (loading || fetching) {
        return <Loading />;
    }

    if (!isAuthenticated) {
        return (
            <div className="bg-background text-foreground">
                <LoginForm onLogin={login} />
            </div>
        );
    }

    return (
        <div className="bg-gray-100 text-foreground bg-background min-h-screen flex flex-col">
            <header className="border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-semibold">Merch Eco Visualizer</h1>
                        <div className="flex items-center gap-2">
                            <p className="text-muted-foreground font-medium">{user.email}</p>
                            <button
                                className="min-w-28 flex items-center justify-center text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md relative bg-indigo-500"
                                onClick={logout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
                <FileUpload onLoad={fetchData} />

                {companyData.length == 0 ? (
                    <div className="text-center max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-105 duration-300 mt-8 min-h-80">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mx-auto h-28 w-28 text-muted-foreground"
                        >
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#FFF5F5" />
                            <path d="M12 7v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="12" cy="17" r="1" fill="currentColor" />
                        </svg>

                        <p className="text-gray-600 mb-6 mt-4">Start your data journey by uploading your first dataset for visualization.</p>

                        <p className="text-xs text-muted-foreground !mt-4 text-center">
                            By uploading a dataset you agree to our Terms of Service. To learn more about how we handles your personal data, check our
                            Privacy Policy.
                        </p>
                    </div>
                ) : (
                    <React.Fragment>
                        <hr className="shrink-0 bg-slate-200 border-none w-full h-[2px] mt-14" />
                        <div className="mt-6 flew flex-col items-center justify-center">
                            <h2 className="text-lg font-semibold">Company Ratings</h2>
                            <CompanyBarChart data={companyData} />
                        </div>
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold">Product Availability</h2>
                            <ProductAvailabilityChart data={newData} />
                        </div>
                    </React.Fragment>
                )}
            </main>

            <footer className="border-t mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-sm text-muted-foreground text-center">Dataset visualizer © {new Date().getFullYear()}</p>
                </div>
            </footer>
        </div>
    );
};

export default App;
