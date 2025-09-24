
import { PageHeader } from "@/components/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Pen } from "lucide-react";


export default function AccountSettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title="Account Settings"
        description="Manage your account settings and set e-mail preferences."
      />
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
            <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                     <div className="relative mb-4">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src="https://picsum.photos/seed/user/200/200" alt="@shadcn" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <Button size="icon" variant="outline" className="absolute bottom-0 right-0 rounded-full h-8 w-8">
                            <Pen className="h-4 w-4"/>
                            <span className="sr-only">Edit Profile Picture</span>
                        </Button>
                    </div>
                    <h2 className="text-xl font-bold">Guest User</h2>
                    <p className="text-muted-foreground">guest.user@example.com</p>
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Update your personal information here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" defaultValue="Guest" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" defaultValue="User" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="guest.user@example.com" />
                    </div>
                    <Separator />
                     <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Save Changes</Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  )
}
