import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Edit, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UserInfoCardsProps {
  name: string;
  role?: string;
  gender?: string;
  email: string;
  phone?: string;
  province?: string;
  city?: string;
  address?: string;
  bio?: string;
  dateOfBirth?: string;
  postalCode?: string;
  avatarUrl?: string;
  onEdit?: () => void;
}

export function UserInfoCards({
  name,
  role,
  gender,
  email,
  phone,
  province,
  city,
  address,
  bio,
  dateOfBirth,
  postalCode,
  avatarUrl,
  onEdit,
}: UserInfoCardsProps) {
  const getRoleBadgeVariant = (role: string | number | undefined) => {
    if (typeof role === 'number') {
      switch (role) {
        case 1:
          return 'destructive';
        case 2:
          return 'secondary';
        case 3:
          return 'outline';
        case 4:
          return 'outline';
        default:
          return 'outline';
      }
    }
    return 'outline';
  };
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      {/* User Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{name}</h2>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant={getRoleBadgeVariant(role)}>{t(`user_info.roles.${role}`)}</Badge>
              </div>
              <p className="text-gray-500 mt-1">{email}</p>
            </div>
            {onEdit && (
              <Button onClick={onEdit} className="flex items-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>{t('user_info.edit')}</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t('user_info.profile_title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">{t('user_info.name')}</Label>
              <p className="text-lg">{name || t('user_info.unknown')}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">{t('user_info.gender')}</Label>
              <p className="text-lg">
                {gender === 'male'
                  ? t('user_info.male')
                  : gender === 'female'
                    ? t('user_info.female')
                    : t('user_info.other')}
              </p>
            </div>
            {dateOfBirth && (
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  {t('user_info.date_of_birth')}
                </Label>
                <p className="text-lg">{dateOfBirth}</p>
              </div>
            )}
            {phone && (
              <div>
                <Label className="text-sm font-medium text-gray-500">{t('user_info.phone')}</Label>
                <p className="text-lg">{phone}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      {(province || city || address) && (
        <Card>
          <CardHeader>
            <CardTitle>{t('user_info.address_title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {province && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    {t('user_info.province')}
                  </Label>
                  <p className="text-lg">{province}</p>
                </div>
              )}
              {city && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">{t('user_info.city')}</Label>
                  <p className="text-lg">{city}</p>
                </div>
              )}
              {address && (
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-500">
                    {t('user_info.address')}
                  </Label>
                  <p className="text-lg">{address}</p>
                </div>
              )}
            </div>
            {postalCode && (
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  {t('user_info.postal_code')}
                </Label>
                <p className="text-lg">{postalCode}</p>
              </div>
            )}
            {bio && (
              <div>
                <Label className="text-sm font-medium text-gray-500">{t('user_info.bio')}</Label>
                <p className="text-lg">{bio}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
