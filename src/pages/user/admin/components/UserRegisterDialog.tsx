import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateUser } from '@/hooks/useUser';
import { UserPlus, Eye, EyeOff, Copy, Check } from 'lucide-react';

interface UserRegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const registerSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  role: z.number().min(1, 'Role is required'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function UserRegisterDialog({ open, onOpenChange }: UserRegisterDialogProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const createUserMutation = useCreateUser();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      role: 1,
    },
  });

  const roleValue = watch('role');

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success(t('user_management.password_copied'));
    } catch (error: any) {
      console.log(error.message.error);
      toast.error(t('user_management.copy_failed'));
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (!generatedPassword) {
      toast.error(t('user_management.generate_password_first'));
      return;
    }

    try {
      await createUserMutation.mutateAsync({
        ...data,
        password: generatedPassword,
        role: data.role,
      });
      toast.success(t('user_management.user_created_success'));
      reset();
      setGeneratedPassword('');
      onOpenChange(false);
    } catch (error) {
      console.error('Create user error:', error);
      toast.error(t('user_management.user_created_error'));
    }
  };

  const handleClose = () => {
    reset();
    setGeneratedPassword('');
    setCopied(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <UserPlus className="h-6 w-6" />
            {t('user_management.register_user')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('user_management.user_information')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t('user_management.full_name')} *</Label>
                  <Input
                    id="fullName"
                    {...register('fullName')}
                    placeholder={t('user_management.enter_full_name')}
                    className={errors.fullName ? 'border-red-500' : ''}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('user_management.email')} *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder={t('user_management.enter_email')}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">{t('user_management.phone_number')} *</Label>
                  <Input
                    id="phoneNumber"
                    {...register('phoneNumber')}
                    placeholder={t('user_management.enter_phone')}
                    className={errors.phoneNumber ? 'border-red-500' : ''}
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">{t('user_management.role')} *</Label>
                  <Select
                    value={roleValue.toString()}
                    onValueChange={(value) => setValue('role', Number(value))}
                  >
                    <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                      <SelectValue placeholder={t('user_management.select_role')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">{t('user_management.customer')}</SelectItem>
                      <SelectItem value="2">{t('user_management.lawyer')}</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Generation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('user_management.password_generation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={generatePassword}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  {t('user_management.generate_password')}
                </Button>
                <span className="text-sm text-gray-500">
                  {t('user_management.password_will_be_generated')}
                </span>
              </div>

              {generatedPassword && (
                <div className="space-y-2">
                  <Label>{t('user_management.generated_password')}</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={generatedPassword}
                      readOnly
                      className="font-mono"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copyPassword}
                      disabled={copied}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">{t('user_management.password_note')}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !generatedPassword}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {t('user_management.creating')}
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  {t('user_management.create_user')}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
