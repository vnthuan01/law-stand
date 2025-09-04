import { Link } from 'react-router-dom';
import lawImage from '@/assets/law-firm-logo.png';

interface BlogItem {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  author: string;
  date: string;
}

const relatedBlogs: BlogItem[] = [
  {
    id: 'b2',
    title: 'New Rules for Seasonal Employment',
    category: 'Labor',
    excerpt: 'Key updates for companies hiring seasonal workers this year.',
    author: 'Attorney B',
    date: '2025-07-20',
  },
  {
    id: 'b3',
    title: 'Registering a Business Online',
    category: 'Enterprise',
    excerpt: 'Process and documents required for e-registrations.',
    author: 'Attorney C',
    date: '2025-07-10',
  },
  {
    id: 'b4',
    title: 'Intellectual Property Basics for Startups',
    category: 'IP Law',
    excerpt: 'How startups can protect their inventions and branding.',
    author: 'Attorney D',
    date: '2025-06-15',
  },
];

function RelatedBlogSection() {
  return (
    <section aria-label="Related blogs" className="bg-gray-50 py-12 mt-12 border-t">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">Related articles</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedBlogs.map((post) => (
            <article
              key={post.id}
              className="flex flex-col rounded-lg border bg-white shadow-sm"
              aria-labelledby={`related-blog-${post.id}-title`}
            >
              <img
                src={lawImage}
                alt="Illustration for related blog"
                className="h-40 w-full rounded-t object-contain bg-gray-50"
              />
              <div className="p-4">
                <span className="text-xs font-medium text-blue-600">{post.category}</span>
                <h3
                  id={`related-blog-${post.id}-title`}
                  className="mt-1 line-clamp-2 text-base font-semibold"
                >
                  <Link to={`/resources/blogs/${post.id}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-gray-600">{post.excerpt}</p>
              </div>
              <footer className="mt-auto flex items-center justify-between border-t px-4 py-3 text-xs text-gray-500">
                <span>{post.author}</span>
                <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RelatedBlogSection;
