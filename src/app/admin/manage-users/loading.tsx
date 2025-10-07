
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="space-y-8 mt-6">
            <div className="flex justify-end items-center">
                <Skeleton className="h-10 w-48" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                     <div key={i} className="flex flex-col space-y-3">
                        <Skeleton className="h-[350px] w-full rounded-lg" />
                    </div>
                ))}
            </div>
        </div>
    );
}
