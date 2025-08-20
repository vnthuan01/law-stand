import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from './layout';
import { useAuth } from '@/hooks/useAuth';

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  // const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login({ us: username, pw: password });

      // navigate('/');
    } catch (err: unknown) {
      setError((err as Error).message || 'Invalid username or password');
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-md rounded-2xl bg-transparent shadow-md border-none">
        <CardContent className="px-10 py-12">
          <form className="flex flex-col items-center gap-6 w-full" onSubmit={handleLogin}>
            <h1 className="text-4xl font-bold text-center text-black">Login</h1>

            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

            <div className="w-full flex flex-col gap-1">
              <Label className="text-sm text-[#6d7081]">Username</Label>
              <Input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-lg border border-[#dadce0] focus:border-2 focus:border-[#101010] py-6"
              />
            </div>

            <div className="w-full flex flex-col gap-1">
              <Label className="text-sm text-[#6d7081]">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <Button
              type="submit"
              className="w-full h-[50px] bg-[#ef4f23] rounded-lg font-bold text-white hover:bg-[#ef4f23]/90"
            >
              Login
            </Button>

            <p className="text-base text-center">
              <span className="italic">Don&apos;t have an account? </span>
              <Link to="/register" className="font-extrabold italic text-[#ef4f23]">
                Register
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}

export default LoginPage;
