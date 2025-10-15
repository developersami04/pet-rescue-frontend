
'use client';

import { PageHeader } from "@/components/page-header";
import { ProfileCard } from "./_components/profile-card";
import { ProfileForm } from "./_components/profile-form";


export default function AccountSettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title="Account Settings"
        description="Manage your account settings and set e-mail preferences."
      />
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 md:sticky md:top-24 self-start">
          <ProfileCard />
        </div>
        <div className="md:col-span-2">
          <ProfileForm />
        </div>
      </div>
    </div>
  )
}
