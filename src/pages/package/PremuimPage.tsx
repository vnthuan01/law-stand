import MainLayout from '@/components/layout/MainLayout';
import { Check } from 'lucide-react';

type Plan = {
  name: string;
  price: string;
  features: string[];
  popular?: boolean;
};

const plans: Plan[] = [
  {
    name: 'Free',
    price: '0 VNĐ',
    features: ['Free Membership', '5GB Storage', '1 Email Account'],
  },
  {
    name: 'Standard',
    price: '99K VNĐ',
    features: ['100GB Storage', '2 Email Accounts', '1 FTP Account'],
    popular: true,
  },
  {
    name: 'Professional',
    price: '149K VNĐ',
    features: ['Unlimited Storage', '2 FTP Accounts', '2 Email Accounts', 'Host Security'],
  },
];

export default function PricingPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Subscription Plans</h1>
        <p className="text-gray-600 mb-12 text-center max-w-lg">
          Choose the plan that suits you best. Start for free and upgrade when you're ready.
        </p>

        <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl shadow-md bg-white p-6 flex flex-col border transition-transform duration-200 hover:scale-105 hover:shadow-xl ${
                plan.popular ? 'border-orange-500' : 'border-gray-200'
              }`}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{plan.name}</h2>
              <p className="text-3xl font-bold text-gray-900 mb-6">
                {plan.price}
                <span className="text-base font-medium text-gray-500"> /mo</span>
              </p>

              <ul className="flex-1 mb-6 space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className="mt-auto bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-xl transition">
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
