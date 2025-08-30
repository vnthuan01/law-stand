import { useParams, Link } from 'react-router-dom';
import lawImage from '@/assets/law-firm-logo.png';
import RelatedLawSection from './RelatedLawSection';

function ResourceDetail() {
  const { id } = useParams();

  return (
    <div>
      <section aria-label="Law detail" className="py-12">
        <div className="mx-auto max-w-3xl px-4">
          <nav className="mb-4 text-sm text-gray-600">
            <Link to="/resources" className="text-blue-600 hover:underline">
              Resources
            </Link>
            <span className="mx-2">/</span>
            <span>Law detail</span>
          </nav>

          <header className="mb-6">
            <h1 className="text-3xl font-bold">Law detail #{id}</h1>
            <p className="mt-2 text-gray-600">Published on {new Date().toLocaleDateString()}</p>
          </header>

          <img
            src={lawImage}
            alt="Law illustration"
            className="mb-6 h-56 w-full rounded object-contain bg-gray-50"
          />

          <article className="prose max-w-none">
            <h2 className="text-xl font-semibold">Overview</h2>
            <p>
              This page provides details about the selected law, including context, scope,
              penalties, and related references. Replace this placeholder with real content once
              available.
            </p>
            <h3 className="mt-6 text-lg font-semibold">Key points</h3>
            <ul className="list-disc pl-5">
              <li>Applicability and scope</li>
              <li>Definitions and terminology</li>
              <li>Compliance requirements</li>
              <li>Penalties for violations</li>
            </ul>
          </article>
        </div>
      </section>
      {/* Related section */}
      <RelatedLawSection />
    </div>
  );
}

export default ResourceDetail;
