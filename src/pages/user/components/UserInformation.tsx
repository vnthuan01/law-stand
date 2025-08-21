'use client';

import { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';
import countryList from 'react-select-country-list';

// Custom option hiển thị flag
const CountryOption = (props: any) => {
  const { innerProps, innerRef, data } = props;
  return (
    <div ref={innerRef} {...innerProps} className="flex items-center gap-2 p-1 hover:bg-gray-100">
      <img
        src={`https://flagcdn.com/16x12/${data.value.toLowerCase()}.png`}
        alt={data.label}
        className="w-4 h-3"
      />
      <span>{data.label}</span>
    </div>
  );
};

interface UserInfoCardsProps {
  name: string;
  role: string;
  email: string;
  phone?: string;
  country: string;
  city: string;
  street: string;
  avatarUrl?: string;
  onAvatarChange?: (file: File) => void;
  onUpdateInfo?: (data: {
    name: string;
    email: string;
    phone?: string;
    country: string;
    city: string;
    street: string;
  }) => void;
}

export function UserInfoCards({
  name,
  role,
  email,
  phone,
  country,
  city,
  street,
  avatarUrl,
  onAvatarChange,
  onUpdateInfo,
}: UserInfoCardsProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAvatarChange) onAvatarChange(file);
  };

  const countries: { label: string; value: string }[] = countryList().getData();

  const [formData, setFormData] = useState({
    name,
    role,
    email,
    phone: phone || '',
    country,
    city,
    street,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCountryChange = (option: { label: string; value: string } | null) => {
    if (!option) return;
    setFormData((prev) => ({ ...prev, country: option.value }));
  };

  const handleSubmit = () => {
    if (onUpdateInfo) onUpdateInfo(formData);
  };

  return (
    <div className="relative w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Avatar Card */}
        <Card className="flex flex-col items-center justify-center p-6">
          <div className="relative cursor-pointer group" onClick={handleAvatarClick}>
            <Avatar className="w-32 h-32 mb-4 ring-2 ring-muted-foreground/20 group-hover:ring-primary transition">
              <AvatarImage src={avatarUrl || '/avatar.png'} alt={name} />
              <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-white bg-black/60 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
              Change
            </span>
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <h2 className="text-2xl font-bold">{formData.name}</h2>
          <p className="text-muted-foreground mt-1">Role: {formData.role}</p>
        </Card>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Personal + Address Info */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Personal Information</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="sm:max-w-[425px]"
                  aria-describedby="full-info-description"
                >
                  <DialogHeader>
                    <DialogTitle>Edit Information</DialogTitle>
                    <DialogDescription id="full-info-description">
                      Update your personal and address information including phone
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 mt-2">
                    {/* Name */}
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Role (disabled) */}
                    <div>
                      <Label>Role</Label>
                      <Input value={formData.role} disabled />
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select
                        options={countries}
                        value={countries.find((c) => c.value === formData.country)}
                        onChange={handleCountryChange}
                        components={{ Option: CountryOption }}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <PhoneInput
                        country={formData.country.toLowerCase() as any}
                        value={formData.phone}
                        onChange={(phone, data?: any) =>
                          setFormData((prev) => ({
                            ...prev,
                            phone: phone.replace(/\D/g, ''),
                            country: data?.countryCode
                              ? data.countryCode.toUpperCase()
                              : prev.country,
                          }))
                        }
                        containerClass="w-full"
                        inputClass="w-full"
                        buttonClass="!h-full"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Street */}
                    <div>
                      <Label htmlFor="street">Street</Label>
                      <Input
                        id="street"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                      />
                    </div>

                    <Button className="mt-2 w-full" onClick={handleSubmit}>
                      Save
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>

            <CardContent className="space-y-2">
              <p>Email: {formData.email}</p>
              {formData.phone && <p>Phone: {formData.phone}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-2">
              <p>Country: {formData.country}</p>
              {formData.city && <p>City: {formData.city}</p>}
              {formData.street && <p>Street: {formData.street}</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
