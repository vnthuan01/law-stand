import lawImage from '@/assets/law-firm-logo.png';
import { useTranslation } from 'react-i18next';

interface UpdateItem {
  id: string;
  title: string;
  date: string;
  summary: string;
}

function AllLastestUpdateLaw() {
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
    <section aria-label="All latest legal updates" className="py-12">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">
          {t('resources.all_latest_updates')}
        </h1>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockUpdates.map((update) => (
            <li key={update.id} className="rounded-lg border bg-white p-4 shadow-sm">
              <article aria-labelledby={`update-${update.id}-title`}>
                <img
                  src={lawImage}
                  alt="Illustration for legal update"
                  className="mb-3 h-32 w-full rounded object-contain bg-gray-50"
                />
                <p className="text-xs text-gray-500">
                  {new Date(update.date).toLocaleDateString()}
                </p>
                <h2 id={`update-${update.id}-title`} className="mt-1 text-base font-semibold">
                  {update.title}
                </h2>
                <p className="mt-2 text-sm text-gray-600">{update.summary}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default AllLastestUpdateLaw;
