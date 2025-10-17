
import { CreateAccountForm } from "./_components/create-account-form";
import Image from "next/image";
import { heroImages } from "@/lib/page-data/home";

export default function CreateAccountPage() {
  const backgroundImage = heroImages[0];
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 py-12">
      <Image
            src={backgroundImage.src}
            alt="Blurred background of a pet"
            fill
            className="object-cover blur-sm brightness-75 -z-10"
            data-ai-hint={backgroundImage.hint}
        />
        <CreateAccountForm />
    </div>
  );
}
