import { supabase } from "@/supabaseClient";
import * as XLSX from "xlsx";
import React, { useState } from "react";
import { CancelIcon, UploadIcon } from "nui-react-icons";

export enum FileTypes {
    csv = "text/csv",
    xlsx = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xls = "application/vnd.ms-excel",
}

interface DragNDropProps {
    onLoad: () => void;
}

const FileUpload: React.FC<DragNDropProps> = ({ onLoad }) => {
    const [file, setFile] = useState<File>();
    const [loading, setLoading] = useState<boolean>(false);

    const handleFileUpload = async () => {
        console.log(file);
        if (!file) return;

        setLoading(true);

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

        onLoad();
        alert("Data upload complete!");
        setLoading(false);
    };

    const handleCancel = () => {
        setFile(undefined);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const maxFileSize = 1500;
        const file = event.target.files?.[0] as File;
        if (file.size > maxFileSize * 1024) {
            alert(`File ${file.name} size exceeds ${maxFileSize} KB`);
            return;
        }

        setFile(file);
    };

    return (
        <div className="">
            <div className="min-w-96 max-w-md mx-auto bg-content2 p-4 rounded-md shadow-md relative border-dashed border-2 border-sky-500 min-h-[10rem] flex flex-col place-content-center place-items-center">
                {file && (
                    <button className="absolute top-3 right-4 bg-blue-500" type="button" onClick={handleCancel}>
                        <CancelIcon aria-hidden="true" size={24} />
                    </button>
                )}
                <div>
                    <div className="text-center space-y-2">
                        <UploadIcon className="h-16 w-16 inline" fill="#007bff" />
                        <button className="btn-custom group min-w-48 bg-primary text-primary-foreground" type="button">
                            Select
                        </button>
                    </div>
                    <input
                        // ref={inputRef}
                        accept={[FileTypes.xlsx].join(",")}
                        aria-hidden="true"
                        multiple={false}
                        type="file"
                        onChange={handleChange}
                    />
                </div>
                <div className="mt-4" slot="label">
                    {file && <span className="block">{file.name}</span>}
                </div>
            </div>
            <button disabled={loading} onClick={handleFileUpload} className="min-w-96 max-w-md mx-auto mt-2 flex items-center justify-center bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors group">
                {loading && (
                    <div aria-label="Loading" className="relative inline-flex flex-col gap-2 items-center justify-center">
                        <div className="relative flex w-5 h-5">
                            <i className="absolute w-full h-full rounded-full animate-spinner-ease-spin border-solid border-t-transparent border-l-transparent border-r-transparent border-2 border-b-current" />
                            <i className="absolute w-full h-full rounded-full opacity-75 animate-spinner-linear-spin border-dotted border-t-transparent border-l-transparent border-r-transparent border-2 border-b-current" />
                        </div>
                    </div>
                )}
                Submit
            </button>
        </div>
    );
};

export { FileUpload };
