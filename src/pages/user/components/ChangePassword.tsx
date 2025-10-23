'use client';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { PasswordStrength } from './CheckPasswordForm';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, 'Current password must be at least 8 characters'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'At least 1 uppercase letter')
      .regex(/[a-z]/, 'At least 1 lowercase letter')
      .regex(/[0-9]/, 'At least 1 number')
      .regex(/[^A-Za-z0-9]/, 'At least 1 special character'),
    confirmPassword: z.string().min(8, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState<{ [key: string]: boolean }>({});

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1500));
    console.log('Password changed:', values);
    setLoading(false);
  };

  // newPassword realtime
  const newPassword = form.watch('newPassword');

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>{t('profile.change_password')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Current Password */}
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.current_password')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={show.currentPassword ? 'text' : 'password'}
                        placeholder={t('auth.enter_current_password')}
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2"
                        onClick={() =>
                          setShow((prev) => ({ ...prev, currentPassword: !prev.currentPassword }))
                        }
                      >
                        {show.currentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Password */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.new_password')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={show.newPassword ? 'text' : 'password'}
                        placeholder={t('auth.enter_new_password')}
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2"
                        onClick={() =>
                          setShow((prev) => ({ ...prev, newPassword: !prev.newPassword }))
                        }
                      >
                        {show.newPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.confirm_password')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={show.confirmPassword ? 'text' : 'password'}
                        placeholder={t('auth.confirm_new_password')}
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2"
                        onClick={() =>
                          setShow((prev) => ({
                            ...prev,
                            confirmPassword: !prev.confirmPassword,
                          }))
                        }
                      >
                        {show.confirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Strength confirm */}
            <PasswordStrength password={newPassword} />

            <Button type="submit" className="w-full" disabled={loading || !form.formState.isValid}>
              {loading ? t('auth.changing_password') : t('profile.change_password')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
