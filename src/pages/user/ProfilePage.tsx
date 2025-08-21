import Layout from '@/components/layout/UserLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChangePasswordForm } from './components/ChangePassword';
import { UserInfoCards } from './components/UserInformation';

export default function ProfilePage() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4 text-left">Profile</h1>
      <Tabs defaultValue="info" className="w-full mx-auto">
        {/* Tab List */}
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">User Info</TabsTrigger>
          <TabsTrigger value="change-password">Change Password</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="info" className="mt-6">
          <UserInfoCards
            name="John Doe"
            role="Admin"
            email="john@example.com"
            phone="+84 123456789"
            country="Vietnam"
            city="Ho Chi Minh"
            street="123 Le Loi"
            avatarUrl="/avatar.png"
          />
        </TabsContent>

        <TabsContent value="change-password" className="mt-6 flex justify-center">
          <ChangePasswordForm />
        </TabsContent>
        <TabsContent value="settings" className="mt-6 flex justify-center">
          <div>Settings</div>{' '}
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
