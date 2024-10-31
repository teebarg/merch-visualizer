import "./App.css";
import React, { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { Company } from "./types/supplier";
import { ProductAvailabilityChart3 } from "./components/ProductAvailabilityChart3";
import CompanyBarChart2 from "./components/CompanyBarChart2";
import { useAuth } from "./hooks/useAuth";
import { LoginForm } from "./components/LoginForm";
import { Button } from "./components/ui/button";
import { FileUpload } from "./components/FileUpload";

const App = () => {
    const { isAuthenticated, login, logout } = useAuth();
    const [companyData, setCompanyData] = useState<any>([]);
    const [newData, setNewData] = useState<any>([]);
    console.log(companyData);

    const fetchData = async () => {
        const { data: companies, error } = await supabase.from("companies").select(`
            id, 
            name,
            ethics_rating,
            price_rating,
            quality_rating,
            products ( product_name, availability )
          `);

        setCompanyData(companies);
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
                        <h1 className="text-2xl font-bold">Supplier Dashboard</h1>
                        <Button onClick={logout}>
                            {/* <LogOut className="w-4 h-4 mr-2" /> */}
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
                <h1 className="text-2xl font-bold">Merch Eco Visualizer</h1>
                <FileUpload onLoad={fetchData} />

                {companyData.length == 0 ? (
                    <div className="text-center max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-105 duration-300 mt-8">
                        <p className="text-gray-600 mb-6">Start your data journey by uploading your first dataset or creating a new visualization.</p>
                    </div>
                ) : (
                    <React.Fragment>
                        <div className="my-1 flew flex-col items-center justify-center">
                            <h2>Company Ratings</h2>
                            <CompanyBarChart2 data={companyData} />
                        </div>
                        <div className="my-1">
                            <h2>Product Availability</h2>
                            <ProductAvailabilityChart3 data={newData} />
                        </div>
                    </React.Fragment>
                )}
            </main>

            <footer className="border-t mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-sm text-muted-foreground text-center">Supplier Management Dashboard © {new Date().getFullYear()}</p>
                </div>
            </footer>
        </div>
    );
};

export default App;
