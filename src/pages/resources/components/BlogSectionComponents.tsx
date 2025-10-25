import lawImage from '@/assets/law-firm-logo.png';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface BlogItem {
  id: string;
  date: string;
}

const mockBlogs: BlogItem[] = [
  {
    id: 'b1',
    date: '2025-07-30',
  },
  {
    id: 'b2',
    date: '2025-07-20',
  },
  {
    id: 'b3',
    date: '2025-07-10',
  },
];

function BlogSectionComponents() {
  const { t } = useTranslation();
  return (
    <section aria-label={t('resources.blog.aria_label')} className="py-12">
      <div className="mx-auto max-w-6xl px-4">
        <header className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {t('resources.blog.featured_articles')}
          </h2>
          <Link
            to="/resources/blogs"
            className="text-sm text-blue-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            {t('common.view_all')}
          </Link>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockBlogs.map((post) => (
            <Link
              key={post.id}
              to={`/resources/blog-detail/${post.id}`}
              className="flex flex-col rounded-lg border bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow h-full"
              aria-labelledby={`blog-${post.id}-title`}
            >
              <img
                src={lawImage}
                alt={t('resources.blog.illustration_alt')}
                className="h-40 w-full rounded-t object-contain bg-gray-50"
              />
              <div className="flex flex-col flex-1 p-4">
                <span className="text-xs font-medium text-blue-600">
                  {t(`resources.blog.items.${post.id}.category`)}
                </span>
                <h3
                  id={`blog-${post.id}-title`}
                  className="mt-1 line-clamp-2 text-base font-semibold"
                >
                  {t(`resources.blog.items.${post.id}.title`)}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-gray-600 flex-1">
                  {t(`resources.blog.items.${post.id}.excerpt`)}
                </p>
              </div>
              <footer className="mt-auto flex items-center justify-between border-t px-4 py-3 text-xs text-gray-500">
                <span>{t(`resources.blog.items.${post.id}.author`)}</span>
                <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
              </footer>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BlogSectionComponents;
