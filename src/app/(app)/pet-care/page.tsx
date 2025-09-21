import { PageHeader } from "@/components/page-header";
import { PetCareForm } from "./_components/pet-care-form";

export default function PetCarePage() {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <PageHeader
                title="Virtual Pet Care Assistant"
                description="Get personalized care tips and schedules for your pet from our AI assistant."
            />
            <PetCareForm />
        </div>
    );
}
