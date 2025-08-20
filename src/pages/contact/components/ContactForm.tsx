import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function ContactFormSection() {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-16">
      <Card className="shadow-md rounded-lg">
        <CardContent className="p-8 space-y-6">
          <div>
            <label className="block text-gray-800 mb-2">Full Name *</label>
            <Input placeholder="Full Name" className="h-14 bg-gray-100 border-0 rounded-md" />
          </div>

          <div>
            <label className="block text-gray-800 mb-2">Email Address *</label>
            <Input
              placeholder="Enter Email"
              type="email"
              className="h-14 bg-gray-100 border-0 rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-800 mb-2">Subject *</label>
            <Input placeholder="Subject" className="h-14 bg-gray-100 border-0 rounded-md" />
          </div>

          <div>
            <label className="block text-gray-800 mb-2">Message *</label>
            <Textarea
              placeholder="Your Message..."
              className="min-h-[120px] bg-gray-100 border-0 rounded-md resize-none"
            />
          </div>

          {/* Fake Captcha */}
          <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-sm border border-gray-400" />
              <span className="text-sm text-gray-700">I'm not a robot</span>
            </div>
            <img src="/image-1.png" alt="reCAPTCHA" className="w-14 h-12" />
          </div>

          <Button className="w-full h-14 bg-[#ef4f23] hover:bg-[#ef4f23]/90 text-white text-lg rounded-md">
            Submit Now
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
