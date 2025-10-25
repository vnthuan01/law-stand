 
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, User, CalendarIcon } from 'lucide-react';
import { useUpdateUserProfile } from '@/hooks/useUser';
import { useTranslation } from 'react-i18next';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import CustomCalendar from '@/components/ui/customCalendar';
import { Textarea } from '@/components/ui/textarea';

const profileSchema = z.object({
  id: z.string(),
  fullName: z.string().min(1, 'Full name is required'),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileUpdateFormProps {
  user: {
    id: string;
    phoneNumber: string;
    fullName: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    bio?: string;
    avatarUrl?: string;
  };
  onSuccess?: () => void;
}

export function ProfileUpdateForm({ user, onSuccess }: ProfileUpdateFormProps) {
  const { t, i18n } = useTranslation();
  const [previewImage, setPreviewImage] = useState<string | null>(user?.avatarUrl || null);
  const [date, setDate] = useState<Date | undefined>(() => {
    if (user?.dateOfBirth) {
      // Parse DD/MM/YYYY format
      const parts = user.dateOfBirth.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
    }
    return undefined;
  });

  const updateProfileMutation = useUpdateUserProfile();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      id: user?.id,
      phoneNumber: user?.phoneNumber || '',
      fullName: user?.fullName || '',
      dateOfBirth: user?.dateOfBirth || '',
      gender: user?.gender || '',
      address: user?.address || '',
      city: user?.city || '',
      province: user?.province || '',
      bio: user?.bio || '',
      postalCode: user?.postalCode || '',
      avatarUrl: user?.avatarUrl || '',
    },
  });

  const genderValue = watch('gender');
  const locale = i18n.language === 'vi' ? vi : enUS;

  const handleImageUrlChange = (url: string) => {
    setValue('avatarUrl', url);
    setPreviewImage(url || null);
  };

  const onSubmit = async (data: ProfileFormData) => {
    console.log('Form data:', data);
    console.log('Form errors:', errors);
    try {
      const updateData = {
        fullName: data.fullName,
        ...(data.dateOfBirth && { dateOfBirth: data.dateOfBirth }),
        ...(data.gender && { gender: data.gender }),
        ...(data.address && { address: data.address }),
        ...(data.city && { city: data.city }),
        ...(data.province && { province: data.province }),
        ...(data.postalCode && { postalCode: data.postalCode }),
        ...(data.bio && { bio: data.bio }),
        ...(data.avatarUrl && { avatarUrl: data.avatarUrl }),
      };
      console.log('Update data:', updateData);
      await updateProfileMutation.mutateAsync(updateData);
      toast.success(t('profile_update.update_success'));
      onSuccess?.();
    } catch (error) {
      console.error('Update error:', error);
      toast.error(t('profile_update.update_error'));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{t('profile_update.title')}</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24 ">
              {previewImage ? (
                <AvatarImage src={previewImage} alt="Avatar preview" />
              ) : (
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              )}
            </Avatar>

            <div className="w-full max-w-md">
              <Label htmlFor="avatarUrl">{t('profile_update.avatar_url')}</Label>
              <Input
                id="avatarUrl"
                {...register('avatarUrl')}
                placeholder={t('profile_update.avatar_placeholder')}
                onChange={(e) => handleImageUrlChange(e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-1">{t('profile_update.avatar_hint')}</p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t('profile_update.full_name')}</Label>
              <Input
                id="fullName"
                {...register('fullName')}
                placeholder={t('profile_update.full_name_placeholder')}
              />
              {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
            </div>

            {/* Birthdate */}
            <div className="space-y-2">
              <Label>{t('profile_update.date_of_birth')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP', { locale }) : t('profile_update.date_of_birth')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0">
                  <CustomCalendar
                    value={date}
                    onChange={(newDate) => {
                      setDate(newDate);
                      if (newDate) {
                        const formattedDate = format(newDate, 'dd/MM/yyyy');
                        setValue('dateOfBirth', formattedDate);
                      } else {
                        setValue('dateOfBirth', '');
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label>{t('profile_update.gender')}</Label>
            <Select value={genderValue} onValueChange={(value) => setValue('gender', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('profile_update.select_gender')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{t('profile_update.male')}</SelectItem>
                <SelectItem value="female">{t('profile_update.female')}</SelectItem>
                <SelectItem value="other">{t('profile_update.other')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Address Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t('profile_update.address_info')}</h3>

            <div className="space-y-2">
              <Label>{t('profile_update.address')}</Label>
              <Input
                {...register('address')}
                placeholder={t('profile_update.address_placeholder')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('profile_update.city')}</Label>
                <Input {...register('city')} placeholder={t('profile_update.city_placeholder')} />
              </div>

              <div className="space-y-2">
                <Label>{t('profile_update.province')}</Label>
                <Input
                  {...register('province')}
                  placeholder={t('profile_update.province_placeholder')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('profile_update.postal_code')}</Label>
                <Input
                  {...register('postalCode')}
                  placeholder={t('profile_update.postal_code_placeholder')}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('profile_update.phone_number')}</Label>
                <Input
                  {...register('phoneNumber')}
                  placeholder={t('profile_update.phone_number_placeholder')}
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label>{t('profile_update.bio')}</Label>
            <Textarea {...register('bio')} placeholder={t('profile_update.bio_placeholder')} />
            <p className="text-xs text-gray-500">{t('profile_update.bio_hint', { max: 300 })}</p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              {t('profile_update.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting || updateProfileMutation.isPending}>
              {isSubmitting || updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('profile_update.updating')}
                </>
              ) : (
                t('profile_update.update_info')
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
