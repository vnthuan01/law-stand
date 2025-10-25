import { BookOpen, Gavel, Landmark, Users, Building } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LawLink {
  id: string;
  href: string;
  icon: React.ElementType;
}

const popularLaws: LawLink[] = [
  { id: 'pl1', href: '#', icon: Landmark },
  { id: 'pl2', href: '#', icon: Users },
  { id: 'pl3', href: '#', icon: Gavel },
  { id: 'pl4', href: '#', icon: BookOpen },
  { id: 'pl5', href: '#', icon: Building },
];

function PopularLawSidebar() {
  const { t } = useTranslation();
  return (
    <aside
      aria-label="Popular Laws"
      className="w-full rounded-2xl border bg-white/70 backdrop-blur-md p-5 shadow-lg ring-1 ring-gray-200 lg:w-80"
    >
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <Gavel className="h-5 w-5 text-blue-600" />
        {t('resources.popular_laws')}
      </h2>

      <nav className="mt-5">
        <ul className="space-y-3">
          {popularLaws.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  aria-label={`${t('common.view')} ${t(`resources.law_titles.${item.id}`)}`}
                  tabIndex={0}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{t(`resources.law_titles.${item.id}`)}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export default PopularLawSidebar;
