import PageCreationForm from "../_components/PageCreationForm";

export default function CreateStorefrontPage() {
    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-heading uppercase tracking-tight">
                    Create <span className="text-primary italic">Page</span>
                </h1>
                <p className="text-muted-foreground text-sm font-medium mt-1">
                    Use the block builder to construct dynamic layouts.
                </p>
            </div>

            {/* The form we built earlier */}
            <PageCreationForm />
        </div>
    );
}