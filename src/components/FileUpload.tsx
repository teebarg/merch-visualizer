import { supabase } from "@/supabaseClient";
import * as XLSX from "xlsx";
import React, { useRef, useState } from "react";
import { CancelIcon, UploadIcon } from "nui-react-icons";
import { useSnackbar } from "notistack";
import { Product } from "@/types";
import { Button } from "./ui/button";

export enum FileTypes {
    xlsx = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xls = "application/vnd.ms-excel",
}

interface DragNDropProps {
    onLoad: () => void;
}

const FileUpload: React.FC<DragNDropProps> = ({ onLoad }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [file, setFile] = useState<File>();
    const [loading, setLoading] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (): Promise<void> => {
        try {
            if (!file) {
                throw new Error("No file selected");
            }

            setLoading(true);

            // Read and parse Excel file
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];

            // Parse headers and rows
            const jsonData: any = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[];

            // Validate data structure
            if (jsonData.length < 8) {
                throw new Error("Invalid file format: insufficient rows");
            }

            // const headers = jsonData[6] as string[]; // A7:D7 for company details headers
            const productHeaders = jsonData[6].slice(4); // E7:W7 for product names
            const rows: any = jsonData.slice(7).filter((row: any) => row.length > 0); // Starting from row 8 for data rows

            // Process rows in batches
            const BATCH_SIZE = 50;
            for (let i = 0; i < rows.length; i += BATCH_SIZE) {
                const batch = rows.slice(i, i + BATCH_SIZE);
                await Promise.all(
                    batch.map(async (row: any) => {
                        try {
                            const [companyName, ethics, price, quality] = row.slice(0, 4);
                            const productAvailability = row.slice(4);

                            // Validate company data
                            if (!companyName || !ethics || !price || !quality) {
                                throw new Error(`Invalid company data in row ${i}`);
                            }

                            await supabase.from("companies").delete().eq("name", companyName);

                            // Insert new company
                            const { data: company, error: companyError } = await supabase
                                .from("companies")
                                .insert({
                                    name: companyName,
                                    ethics_rating: ethics,
                                    price_rating: price,
                                    quality_rating: quality,
                                })
                                .select()
                                .single();

                            if (companyError || !company) {
                                throw new Error(`Failed to insert company: ${companyError?.message}`);
                            }

                            // Prepare product data
                            const productInserts = productHeaders.map((product: Product, index: number) => ({
                                company_id: company.id,
                                product_name: product,
                                availability: productAvailability[index],
                            }));

                            // Insert products
                            const { error: productError } = await supabase.from("products").insert(productInserts);

                            if (productError) {
                                throw new Error(`Failed to insert products: ${productError.message}`);
                            }
                        } catch (error) {
                            enqueueSnackbar(`Error processing row ${i}: ${error}`);
                            // Continue with next row instead of breaking the entire process
                            return null;
                        }
                    })
                );
            }

            onLoad();
            enqueueSnackbar("Data upload complete!");
        } catch (error) {
            enqueueSnackbar(`Upload failed: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFile(undefined);
        if (inputRef.current) {
            inputRef.current.value = ""; // Clear the input field
        }
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

    const onUpload = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    return (
        <div className="">
            <div className="min-w-96 max-w-md mx-auto bg-content2 p-6 rounded-md shadow-md relative border-dashed border-2 border-sky-500 min-h-[10rem] flex flex-col place-content-center place-items-center">
                {file && (
                    <button
                        className="absolute top-3 right-4 bg-background text-foreground border border-muted-foreground"
                        type="button"
                        onClick={handleCancel}
                    >
                        <CancelIcon aria-hidden="true" size={24} />
                    </button>
                )}
                <div>
                    <div className="flex flex-col text-center space-y-3 items-center justify-center">
                        <UploadIcon className="h-16 w-16 inline" fill="#007bff" />
                        <p className="text-sm font-semibold text-gray-700">Click to upload dataset</p>
                        <Button className="group min-w-48 bg-pink-500 text-primary-foreground py-2 rounded-md" type="button" onClick={onUpload}>
                            Select
                        </Button>
                    </div>
                    <input
                        ref={inputRef}
                        accept={[FileTypes.xlsx].join(",")}
                        aria-hidden="true"
                        multiple={false}
                        type="file"
                        onChange={handleChange}
                        className="hidden"
                    />
                </div>
                <div className="mt-4" slot="label">
                    {file && <span className="block">{file.name}</span>}
                </div>
            </div>
            <button
                disabled={loading || !file}
                onClick={handleFileUpload}
                className="min-w-96 max-w-md mx-auto mt-2 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors group"
            >
                {loading  && (
                    <div aria-label="Loading" className="relative inline-flex flex-col gap-2 items-center justify-center">
                        <div className="relative flex w-5 h-5">
                            <i className="absolute w-full h-full rounded-full animate-spinner-ease-spin border-solid border-t-transparent border-l-transparent border-r-transparent border-2 border-b-current" />
                            <i className="absolute w-full h-full rounded-full opacity-75 animate-spinner-linear-spin border-dotted border-t-transparent border-l-transparent border-r-transparent border-2 border-b-current" />
                        </div>
                    </div>
                )}
                Upload
            </button>
        </div>
    );
};

export { FileUpload };
