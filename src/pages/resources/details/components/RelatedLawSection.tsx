import lawImage from '@/assets/law-firm-logo.png';

interface RelatedItem {
  id: string;
  title: string;
  href: string;
}

const relatedItems: RelatedItem[] = [
  { id: 'r1', title: 'Handling alcohol violation penalties', href: '#' },
  { id: 'r2', title: 'Mutual consent divorce procedures', href: '#' },
  { id: 'r3', title: 'Employment contracts: essentials', href: '#' },
];

function RelatedLawSection() {
  return (
    <section aria-label="Related topics" className="py-12">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-4 text-2xl font-bold tracking-tight">Related</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {relatedItems.map((item) => (
            <li key={item.id} className="rounded-lg border bg-white p-4 shadow-sm">
              <img
                src={lawImage}
                alt="Illustration for related law"
                className="mb-3 h-32 w-full rounded object-contain bg-gray-50"
              />
              <a
                href={item.href}
                className="text-sm font-medium text-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-label={`Go to: ${item.title}`}
                tabIndex={0}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default RelatedLawSection;
