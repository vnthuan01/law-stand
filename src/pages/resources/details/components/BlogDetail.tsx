import { useParams, Link } from 'react-router-dom';
import lawImage from '@/assets/law-firm-logo.png';
import RelatedBlogSection from './RelatedBlogSection';

function BlogDetail() {
  const { id } = useParams();

  const mockBlog = {
    id,
    title: 'Handling Contract Disputes: A Practical Guide',
    author: 'Attorney A',
    date: '2025-07-30',
    content: `
      When facing contract disputes, it is important to review the original contract terms carefully.
      Parties should collect all relevant documents and correspondence that may serve as evidence.
      Seeking mediation or arbitration before litigation is often a cost-effective step.
    `,
    keyPoints: [
      'Review the contract terms in detail',
      'Collect evidence and correspondence',
      'Seek mediation before going to court',
      'Consult a legal professional early',
    ],
  };

  return (
    <div>
      <section aria-label="Blog detail" className="py-12">
        <div className="mx-auto max-w-3xl px-4">
          {/* Breadcrumb */}
          <nav className="mb-4 text-sm text-gray-600">
            <Link to="/resources/blogs" className="text-blue-600 hover:underline">
              Blogs
            </Link>
            <span className="mx-2">/</span>
            <span>Blog detail</span>
          </nav>

          {/* Header */}
          <header className="mb-6">
            <h1 className="text-3xl font-bold">{mockBlog.title}</h1>
            <p className="mt-2 text-gray-600">
              By {mockBlog.author} ·{' '}
              <time dateTime={mockBlog.date}>{new Date(mockBlog.date).toLocaleDateString()}</time>
            </p>
          </header>

          {/* Image */}
          <img
            src={lawImage}
            alt="Blog illustration"
            className="mb-6 h-56 w-full rounded object-contain bg-gray-50"
          />

          {/* Content */}
          <article className="prose max-w-none">
            <h2 className="text-xl font-semibold">Overview</h2>
            <p>{mockBlog.content}</p>

            <h3 className="mt-6 text-lg font-semibold">Key points</h3>
            <ul className="list-disc pl-5">
              {mockBlog.keyPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      {/* Related Blogs */}
      <RelatedBlogSection />
    </div>
  );
}

export default BlogDetail;
