import Link from 'next/link';

interface CostGuideLinksProps {
  title?: string;
  description?: string;
  tags?: string[];
  articleTitle?: string;
}

const defaultGuides = [
  {
    href: '/ivf-cost-in-india-2026',
    label: 'IVF cost in India 2026',
    description: 'Understand cycle cost, medicines, lab add-ons and EMI planning.',
    match: ['ivf', 'fertility treatment', 'failed iui', 'embryo'],
  },
  {
    href: '/iui-cost',
    label: 'IUI cost in India',
    description: 'Know when IUI is a sensible first step and when to reassess.',
    match: ['iui', 'failed iui', 'unexplained'],
  },
  {
    href: '/icsi-cost',
    label: 'ICSI cost in India',
    description: 'See when ICSI is medically useful and how it affects IVF cost.',
    match: ['icsi', 'male', 'sperm', 'azoospermia'],
  },
  {
    href: '/egg-freezing-cost',
    label: 'Egg freezing cost in India',
    description: 'Plan freezing, storage and future-use cost realistically.',
    match: ['egg freezing', 'fertility preservation', 'amh', 'ovarian reserve'],
  },
  {
    href: '/ivf-cost-bhubaneswar',
    label: 'IVF cost in Bhubaneswar',
    description: 'Local IVF planning for Bhubaneswar and nearby Odisha families.',
    match: ['bhubaneswar', 'odisha'],
  },
  {
    href: '/ivf-cost-berhampur',
    label: 'IVF cost in Berhampur',
    description: 'Transparent cost planning for South Odisha couples.',
    match: ['berhampur', 'ganjam', 'south odisha'],
  },
  {
    href: '/ivf-cost-bangalore',
    label: 'IVF cost in Bangalore',
    description: 'Compare Bangalore IVF estimates, ICSI, PGT and freezing costs.',
    match: ['bangalore', 'bengaluru', 'aecs'],
  },
];

function selectGuides(tags: string[] = [], articleTitle = '') {
  const signal = `${articleTitle} ${tags.join(' ')}`.toLowerCase();
  const matched = defaultGuides.filter((guide) => guide.match.some((keyword) => signal.includes(keyword)));
  const merged = [...matched, ...defaultGuides];
  const unique = new Map(merged.map((guide) => [guide.href, guide]));

  return Array.from(unique.values()).slice(0, 4);
}

export function CostGuideLinks({
  title = 'Planning treatment cost too?',
  description = 'These cost guides help you compare the financial side of treatment without losing sight of the medical plan.',
  tags = [],
  articleTitle = '',
}: CostGuideLinksProps) {
  const guides = selectGuides(tags, articleTitle);

  return (
    <div className="mt-10 rounded-2xl border border-gray-100 bg-white p-6 md:p-8">
      <h3 className="text-xl font-playfair font-bold text-santaan-teal">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {guides.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="rounded-xl border border-santaan-sage/30 bg-santaan-cream/40 p-4 hover:bg-white transition-colors"
          >
            <h4 className="font-semibold text-gray-900">{guide.label}</h4>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">{guide.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
