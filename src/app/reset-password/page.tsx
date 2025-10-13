
import { Suspense } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ResetPasswordForm } from "./_components/reset-password-form";

function ResetPasswordFormSkeleton() {
    return <div>Loading...</div>;
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="text-center">
            <CardTitle>Reset Your Password</CardTitle>
            <CardDescription>
                Enter the code from your email and your new password.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Suspense fallback={<ResetPasswordFormSkeleton />}>
                <ResetPasswordForm />
            </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
