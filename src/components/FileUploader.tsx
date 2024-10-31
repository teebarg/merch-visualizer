import { supabase } from "@/supabaseClient";
import { useState } from "react";
import * as XLSX from "xlsx";

export const FileUploader = () => {
    const [file, setFile] = useState<File>();

    const OnSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setFile(file);
    };
    const handleFileUpload = async () => {
        console.log(file);
        if (!file) return;

        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        // Parse headers and rows
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        console.log("🚀 ~ handleFileUpload ~ jsonData:", jsonData);
        const headers = jsonData[6]; // A7:D7 for company details headers
        console.log("🚀 ~ handleFileUpload ~ headers:", headers);
        const productHeaders = jsonData[6].slice(4); // E7:W7 for product names
        console.log("🚀 ~ handleFileUpload ~ productHeaders:", productHeaders);
        const rows: any = jsonData.slice(7); // Starting from row 8 for data rows
        console.log("🚀 ~ handleFileUpload ~ rows:", rows);

        // Loop through rows to insert company and product data
        for (const row of rows) {
            if (!row.length) {
                break;
            }
            const [companyName, ethics, price, quality] = row?.slice(0, 4);
            const productAvailability = row.slice(4);

            await supabase.from("companies").delete().eq("name", companyName);

            // Insert company data
            const { data: company, error } = await supabase
                .from("companies")
                .insert({ name: companyName, ethics_rating: ethics, price_rating: price, quality_rating: quality })
                .select()
                .single();

            if (error) {
                console.error("Error inserting company:", error);
                continue;
            }

            // Insert product availability for this company
            const productInserts = productHeaders.map((product: any, index: any) => ({
                company_id: company.id,
                product_name: product,
                availability: productAvailability[index],
            }));
            console.log("productInserts", productInserts);

            const { error: productError } = await supabase.from("products").insert(productInserts);

            if (productError) {
                console.error("Error inserting products:", productError);
                break;
            }
        }

        alert("Data upload complete!");
    };

    return (
        <div className="file-uploader">
            <label className="block mb-2 text-sm font-medium text-gray-700">Upload Company Data!!!!</label>
            <input type="file" accept=".xlsx" onChange={OnSelect} className="p-2 border rounded" />
            <button onClick={handleFileUpload}>Submit</button>
        </div>
    );
};
