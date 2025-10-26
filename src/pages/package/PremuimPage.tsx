import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Plan = {
  name: string;
  price: string;
  // Đảm bảo features luôn là mảng (string[])
  features: string[];
  popular?: boolean;
};

const getPlans = (t: (key: string, options?: any) => any): Plan[] => [
  {
    name: t('home.plans.free.name'),
    price: t('home.plans.free.price'),
    // SỬA TRIỆT ĐỂ: Dùng Array.isArray để đảm bảo features luôn là một mảng
    features: (Array.isArray(t('home.plans.free.features', { returnObjects: true }))
      ? t('home.plans.free.features', { returnObjects: true })
      : []) as string[],
  },
  {
    name: t('home.plans.standard.name'),
    price: t('home.plans.standard.price'),
    // SỬA TRIỆT ĐỂ
    features: (Array.isArray(t('home.plans.standard.features', { returnObjects: true }))
      ? t('home.plans.standard.features', { returnObjects: true })
      : []) as string[],
    popular: true,
  },
  {
    name: t('home.plans.professional.name'),
    price: t('home.plans.professional.price'),
    // SỬA TRIỆT ĐỂ
    features: (Array.isArray(t('home.plans.professional.features', { returnObjects: true }))
      ? t('home.plans.professional.features', { returnObjects: true })
      : []) as string[],
  },
];

export default function PricingPage() {
  const { t } = useTranslation();
  const plans = getPlans(t);
  const handleBuyNow = () => {
    console.log('Buy Now');
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        <span className="text-3xl font-bold text-gray-800 mb-6 text-orange-500">
          {t('home.subscription')}
        </span>{' '}
        {t('home.subscription_plans')}
      </h1>
      <p className="text-gray-600 mb-12 text-center max-w-lg">
        {t('home.subscription_plans_desc')}
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
              <span className="text-base font-medium text-gray-500">{t('home.per_month')}</span>
            </p>

            <ul className="flex-1 mb-6 space-y-3">
              {/* Giữ lại Optional Chaining là lớp bảo vệ cuối cùng */}
              {plan.features?.map((feature, idx) => (
                <li key={idx} className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={handleBuyNow}
              className="mt-auto bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-xl transition"
            >
              {t('home.buy_now')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
