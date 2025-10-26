import lawImage from '@/assets/law-firm-logo.png';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface UpdateItem {
  id: string;
  title: string;
  date: string;
  summary: string;
}

const mockUpdates: UpdateItem[] = [
  {
    id: '1',
    title: 'Labor Code Amendments 2025',
    date: '2025-08-01',
    summary: 'Flexible working hours and updated regional minimum wage guidance.',
  },
  {
    id: '2',
    title: 'New Decree on Road Traffic Penalties',
    date: '2025-07-15',
    summary: 'Stronger fines for alcohol violations and overspeeding.',
  },
  {
    id: '3',
    title: 'Circular guiding the Law on Enterprises',
    date: '2025-07-01',
    summary: 'Simplified business registration procedures and disclosures.',
  },
];

function LatestUpdateLawSection() {
  return (
    <section aria-label="Latest legal updates">
      <div className="mx-auto max-w-6xl px-4">
        <header className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Latest legal updates</h2>
          <Link
            to="/resources/updates"
            className="text-sm text-blue-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            View all
          </Link>
        </header>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockUpdates.map((update) => (
            <li key={update.id} className="flex">
              <Link to={`/resources/law-detail/${update.id}`} className="w-full">
                {/* 🔥 Make card full height */}
                <Card className="flex flex-col h-full cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="p-0">
                    <img
                      src={lawImage}
                      alt="Illustration for legal update"
                      className="h-32 w-full rounded-t-lg object-contain bg-gray-50"
                    />
                  </CardHeader>
                  {/* 🔥 Flex-grow ensures content fills, and button stays aligned */}
                  <CardContent className="flex flex-col flex-1 p-4">
                    <p className="text-xs text-gray-500">
                      {new Date(update.date).toLocaleDateString()}
                    </p>
                    <CardTitle className="mt-1 line-clamp-2 text-base font-semibold">
                      {update.title}
                    </CardTitle>
                    <p className="mt-2 line-clamp-3 text-sm text-gray-600 flex-1">
                      {update.summary}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default LatestUpdateLawSection;
