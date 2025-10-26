import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
    features: [
      '5 câu hỏi miễn phí với AI tư vấn luật',
      'Truy cập cơ bản kho kiến thức pháp lý',
      'Đặt lịch tư vấn 1 lần/tháng',
      'Hỗ trợ qua email trong giờ hành chính',
    ],
  },
  {
    name: 'Standard',
    price: '159K VNĐ ',
    features: [
      'Tư vấn AI không giới hạn',
      'Đặt lịch tư vấn với luật sư (tối đa 2 lần/tháng)',
      'Ưu tiên trả lời nhanh trong 24h',
      'Truy cập tài liệu mẫu hợp đồng & văn bản pháp luật',
    ],
    popular: true,
  },
  {
    name: 'Professional',
    price: '249K VNĐ',
    features: [
      'Tư vấn AI không giới hạn & chuyên sâu theo lĩnh vực',
      'Đặt lịch tư vấn không giới hạn với luật sư',
      'Hỗ trợ ưu tiên 24/7 qua chat hoặc điện thoại',
      'Kho dữ liệu pháp lý nâng cao & mẫu văn bản doanh nghiệp',
      'Báo cáo và lưu trữ lịch sử tư vấn theo tài khoản',
    ],
  },
];

export default function PricingPage() {
  const { t } = useTranslation();
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
              <span className="text-base font-medium text-gray-500">/month</span>
            </p>

            <ul className="flex-1 mb-6 space-y-3">
              {plan.features.map((feature, idx) => (
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
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
