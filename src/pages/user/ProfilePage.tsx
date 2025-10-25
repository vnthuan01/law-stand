import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/UserLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChangePasswordForm } from './components/ChangePassword';
import { UserInfoCards } from './components/UserInformation';
import { ProfileUpdateForm } from './components/ProfileUpdateForm';
import { User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const handleEditSuccess = () => {
    setIsEditing(false);
  };

  return (
    <Layout>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-left">{t('profile.title')}</h1>
      </div>

      {isEditing ? (
        <ProfileUpdateForm
          user={{
            id: user?.id || '',
            fullName: user?.fullName || '',
            phoneNumber: user?.phoneNumber || '',
            dateOfBirth: user?.dateOfBirth || '',
            gender: user?.gender || '',
            address: user?.address || '',
            bio: user?.bio || '',
            postalCode: user?.postalCode || '',
            city: user?.city || '',
            province: user?.province || '',
            avatarUrl: user?.avatarUrl || '',
          }}
          onSuccess={handleEditSuccess}
        />
      ) : (
        <Tabs defaultValue="info" className="w-full mx-auto">
          {/* Tab List */}
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">{t('profile.user_info')}</TabsTrigger>
            <TabsTrigger value="change-password">{t('profile.change_password')}</TabsTrigger>
            <TabsTrigger value="settings">{t('profile.settings')}</TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="info" className="mt-6">
            <UserInfoCards
              name={user?.fullName || ''}
              gender={user?.gender || ''}
              dateOfBirth={user?.dateOfBirth || ''}
              role={user?.role || ''}
              email={user?.email || ''}
              phone={user?.phoneNumber || ''}
              province={user?.province || ''}
              city={user?.city || ''}
              address={user?.address || ''}
              bio={user?.bio || ''}
              postalCode={user?.postalCode || ''}
              avatarUrl={user?.avatarUrl || ''}
              onEdit={() => setIsEditing(true)}
            />
          </TabsContent>

          <TabsContent value="change-password" className="mt-6 flex justify-center">
            <ChangePasswordForm />
          </TabsContent>

          <TabsContent value="settings" className="mt-6 flex justify-center">
            <div className="text-center space-y-4">
              <User className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="text-lg font-medium">Cài đặt</h3>
              <p className="text-gray-500">Tính năng cài đặt sẽ được phát triển trong tương lai</p>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </Layout>
  );
}
