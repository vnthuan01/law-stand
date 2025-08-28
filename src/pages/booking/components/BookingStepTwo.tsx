import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { UserForm } from '@/hooks/useInformationForm';

export const BookingStepTwo = ({
  serviceId,
  selectedDate,
  selectedTimeSlot,
  duration,
  selectedLocation,
  userInfo,
  setUserInfo,
  agree,
  setAgree,
  onBack,
  onConfirm,
}: any) => {
  const [hostQuery, setHostQuery] = useState('');
  const [selectedHost, setSelectedHost] = useState<any | null>(null);
  const [hostDetail, setHostDetail] = useState<any | null>(null);
  const [isHostDialogOpen, setIsHostDialogOpen] = useState(false);
  const [isHostPickerOpen, setIsHostPickerOpen] = useState(false);

  const allHosts = useMemo(
    () => [
      {
        id: 'h1',
        name: 'Nguyen Van An',
        title: 'Senior Immigration Lawyer',
        rating: 4.9,
        services: ['01', '03'],
        bio: '15+ years in immigration and family law, trusted by 500+ clients.',
        certificates: ['LL.M. (Harvard)', 'Vietnam Bar Certificate', 'Immigration Law Cert.'],
        experienceYears: 15,
        age: 42,
        traits: ['Empathetic', 'Detail-oriented', 'Bilingual (EN/VN)'],
        hobbies: ['Running', 'Travel', 'Mentoring juniors'],
        gender: 'male',
      },
      {
        id: 'h2',
        name: 'Tran Thi Binh',
        title: 'Business & Tax Attorney',
        rating: 4.8,
        services: ['04'],
        bio: 'Expert in property rights and inheritance dispute resolution.',
        certificates: ['LL.B. (HCMC Law University)', 'Notary Certification'],
        experienceYears: 12,
        age: 38,
        traits: ['Calm', 'Analytical', 'Practical'],
        hobbies: ['Gardening', 'Classical music'],
        gender: 'female',
      },
      {
        id: 'h3',
        name: 'Le Quang Minh',
        title: 'Business & Tax Attorney',
        rating: 4.7,
        services: ['04', '06'],
        bio: 'Advises startups and SMEs on setup, tax, and investments.',
        certificates: ['CPA (Vietnam)', 'LL.B.', 'International Tax Workshop'],
        experienceYears: 10,
        age: 35,
        traits: ['Strategic', 'Direct', 'Data-driven'],
        hobbies: ['Cycling', 'Chess'],
        gender: 'male',
      },
      {
        id: 'h4',
        name: 'Pham Hoang Long',
        title: 'Dispute Resolution Lawyer',
        rating: 4.6,
        services: ['06', '03'],
        bio: 'Specializes in arbitration and complex commercial disputes.',
        certificates: ['Arbitration Training Cert.', 'LL.M. (Dispute Resolution)'],
        experienceYears: 9,
        age: 34,
        traits: ['Composed', 'Persuasive', 'Resilient'],
        hobbies: ['Photography', 'Hiking'],
        gender: 'male',
      },
      {
        id: 'h5',
        name: 'Do Thanh Nam',
        title: 'Document Legalization & Notarization Expert',
        rating: 4.8,
        services: ['05'],
        bio: 'Fast and accurate legalization for multinational document workflows.',
        certificates: ['Certified Notary', 'Compliance & AML Certificate'],
        experienceYears: 11,
        age: 39,
        traits: ['Meticulous', 'Reliable', 'Process-focused'],
        hobbies: ['Calligraphy', 'Coffee brewing'],
        gender: 'male',
      },
      {
        id: 'h6',
        name: 'Vo Tuan Kiet',
        title: 'Family & Marriage Counselor (Law)',
        rating: 4.7,
        services: ['03'],
        bio: 'Focus on mediation-first approach for family matters.',
        certificates: ['Mediation Certificate', 'Family Law Diploma'],
        experienceYears: 8,
        age: 33,
        traits: ['Patient', 'Empathetic', 'Good listener'],
        hobbies: ['Acoustic guitar', 'Volunteering'],
        gender: 'male',
      },
      {
        id: 'h7',
        name: 'Nguyen Thi Lan',
        title: 'Family & Marriage Lawyer',
        rating: 4.8,
        services: ['03'],
        bio: 'Guides clients through divorce, custody, and adoption with compassion.',
        certificates: ['LL.B. (Hanoi Law University)', 'Family Mediation Certificate'],
        experienceYears: 14,
        age: 41,
        traits: ['Compassionate', 'Practical', 'Supportive'],
        hobbies: ['Yoga', 'Cooking', 'Charity work'],
        gender: 'female',
      },
      {
        id: 'h8',
        name: 'Pham Minh Duc',
        title: 'Business & Tax Consultant',
        rating: 4.7,
        services: ['04'],
        bio: 'Assists SMEs with company setup, taxation, and compliance.',
        certificates: ['CPA Vietnam', 'LL.M. (Commercial Law)'],
        experienceYears: 9,
        age: 36,
        traits: ['Precise', 'Goal-oriented', 'Analytical'],
        hobbies: ['Running marathons', 'Stock trading'],
        gender: 'male',
      },
      {
        id: 'h9',
        name: 'Tran Hoai Phuong',
        title: 'Property & Inheritance Specialist',
        rating: 4.9,
        services: ['02'],
        bio: 'Handles inheritance planning and property transactions smoothly.',
        certificates: ['LL.B. (HCMC Law)', 'Certified Property Consultant'],
        experienceYears: 13,
        age: 40,
        traits: ['Trustworthy', 'Patient', 'Detail-focused'],
        hobbies: ['Painting', 'Traveling'],
        gender: 'female',
      },
      {
        id: 'h10',
        name: 'Le Van Hung',
        title: 'Dispute Resolution & Investment Consultant',
        rating: 4.8,
        services: ['06'],
        bio: 'Expert in arbitration and cross-border investment disputes.',
        certificates: ['LL.M. (International Business Law)', 'Arbitration Training'],
        experienceYears: 12,
        age: 39,
        traits: ['Logical', 'Calm under pressure', 'Persuasive'],
        hobbies: ['Chess', 'Golf'],
        gender: 'male',
      },
      {
        id: 'h11',
        name: 'Bui Thanh Ha',
        title: 'Immigration & Work Permit Lawyer',
        rating: 4.7,
        services: ['01'],
        bio: 'Helps foreign professionals and families settle legally in Vietnam.',
        certificates: ['LL.B.', 'Immigration Procedure Certificate'],
        experienceYears: 10,
        age: 35,
        traits: ['Efficient', 'Multilingual', 'Friendly'],
        hobbies: ['Cooking international cuisines', 'Reading history'],
        gender: 'female',
      },
      {
        id: 'h12',
        name: 'Hoang Van Son',
        title: 'Document Legalization Expert',
        rating: 4.8,
        services: ['05'],
        bio: 'Provides fast and accurate notarization for corporate documents.',
        certificates: ['Notary Certification', 'Compliance & AML Certificate'],
        experienceYears: 11,
        age: 37,
        traits: ['Reliable', 'Detail-oriented', 'Organized'],
        hobbies: ['Photography', 'Fishing'],
        gender: 'male',
      },
      {
        id: 'h13',
        name: 'Dang Kim Ngan',
        title: 'Family & Marriage Law Specialist',
        rating: 4.9,
        services: ['03'],
        bio: 'Dedicated to mediation-first family dispute resolution.',
        certificates: ['Mediation Training', 'LL.M. (Family Law)'],
        experienceYears: 15,
        age: 43,
        traits: ['Empathetic', 'Patient', 'Approachable'],
        hobbies: ['Gardening', 'Choir singing'],
        gender: 'female',
      },
      {
        id: 'h14',
        name: 'Nguyen Quoc Bao',
        title: 'Business & Tax Advisor',
        rating: 4.7,
        services: ['04', '06'],
        bio: 'Advises on corporate tax structures and cross-border deals.',
        certificates: ['CPA', 'International Taxation Certificate'],
        experienceYears: 12,
        age: 38,
        traits: ['Analytical', 'Decisive', 'Strategic'],
        hobbies: ['Cycling', 'Debating'],
        gender: 'male',
      },
      {
        id: 'h15',
        name: 'Tran My Hanh',
        title: 'Dispute Resolution Lawyer',
        rating: 4.6,
        services: ['06'],
        bio: 'Experienced in contract disputes and commercial litigation.',
        certificates: ['LL.M. (Litigation)', 'Arbitration Cert.'],
        experienceYears: 8,
        age: 34,
        traits: ['Assertive', 'Resilient', 'Thorough'],
        hobbies: ['Swimming', 'Volunteering'],
        gender: 'female',
      },
      {
        id: 'h16',
        name: 'Vu Dinh Tuan',
        title: 'Inheritance & Property Law Consultant',
        rating: 4.8,
        services: ['02', '03'],
        bio: 'Assists families with inheritance settlements and property divisions.',
        certificates: ['LL.B. (Hanoi)', 'Inheritance Planning Certificate'],
        experienceYears: 13,
        age: 41,
        traits: ['Balanced', 'Fair-minded', 'Meticulous'],
        hobbies: ['Hiking', 'Collecting antiques'],
        gender: 'male',
      },
      {
        id: 'h17',
        name: 'Nguyen Thanh Tung',
        title: 'Dispute Resolution & Arbitration Lawyer',
        rating: 4.7,
        services: ['06'],
        bio: 'Resolves complex commercial disputes with a focus on arbitration.',
        certificates: ['LL.M. (Dispute Resolution)', 'Arbitration Training'],
        experienceYears: 12,
        age: 40,
        traits: ['Calm', 'Strategic', 'Persuasive'],
        hobbies: ['Tennis', 'Collecting stamps'],
        gender: 'male',
      },
      {
        id: 'h18',
        name: 'Pham Thi Thu Ha',
        title: 'Family & Marriage Law Specialist',
        rating: 4.9,
        services: ['03'],
        bio: 'Helps families in custody, divorce, and adoption with empathy.',
        certificates: ['Family Law Diploma', 'Certified Mediator'],
        experienceYears: 16,
        age: 45,
        traits: ['Patient', 'Empathetic', 'Supportive'],
        hobbies: ['Cooking', 'Reading novels'],
        gender: 'female',
      },
      {
        id: 'h19',
        name: 'Tran Duy Khanh',
        title: 'Business & Tax Consultant',
        rating: 4.8,
        services: ['04'],
        bio: 'Advises SMEs and startups on corporate tax optimization.',
        certificates: ['CPA Vietnam', 'International Tax Cert.'],
        experienceYears: 11,
        age: 37,
        traits: ['Analytical', 'Direct', 'Efficient'],
        hobbies: ['Football', 'Stock investing'],
        gender: 'male',
      },
      {
        id: 'h20',
        name: 'Le My Linh',
        title: 'Document Legalization & Notary Expert',
        rating: 4.8,
        services: ['05'],
        bio: 'Specialized in notarization and legalization for international use.',
        certificates: ['Certified Notary', 'Compliance Certificate'],
        experienceYears: 9,
        age: 34,
        traits: ['Meticulous', 'Trustworthy', 'Fast learner'],
        hobbies: ['Baking', 'Gardening'],
        gender: 'female',
      },
      {
        id: 'h21',
        name: 'Do Van Quoc',
        title: 'Property & Inheritance Lawyer',
        rating: 4.6,
        services: ['02', '03'],
        bio: 'Assists families in property disputes and inheritance settlements.',
        certificates: ['LL.B.', 'Inheritance Planning Certificate'],
        experienceYears: 13,
        age: 41,
        traits: ['Detail-focused', 'Balanced', 'Fair-minded'],
        hobbies: ['Chess', 'Fishing'],
        gender: 'male',
      },
      {
        id: 'h22',
        name: 'Bui Thi Cam Tu',
        title: 'Immigration & Work Permit Lawyer',
        rating: 4.7,
        services: ['01'],
        bio: 'Helps expats with work permits, visas, and residency issues.',
        certificates: ['Immigration Law Cert.', 'LL.B.'],
        experienceYears: 8,
        age: 32,
        traits: ['Friendly', 'Organized', 'Multilingual'],
        hobbies: ['Traveling', 'Yoga'],
        gender: 'female',
      },
      {
        id: 'h23',
        name: 'Nguyen Huu Phuoc',
        title: 'Investment & Dispute Consultant',
        rating: 4.8,
        services: ['06'],
        bio: 'Advises on investment law and dispute prevention strategies.',
        certificates: ['LL.M. (International Law)', 'Arbitration Cert.'],
        experienceYears: 14,
        age: 42,
        traits: ['Strategic', 'Sharp', 'Composed'],
        hobbies: ['Golf', 'Collecting wines'],
        gender: 'male',
      },
      {
        id: 'h24',
        name: 'Vo Thi Hong Nhung',
        title: 'Family & Marriage Lawyer',
        rating: 4.9,
        services: ['03'],
        bio: 'Dedicated to fair divorce mediation and adoption procedures.',
        certificates: ['Mediation Training', 'LL.B.'],
        experienceYears: 12,
        age: 38,
        traits: ['Empathetic', 'Calm', 'Practical'],
        hobbies: ['Singing', 'Cooking'],
        gender: 'female',
      },
      {
        id: 'h25',
        name: 'Tran Van Hieu',
        title: 'Business & Corporate Tax Advisor',
        rating: 4.7,
        services: ['04', '06'],
        bio: 'Helps corporations in M&A tax planning and cross-border trade.',
        certificates: ['CPA', 'LL.M. (Business Law)'],
        experienceYears: 10,
        age: 36,
        traits: ['Data-driven', 'Logical', 'Confident'],
        hobbies: ['Cycling', 'Photography'],
        gender: 'male',
      },
      {
        id: 'h26',
        name: 'Nguyen Thi Hong',
        title: 'Notarization & Legalization Specialist',
        rating: 4.8,
        services: ['05'],
        bio: 'Trusted expert in fast and accurate legalization services.',
        certificates: ['Certified Notary', 'Legal Compliance Training'],
        experienceYears: 11,
        age: 39,
        traits: ['Organized', 'Careful', 'Efficient'],
        hobbies: ['Knitting', 'Coffee brewing'],
        gender: 'female',
      },
      {
        id: 'h27',
        name: 'Phan Quoc Viet',
        title: 'Dispute Resolution Lawyer',
        rating: 4.6,
        services: ['06'],
        bio: 'Specializes in commercial contract disputes and arbitration.',
        certificates: ['LL.M. (Litigation)', 'Arbitration Cert.'],
        experienceYears: 9,
        age: 35,
        traits: ['Resilient', 'Persuasive', 'Logical'],
        hobbies: ['Running', 'Volunteering'],
        gender: 'male',
      },
      {
        id: 'h28',
        name: 'Nguyen Thi Bao Tran',
        title: 'Inheritance & Property Law Consultant',
        rating: 4.9,
        services: ['02', '03'],
        bio: 'Guides families through property division and inheritance law.',
        certificates: ['LL.B.', 'Inheritance Mediation Training'],
        experienceYears: 15,
        age: 44,
        traits: ['Balanced', 'Empathetic', 'Practical'],
        hobbies: ['Reading', 'Painting'],
        gender: 'female',
      },
      {
        id: 'h29',
        name: 'Hoang Minh Tien',
        title: 'Immigration & Work Permit Advisor',
        rating: 4.7,
        services: ['01'],
        bio: 'Supports expats in legal work authorization and visas.',
        certificates: ['Immigration Law Cert.', 'LL.B.'],
        experienceYears: 7,
        age: 31,
        traits: ['Energetic', 'Bilingual', 'Detail-oriented'],
        hobbies: ['Football', 'Music'],
        gender: 'male',
      },
      {
        id: 'h30',
        name: 'Le Thi Thanh Mai',
        title: 'Family & Marriage Counselor (Law)',
        rating: 4.8,
        services: ['03'],
        bio: 'Encourages mediation-first approach in family matters.',
        certificates: ['Mediation Certificate', 'Family Law Diploma'],
        experienceYears: 10,
        age: 36,
        traits: ['Patient', 'Compassionate', 'Good listener'],
        hobbies: ['Acoustic guitar', 'Cooking'],
        gender: 'female',
      },
      {
        id: 'h31',
        name: 'Dang Van Lam',
        title: 'Business & Tax Consultant',
        rating: 4.7,
        services: ['04'],
        bio: 'Advises on corporate formation, accounting, and taxation.',
        certificates: ['CPA', 'Business Law Training'],
        experienceYears: 12,
        age: 39,
        traits: ['Structured', 'Reliable', 'Practical'],
        hobbies: ['Swimming', 'Chess'],
        gender: 'male',
      },
    ],
    [],
  );

  const hostOptions = useMemo(() => {
    const byService = serviceId
      ? allHosts.filter((h) => h.services.includes(String(serviceId)))
      : allHosts;
    if (!hostQuery) return byService;
    const q = hostQuery.toLowerCase();
    return byService.filter((h) => h.name.toLowerCase().includes(q));
  }, [allHosts, hostQuery, serviceId]);

  const handleConfirm = () => {
    onConfirm?.({
      serviceId,
      selectedDate,
      selectedTimeSlot,
      duration,
      selectedLocation,
      hostId: selectedHost?.id ?? null,
      hostName: selectedHost?.name ?? null,
      userInfo,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Booking Summary */}
      <h2 className="font-bold text-lg">Booking Summary</h2>
      <Card className="bg-slate-50">
        <CardContent className="p-6 text-sm grid md:grid-cols-2 divide-x divide-gray-200 gap-6">
          {/* Left Column */}
          <div className="space-y-3">
            <div>
              <p className="text-gray-500 text-sm">Appointment</p>
              <p className="font-semibold">{selectedDate?.toLocaleDateString('en-GB')}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Date</p>
              <p className="font-semibold">
                {selectedDate?.toLocaleDateString('en-EN', {
                  weekday: 'long',
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Time</p>
              <p className="font-semibold">{selectedTimeSlot}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3 ">
            <div>
              <p className="text-gray-500 text-sm">Host</p>
              <Popover open={isHostPickerOpen} onOpenChange={setIsHostPickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 justify-between"
                    aria-label="Open host selector"
                  >
                    {selectedHost ? (
                      <span className="truncate text-left">
                        {selectedHost.name}
                        <span className="block text-xs text-gray-500">{selectedHost.title}</span>
                      </span>
                    ) : (
                      <span className="text-gray-500">Select a host</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[320px]">
                  <Command>
                    <CommandInput
                      placeholder="Search host by name..."
                      value={hostQuery}
                      onValueChange={setHostQuery}
                    />
                    <CommandList>
                      <CommandEmpty>No hosts found.</CommandEmpty>
                      <CommandGroup heading="Suggested">
                        {hostOptions.map((h) => (
                          <CommandItem
                            key={h.id}
                            value={`${h.name} ${h.title}`}
                            onSelect={() => {
                              setSelectedHost(h);
                              setIsHostPickerOpen(false);
                            }}
                            className="flex items-center justify-between gap-2"
                          >
                            <div>
                              <p className="text-sm font-medium">{h.name}</p>
                              <p className="text-xs text-gray-500">
                                {h.title} • ⭐ {h.rating}
                              </p>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setHostDetail(h);
                                setIsHostDialogOpen(true);
                              }}
                            >
                              Detail
                            </Button>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid md:grid-cols-2">
              <div>
                <p className="text-gray-500 text-sm">Duration</p>
                <p className="font-semibold">{duration ? `${duration} minutes` : '-'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Location</p>
                <p className="font-semibold">{selectedLocation}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Info */}
      <h2 className="font-bold text-lg">Your Information</h2>
      <UserForm userInfo={userInfo} setUserInfo={setUserInfo} />

      {/* Agree */}
      <div className="flex items-start gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-1"
        />
        <span>
          I understand and agree that booking this appointment is subject to our terms and
          conditions.
        </span>
      </div>

      {/* Buttons */}
      <div className="flex justify-between gap-2 mt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          className="bg-blue-600 text-white hover:bg-blue-700"
          disabled={!agree}
          onClick={handleConfirm}
        >
          Confirm Booking
        </Button>
      </div>
      <Dialog open={isHostDialogOpen} onOpenChange={setIsHostDialogOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{hostDetail?.name ?? 'Host Detail'}</DialogTitle>
            {hostDetail?.title ? <DialogDescription>{hostDetail.title}</DialogDescription> : null}
          </DialogHeader>
          <div className="space-y-3 text-sm">
            {hostDetail?.rating ? <p>Rating: ⭐ {hostDetail.rating}</p> : null}
            {hostDetail?.bio ? <p className="text-gray-600">{hostDetail.bio}</p> : null}
            {hostDetail?.experienceYears ? (
              <p>Experience: {hostDetail.experienceYears} years</p>
            ) : null}
            {hostDetail?.age ? <p>Age: {hostDetail.age}</p> : null}
            {hostDetail?.gender ? <p>Gender: {hostDetail.gender}</p> : null}
            {Array.isArray(hostDetail?.certificates) && hostDetail.certificates.length > 0 ? (
              <div>
                <p className="font-medium">Certificates</p>
                <ul className="list-disc list-inside text-gray-700">
                  {hostDetail.certificates.map((c: string) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {Array.isArray(hostDetail?.traits) && hostDetail.traits.length > 0 ? (
              <div>
                <p className="font-medium">Traits</p>
                <div className="flex flex-wrap gap-2">
                  {hostDetail.traits.map((t: string) => (
                    <span key={t} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {Array.isArray(hostDetail?.hobbies) && hostDetail.hobbies.length > 0 ? (
              <div>
                <p className="font-medium">Hobbies</p>
                <div className="flex flex-wrap gap-2">
                  {hostDetail.hobbies.map((h: string) => (
                    <span key={h} className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => {
                if (hostDetail) setSelectedHost(hostDetail);
                setIsHostDialogOpen(false);
              }}
            >
              Choose this host
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsHostDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
