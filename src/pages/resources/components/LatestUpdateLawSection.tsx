import lawImage from '@/assets/law-firm-logo.png';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface UpdateItem {
  id: string;
  title: string;
  date: string;
  summary: string;
}

function LatestUpdateLawSection() {
  const { t } = useTranslation();

  const mockUpdates: UpdateItem[] = [
    {
      id: '1',
      title: t('resources.updates.u1_title'),
      date: '2025-08-01',
      summary: t('resources.updates.u1_summary'),
    },
    {
      id: '2',
      title: t('resources.updates.u2_title'),
      date: '2025-07-15',
      summary: t('resources.updates.u2_summary'),
    },
    {
      id: '3',
      title: t('resources.updates.u3_title'),
      date: '2025-07-01',
      summary: t('resources.updates.u3_summary'),
    },
  ];

  return (
    <section aria-label="Latest legal updates">
      <div className="mx-auto max-w-6xl px-4">
        <header className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight">{t('resources.latest_updates')}</h2>
          <Link
            to="/resources/updates"
            className="text-sm text-blue-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            {t('common.view_all')}
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
                      alt={t('resources.latest_updates_illustration_alt')}
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
