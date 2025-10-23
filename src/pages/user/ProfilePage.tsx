import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/UserLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChangePasswordForm } from './components/ChangePassword';
import { UserInfoCards } from './components/UserInformation';
import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4 text-left">{t('profile.title')}</h1>
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
            role={user?.role || ''}
            email={user?.email || ''}
            phone={user?.phoneNumber || ''}
            // country={user?.country || ''}
            // city={user?.city || ''}
            // street={user?.street || ''}
            avatarUrl={user?.avatar || ''}
          />
        </TabsContent>

        <TabsContent value="change-password" className="mt-6 flex justify-center">
          <ChangePasswordForm />
        </TabsContent>
        <TabsContent value="settings" className="mt-6 flex justify-center">
          <div>{t('profile.settings')}</div>{' '}
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
