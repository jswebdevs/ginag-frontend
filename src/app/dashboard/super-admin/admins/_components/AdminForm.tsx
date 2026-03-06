"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import { Save, Loader2 } from "lucide-react";

// Sub-components (We will build the rest in the next step)
import FormBasicInfo from "./FormBasicInfo";
import FormAvatar from "./FormAvatar";
import FormStatus from "./FormStatus";
import FormBankDetails from "./FormBankDetails";
import FormAddresses from "./FormAddresses";

export default function AdminForm({ initialData }: { initialData?: any }) {
    const router = useRouter();
    const isEdit = !!initialData;

    const [adminData, setAdminData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        phone: "",
        password: "", // Only required on create
        gender: "",
        dob: "",
        avatar: "",
        status: "ACTIVE", // Default
        roles: ["ADMIN"], // Default to Admin
        bankDetails: { bankName: "", branch: "", accNo: "", routingNo: "" },
        mobileBanking: { provider: "", number: "" },
        addresses: [] as any[]
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setAdminData({
                ...initialData,
                password: "", // Never populate password on edit
                dob: initialData.dob ? new Date(initialData.dob).toISOString().split('T')[0] : "",
                bankDetails: initialData.bankDetails || { bankName: "", branch: "", accNo: "", routingNo: "" },
                mobileBanking: initialData.mobileBanking || { provider: "", number: "" },
                addresses: initialData.addresses || [],
                roles: initialData.roles?.length ? initialData.roles : ["ADMIN"],
                status: initialData.status || "ACTIVE"
            });
        }
    }, [initialData]);

    const updateData = (fields: Partial<typeof adminData>) => {
        setAdminData((prev) => ({ ...prev, ...fields }));
    };

    const handleSave = async () => {
        if (!adminData.firstName || !adminData.email || !adminData.username) {
            return Swal.fire("Error", "First Name, Username, and Email are required", "error");
        }
        if (!isEdit && !adminData.password) {
            return Swal.fire("Error", "Password is required for new accounts", "error");
        }

        setLoading(true);
        try {
            if (isEdit) {
                // Strip password if left blank during edit
                const payload = { ...adminData };
                if (!payload.password) delete payload.password;
                await api.patch(`users/admins/${initialData.id}`, payload);
            } else {
                await api.post("/users/admins", adminData);
            }

            Swal.fire("Success", `Admin ${isEdit ? 'updated' : 'created'} successfully`, "success");
            router.push("/dashboard/super-admin/admins");
        } catch (err: any) {
            Swal.fire("Error", err.response?.data?.message || "Internal Server Error", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col xl:flex-row gap-8 items-start">

            {/* LEFT SIDE: Core Data & Records */}
            <div className="flex-1 w-full space-y-8">
                <FormBasicInfo data={adminData} update={updateData} isEdit={isEdit} />
                <FormAddresses data={adminData} update={updateData} />
                <FormBankDetails data={adminData} update={updateData} />
            </div>

            {/* RIGHT SIDE: Status, Media, Roles & Save */}
            <div className="w-full xl:w-100 space-y-8 xl:sticky xl:top-24">
                <FormAvatar data={adminData} update={updateData} />
                <FormStatus data={adminData} update={updateData} />

                {/* Save Action */}
                <div className="bg-card border border-border rounded-3xl p-6 shadow-theme-sm">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full py-4 bg-primary text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:shadow-theme-md hover:scale-[1.02] transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                        {isEdit ? "Update Admin Record" : "Create Admin Account"}
                    </button>
                </div>
            </div>

        </div>
    );
}