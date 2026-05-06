"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import { Save, Loader2 } from "lucide-react";

import FormBasicInfo from "./FormBasicInfo";
import FormAvatar from "./FormAvatar";
import FormStatus from "./FormStatus";
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
        password: "",
        gender: "",
        dob: "",
        avatar: "",
        status: "ACTIVE",
        addresses: [] as any[],
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setAdminData({
                firstName: initialData.firstName || "",
                lastName: initialData.lastName || "",
                username: initialData.username || "",
                email: initialData.email || "",
                phone: initialData.phone || "",
                password: "",
                gender: initialData.gender || "",
                dob: initialData.dob ? new Date(initialData.dob).toISOString().split('T')[0] : "",
                avatar: initialData.avatar || "",
                status: initialData.status || "ACTIVE",
                addresses: initialData.addresses || [],
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
            // Roles are always ADMIN — not editable from this form.
            const basePayload = { ...adminData, roles: ["ADMIN"] };

            if (isEdit) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password, ...rest } = basePayload;
                const finalPayload = adminData.password ? { ...rest, password: adminData.password } : rest;
                await api.patch(`/users/admins/${initialData.id}`, finalPayload);
            } else {
                await api.post("/users/admins", basePayload);
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
        <div className="max-w-3xl mx-auto w-full space-y-8">
            <FormAvatar data={adminData} update={updateData} />
            <FormBasicInfo data={adminData} update={updateData} isEdit={isEdit} />
            <FormStatus data={adminData} update={updateData} />
            <FormAddresses data={adminData} update={updateData} />

            <div className="sticky bottom-4 z-30">
                <div className="bg-card border border-border rounded-3xl p-4 shadow-theme-lg">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black flex items-center justify-center gap-3 hover:shadow-theme-md hover:scale-[1.01] transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                        {isEdit ? "Update Admin Record" : "Create Admin Account"}
                    </button>
                </div>
            </div>
        </div>
    );
}
