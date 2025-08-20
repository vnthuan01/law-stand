import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import logo from '@/assets/law-firm-logo.png';
import background from '@/assets/background-auth-layout.png';
import AuthLayout from './layout';

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  return (
    <AuthLayout imageSrc={background}>
      <Card className="w-full max-w-md rounded-2xl bg-transparent shadow-md border-none">
        <CardContent className="px-10 py-12">
          <div className="flex flex-col items-center gap-6 w-full">
            <img
              src={logo}
              alt="Logo Lawstand"
              className="h-14 w-14 cover-contain border rounded-full bg-white cursor-pointer"
              onClick={() => navigate('/')}
            />
            <h1 className="text-4xl font-bold text-center text-black">Register</h1>
            <h4 className="text-sm text-center text-gray-500">
              Welcome to Lawstand! Please enter your details.
            </h4>
            <Button
              variant="outline"
              className="w-full h-[50px] rounded-lg border border-[#dadce0] bg-white hover:bg-gray-50 flex items-center justify-center gap-3 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="24px"
                height="24px"
              >
                <path
                  fill="#FFC107"
                  d="M43.6,20.5H42V20H24v8h11.3c-1.6,4.6-6,8-11.3,8c-6.6,0-12-5.4-12-12s5.4-12,12-12
      c3.1,0,5.9,1.2,8,3.1l5.7-5.7C33.3,6.1,28.9,4,24,4C12.9,4,4,12.9,4,24s8.9,20,20,20c11.0,0,19-8,19-20C43.9,22.7,43.8,21.6,43.6,20.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3,14.7l6.6,4.8C14.7,15.1,19,12,24,12c3.1,0,5.9,1.2,8,3.1l5.7-5.7
      C33.3,6.1,28.9,4,24,4C16,4,9,8.5,6.3,14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.2,0,9.6-1.7,12.8-4.6l-5.9-4.9C29,36.5,26.7,37.5,24,37.5c-5.3,0-9.7-3.4-11.3-8
      l-6.6,5C9,39.5,16,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6,20.5H42V20H24v8h11.3c-0.7,2-2,3.7-3.8,4.9l5.9,4.9C40.3,34.4,43.9,29,43.9,22.7
      C43.9,22,43.8,21.3,43.6,20.5z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">Sign up with Google</span>
            </Button>

            <div className="relative w-full flex items-center">
              <div className="w-full h-px bg-[#dadce0]" />
              <span className="absolute left-1/2 -translate-x-1/2 bg-white px-2 text-base text-[#2f1c6a]">
                or
              </span>
            </div>

            {/* Full name */}
            <div className="w-full flex flex-col gap-1">
              <Label className="text-sm text-[#6d7081]">Full name</Label>
              <Input
                type="text"
                placeholder="Enter your full name"
                className="rounded-lg border border-[#dadce0] focus:border-2 focus:border-[#101010] py-6"
              />
            </div>

            {/* Email */}
            <div className="w-full flex flex-col gap-1">
              <Label className="text-sm text-[#6d7081]">Email address</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                className="rounded-lg border border-[#dadce0] focus:border-2 focus:border-[#101010] py-6"
              />
            </div>

            {/* Password */}
            <div className="w-full flex flex-col gap-1">
              <Label className="text-sm text-[#6d7081]">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  className="rounded-lg border border-[#dadce0] pr-10 py-6"
                />
                {showPassword ? (
                  <EyeOffIcon
                    aria-label="Hide password"
                    onClick={() => setShowPassword(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                  />
                ) : (
                  <EyeIcon
                    aria-label="Show password"
                    onClick={() => setShowPassword(true)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                  />
                )}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="w-full flex flex-col gap-1">
              <Label className="text-sm text-[#6d7081]">Confirm password</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className="rounded-lg border border-[#dadce0] pr-10 py-6"
                />
                {showConfirmPassword ? (
                  <EyeOffIcon
                    aria-label="Hide confirm password"
                    onClick={() => setShowConfirmPassword(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                  />
                ) : (
                  <EyeIcon
                    aria-label="Show confirm password"
                    onClick={() => setShowConfirmPassword(true)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                  />
                )}
              </div>
            </div>

            {/* Submit */}
            <Button className="w-full h-[50px] bg-[#ef4f23] rounded-lg font-bold text-white hover:bg-[#ef4f23]/90">
              Create account
            </Button>

            {/* Link login */}
            <p className="text-base text-center">
              <span className="italic">Already have an account? </span>
              <Link to="/login" className="font-extrabold italic text-[#ef4f23]">
                Login
              </Link>
            </p>

            {/* Terms */}
            <p className="text-xs text-[#6d7081] text-center">
              By continuing you agree with our{' '}
              <span className="font-bold underline cursor-pointer">Terms of Service</span> and
              confirm that you have read our{' '}
              <span className="font-bold underline cursor-pointer">Privacy Policy</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}

export default RegisterPage;
