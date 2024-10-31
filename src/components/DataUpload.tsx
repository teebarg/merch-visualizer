import React, { useState } from "react";
import { supabase } from "../supabaseClient";
// import { supabase } from '../lib/supabase';

const DataUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0];
        setFile(uploadedFile || null);
    };

    const handleSubmit = async () => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            const data = parseCSV(text);
            await uploadToSupabase(data);
        };
        reader.readAsText(file);
    };

    return (
        <div className="p-4">
            <input type="file" onChange={handleFileUpload} />
            <button onClick={handleSubmit} className="btn-primary">
                Upload Dataset
            </button>
        </div>
    );
};

const parseCSV = (data: string) => {
    // Parse CSV data
    return []; // Parsed data structure for companies and products
};

const uploadToSupabase = async (data: any) => {
    for (const item of data) {
        await supabase.from("companies").insert(item.company);
        await supabase.from("products").insert(item.products);
    }
};

export default DataUpload;
