import { MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';

const contactDetails = [
  {
    label: 'Client Support:',
    value: '1-800-1234-567',
    icon: PhoneIcon,
    type: 'phone',
  },
  {
    label: 'E-mail:',
    value: 'info@demolink.org',
    icon: MailIcon,
    type: 'email',
  },
  {
    label: 'Main Office:',
    value: '18/A, New Born Town Hall\nNew York, US',
    icon: MapPinIcon,
    type: 'address',
  },
];

export default function ContactInfoSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-4xl font-semibold text-gray-800 mb-8">Get in Touch</h2>
      <div className="space-y-8">
        {contactDetails.map((detail, index) => {
          const Icon = detail.icon;
          return (
            <div key={index} className="space-y-3">
              <h4 className="font-medium text-gray-700">{detail.label}</h4>
              <div className="flex items-center gap-4">
                <Icon className="w-6 h-6 text-[#ef4f23]" />
                <div className="text-lg text-gray-800 whitespace-pre-line">{detail.value}</div>
              </div>
              <div className="h-px bg-gray-200" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
