import { Card, CardContent } from '@/components/ui/card';
import { Linkedin, Mail, Star } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  photo: string;
  linkedin?: string;
  email?: string;
  leader?: boolean;
  bio?: string; // mô tả ngắn
}

export default function TeamCard({ member }: { member: TeamMember }) {
  const photoUrl =
    member.photo ||
    'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=600&auto=format&fit=crop';
  return (
    <Card className="overflow-hidden rounded-xl border border-zinc-200 shadow-xs h-full flex flex-col relative">
      {/* avatar */}
      <div className="relative h-[280px]">
        <img
          src={photoUrl}
          alt={member.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Subcard  */}
        {member.bio && (
          <div className="absolute -bottom-3 right-2 bg-white border border-gray-200 shadow-lg rounded-xl p-4 max-w-[80%]">
            <h4 className="text-sm font-semibold text-gray-900">{member.role}</h4>
            <p className="text-xs text-gray-500 mt-1">{member.bio}</p>
          </div>
        )}
      </div>

      {/* content */}
      <CardContent className="flex-1 flex flex-col justify-between p-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
            {member.name}
            {member.leader && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
          </h3>
        </div>
        <div className="mt-3 flex items-center gap-2">
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex size-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition-colors hover:border-primary hover:bg-primary hover:text-white"
              aria-label={`${member.name} on LinkedIn`}
            >
              <Linkedin className="size-4" />
            </a>
          )}
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="inline-flex size-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition-colors hover:border-primary hover:bg-primary hover:text-white"
              aria-label={`Email ${member.name}`}
            >
              <Mail className="size-4" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
