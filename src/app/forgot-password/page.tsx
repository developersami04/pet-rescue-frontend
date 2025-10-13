
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ForgotPasswordForm } from "./_components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="text-center">
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>
                Enter your email address and we'll send you a code to reset your password.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <ForgotPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
