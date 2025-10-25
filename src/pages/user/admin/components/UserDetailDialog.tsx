import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetUserById } from '@/hooks/useUser';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Mail, Phone, MapPin, User, Shield } from 'lucide-react';

interface UserDetailDialogProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailDialog({ userId, open, onOpenChange }: UserDetailDialogProps) {
  const { t } = useTranslation();
  const { data: userData, isLoading, error } = useGetUserById(userId || '');

  const user = userData?.data;

  const getRoleDisplayName = (role: number) => {
    switch (role) {
      case 1:
        return t('user_management.customer');
      case 2:
        return t('user_management.lawyer');
      case 3:
        return t('user_management.admin');
      default:
        return t('user_management.customer');
    }
  };

  const getRoleBadgeVariant = (role: number): BadgeProps['variant'] => {
    switch (role) {
      case 1:
        return 'outline';
      case 2:
        return 'info';
      case 3:
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getLastLoginStatus = (lastLoginAt: string | null) => {
    if (!lastLoginAt) {
      return { text: t('user_management.never_logged_in'), variant: 'outline' as const };
    }

    const loginDate = new Date(lastLoginAt);
    const now = new Date();
    const diffInHours = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return { text: t('user_management.recent_login'), variant: 'default' as const };
    } else if (diffInHours < 168) {
      return { text: t('user_management.old_login'), variant: 'secondary' as const };
    } else {
      return { text: t('user_management.old_login'), variant: 'outline' as const };
    }
  };

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              {t('user_management.error_loading')}
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-gray-500">{t('user_management.error_loading')}</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {t('user_management.user_details')}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
        ) : user ? (
          <div className="space-y-6">
            {/* User Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback className="text-2xl">
                      {user.fullName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold">{user.fullName}</h3>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {getRoleDisplayName(user.role)}
                      </Badge>
                      <Badge variant={user.isActive ? 'success' : 'destructive'}>
                        {user.isActive
                          ? t('user_management.active')
                          : t('user_management.inactive')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{user.phoneNumber}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t('user_management.personal_info')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      {t('user_management.full_name')}
                    </label>
                    <p className="text-sm">{user.fullName}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      {t('user_management.email')}
                    </label>
                    <p className="text-sm">{user.email}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      {t('user_management.phone_number')}
                    </label>
                    <p className="text-sm">{user.phoneNumber}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      {t('user_management.date_of_birth')}
                    </label>
                    <p className="text-sm">
                      {user.dateOfBirth || t('user_management.not_provided')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      {t('user_management.gender')}
                    </label>
                    <p className="text-sm">{user.gender || t('user_management.not_provided')}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      {t('user_management.role')}
                    </label>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {getRoleDisplayName(user.role)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            {(user.address || user.city || user.province || user.postalCode) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {t('user_management.address_info')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">
                        {t('user_management.address')}
                      </label>
                      <p className="text-sm">{user.address || t('user_management.not_provided')}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">
                        {t('user_management.city')}
                      </label>
                      <p className="text-sm">{user.city || t('user_management.not_provided')}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">
                        {t('user_management.province')}
                      </label>
                      <p className="text-sm">
                        {user.province || t('user_management.not_provided')}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">
                        {t('user_management.postal_code')}
                      </label>
                      <p className="text-sm">
                        {user.postalCode || t('user_management.not_provided')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bio */}
            {user.bio && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('user_management.bio')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{user.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {t('user_management.account_info')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      {t('user_management.status')}
                    </label>
                    <Badge variant={user.isActive ? 'success' : 'destructive'}>
                      {user.isActive ? t('user_management.active') : t('user_management.inactive')}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      {t('user_management.email_verified')}
                    </label>
                    <Badge variant={user.isEmailVerified ? 'success' : 'secondary'}>
                      {user.isEmailVerified
                        ? t('user_management.verified')
                        : t('user_management.not_verified')}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      {t('user_management.phone_verified')}
                    </label>
                    <Badge variant={user.isPhoneVerified ? 'success' : 'secondary'}>
                      {user.isPhoneVerified
                        ? t('user_management.verified')
                        : t('user_management.not_verified')}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      {t('user_management.last_login')}
                    </label>
                    <div className="flex flex-col space-y-1">
                      <Badge
                        variant={
                          (getLastLoginStatus(user.lastLoginAt).variant as BadgeProps['variant']) ||
                          'outline'
                        }
                      >
                        {getLastLoginStatus(user.lastLoginAt).text}
                      </Badge>
                      {user.lastLoginAt && (
                        <span className="text-xs text-gray-500">
                          {format(new Date(user.lastLoginAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">
                      {t('user_management.created_date')}
                    </label>
                    <p className="text-sm">
                      {format(new Date(user.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
