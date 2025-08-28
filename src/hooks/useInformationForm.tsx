import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface UserFormProps {
  userInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    country: string;
  };
  setUserInfo: (info: any) => void;
}

export const UserForm = ({ userInfo, setUserInfo }: UserFormProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Fullname */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-medium text-gray-600">Fullname</Label>
        <Input
          placeholder="Enter your fullname"
          value={userInfo.name}
          onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
        />
      </div>

      {/* Address */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-medium text-gray-600">Address</Label>
        <Input
          placeholder="Enter your address"
          value={userInfo.address}
          onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
        />
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="phone">Phone</Label>
        <PhoneInput
          country={userInfo.country.toLowerCase() as any}
          value={userInfo.phone}
          onChange={(phone, data?: any) =>
            setUserInfo({
              ...userInfo,
              phone: phone.replace(/\D/g, ''),
              country: data?.countryCode ? data.countryCode.toUpperCase() : userInfo.country,
            })
          }
          containerClass="w-full"
          inputClass="w-full !h-10 !text-sm !pl-12"
          buttonClass="!h-10"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <Label className="text-sm font-medium text-gray-600">Email</Label>
        <Input
          placeholder="Enter your email"
          type="email"
          value={userInfo.email}
          onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
        />
      </div>
    </div>
  );
};
