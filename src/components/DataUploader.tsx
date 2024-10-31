import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";

// const supplierSchema = z.object({
//     name: z.string().min(1, "Company name is required"),
//     ethics: z.number().min(0).max(5).or(z.literal("Q")),
//     price: z.number().min(0).max(5).or(z.literal("Q")),
//     quality: z.number().min(0).max(5).or(z.literal("Q")),
//     products: z.object({
//         tshirt: z.enum(["Y", "N", "Q"]),
//         hoodie: z.enum(["Y", "N", "Q"]),
//         vest: z.enum(["Y", "N", "Q"]),
//         poloShirt: z.enum(["Y", "N", "Q"]),
//         sweatshirt: z.enum(["Y", "N", "Q"]),
//         shirt: z.enum(["Y", "N", "Q"]),
//         tabard: z.enum(["Y", "N", "Q"]),
//         apron: z.enum(["Y", "N", "Q"]),
//         coat: z.enum(["Y", "N", "Q"]),
//         gilet: z.enum(["Y", "N", "Q"]),
//         fleece: z.enum(["Y", "N", "Q"]),
//         beanie: z.enum(["Y", "N", "Q"]),
//     }),
// });

// type SupplierForm = z.infer<typeof supplierSchema>;

export function DataUploader() {
    const [file, setFile] = useState<File | null>(null);
    // const { toast } = useToast();
    // const {
    //     register,
    //     handleSubmit,
    //     formState: { errors },
    // } = useForm<SupplierForm>({
    //     resolver: zodResolver(supplierSchema),
    // });

    const onFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFile(file);
            console.log("File selected");
            // toast({
            //     title: "File selected",
            //     description: `Selected file: ${file.name}`,
            // });
        }
    };

    // const onSubmit = (data: SupplierForm) => {
    //     console.log("Form data:", data);
    //     console.log("Supplier data has been uploaded")
    //     // toast({
    //     //     title: "Success",
    //     //     description: "Supplier data has been uploaded",
    //     // });
    // };

    return (
        <div className="grid gap-6">
            <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Upload Data File</h3>
                <div className="grid gap-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <label htmlFor="data-file">Data File</label>
                        <Input id="data-file" type="file" accept=".csv,.xlsx" onChange={onFileUpload} />
                    </div>
                    <Button disabled={!file} onClick={() => {}}>
                        {/* <Upload className="w-4 h-4 mr-2" /> */}
                        Upload File
                    </Button>
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Add Single Supplier</h3>
                {/* <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                    <div className="grid gap-2">
                        <label htmlFor="name">Company Name</label>
                        <Input id="name" {...register("name")} />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <label htmlFor="ethics">Ethics (0-5 or Q)</label>
                            <Input id="ethics" {...register("ethics")} />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="price">Price (0-5 or Q)</label>
                            <Input id="price" {...register("price")} />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="quality">Quality (0-5 or Q)</label>
                            <Input id="quality" {...register("quality")} />
                        </div>
                    </div>

                    <Button type="submit">
                        Add Supplier
                    </Button>
                </form> */}
            </div>
        </div>
    );
}
