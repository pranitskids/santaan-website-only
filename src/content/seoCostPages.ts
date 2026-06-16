export interface SeoCostRow {
  item: string;
  range: string;
  note: string;
}

export interface SeoCostFaq {
  question: string;
  answer: string;
}

export interface SeoCostPageData {
  slug: string;
  title: string;
  description: string;
  h1: string;
  kicker: string;
  intro: string;
  primaryKeyword: string;
  planningRange: string;
  quickAnswer: string;
  rows: SeoCostRow[];
  factors: string[];
  sections: Array<{
    heading: string;
    body: string;
  }>;
  faqs: SeoCostFaq[];
  related: Array<{
    href: string;
    label: string;
    description: string;
  }>;
}

const sharedRelated = [
  {
    href: '/pricing',
    label: 'Full pricing and EMI guide',
    description: 'See indicative ranges for IVF, IUI, ICSI, PGT, egg freezing and financing.',
  },
  {
    href: '/know-your-score',
    label: 'Know your fertility score',
    description: 'Use the readiness check before comparing treatment costs blindly.',
  },
  {
    href: '/contact-centres',
    label: 'Talk to Santaan privately',
    description: 'Get a written next-step plan after specialist review.',
  },
];

export const seoCostPages: Record<string, SeoCostPageData> = {
  'ivf-cost-in-india-2026': {
    slug: 'ivf-cost-in-india-2026',
    title: 'IVF Cost in India 2026',
    description:
      'Understand IVF cost in India in 2026, including treatment range, medicines, ICSI, PGT, freezing, EMI options and what to ask before choosing a clinic.',
    h1: 'IVF Cost in India 2026',
    kicker: 'Transparent IVF Cost Guide',
    intro:
      'IVF cost in India is not one fixed sticker price. The right number depends on diagnosis, stimulation medicines, lab steps, embryo strategy, and whether add-ons such as ICSI, PGT or freezing are medically needed.',
    primaryKeyword: 'IVF cost India 2026',
    planningRange: '₹1,20,000–₹2,50,000+ per IVF cycle before complex add-ons',
    quickAnswer:
      'In 2026, many IVF cycles in India are planned in the ₹1.2 lakh to ₹2.5 lakh range before advanced add-ons. A realistic estimate should separate consultation, tests, medicines, egg retrieval, embryology, transfer, freezing, and optional procedures.',
    rows: [
      { item: 'Basic IVF cycle', range: '₹1,20,000–₹2,50,000+', note: 'Varies by clinic, city, stimulation plan and lab inclusions.' },
      { item: 'Medicines and stimulation', range: 'Variable', note: 'Often changes with age, ovarian reserve, BMI and response.' },
      { item: 'ICSI add-on', range: '₹25,000–₹55,000+', note: 'Used when male-factor or fertilization concerns make it clinically useful.' },
      { item: 'PGT embryo testing', range: '₹1,00,000–₹2,50,000+', note: 'Usually separate from base IVF and depends on embryos tested.' },
      { item: 'Freezing and storage', range: '₹35,000–₹1,00,000+', note: 'Depends on storage duration and embryo/egg plan.' },
    ],
    factors: [
      'Female age, AMH, AFC and ovarian response',
      'Semen parameters and whether ICSI is required',
      'Number of scans, medicines and monitoring visits',
      'Blastocyst culture, freezing, storage or PGT decisions',
      'Whether the quote is per started cycle, retrieval or transfer',
    ],
    sections: [
      {
        heading: 'Why IVF cost varies so much',
        body:
          'Two couples can both be advised IVF but need very different protocols. One may need a straightforward stimulation and transfer, while another may need higher medicine doses, ICSI, embryo freezing, PGT, or additional workup before transfer.',
      },
      {
        heading: 'How to compare clinics safely',
        body:
          'Do not compare only the lowest advertised number. Ask for a written estimate that lists inclusions, exclusions, medicine assumptions, cancellation rules, freezing costs, and what happens if the first cycle does not produce a transferable embryo.',
      },
      {
        heading: 'How Santaan frames cost conversations',
        body:
          'Santaan uses diagnosis-first planning so the cost discussion follows the medical pathway. The goal is to reduce surprise add-ons and help couples understand which steps are necessary, optional, or not relevant for their case.',
      },
    ],
    faqs: [
      {
        question: 'What is the average IVF cost in India in 2026?',
        answer:
          'A practical planning range is often ₹1.2 lakh to ₹2.5 lakh or more per IVF cycle before complex add-ons. The final cost changes with medicines, lab steps, embryo strategy and clinic-specific inclusions.',
      },
      {
        question: 'Is the cheapest IVF package the best option?',
        answer:
          'Not always. A low headline price may exclude medicines, scans, anesthesia, lab steps, freezing or transfer-related charges. Compare written inclusions rather than only the advertised number.',
      },
      {
        question: 'Can EMI reduce the upfront burden?',
        answer:
          'EMI or financing may be available depending on partner policies, eligibility and documentation. Patients should confirm tenure, downpayment, processing fees and whether the EMI covers medicines or only procedure costs.',
      },
    ],
    related: sharedRelated,
  },
  'ivf-cost-bhubaneswar': {
    slug: 'ivf-cost-bhubaneswar',
    title: 'IVF Cost in Bhubaneswar',
    description:
      'Plan IVF cost in Bhubaneswar with Santaan. Learn treatment ranges, inclusions, add-ons, EMI planning and how to compare written IVF estimates.',
    h1: 'IVF Cost in Bhubaneswar',
    kicker: 'Bhubaneswar Cost Planning',
    intro:
      'For couples in Bhubaneswar, IVF cost should be understood as a treatment plan, not a single procedure bill. A clear estimate should include diagnostics, medicines, retrieval, embryology, transfer and likely add-ons.',
    primaryKeyword: 'IVF cost Bhubaneswar',
    planningRange: '₹1,20,000–₹2,50,000+ depending on protocol and add-ons',
    quickAnswer:
      'IVF cost in Bhubaneswar commonly depends on ovarian reserve, semen factors, medicines, laboratory steps and whether ICSI, PGT or freezing is required. Ask for a written estimate before starting stimulation.',
    rows: [
      { item: 'Consultation and plan review', range: '₹800–₹1,500*', note: 'Report review and first treatment direction.' },
      { item: 'IVF pathway', range: '₹1,20,000–₹2,50,000+', note: 'Depends on stimulation, retrieval, lab and transfer inclusions.' },
      { item: 'ICSI if needed', range: '₹25,000–₹55,000+', note: 'Usually added for male-factor or fertilization concerns.' },
      { item: 'PGT if advised', range: '₹1,00,000–₹2,50,000+', note: 'Case-specific and not needed for every couple.' },
    ],
    factors: [
      'Age, AMH, AFC and ovarian response',
      'Male-factor findings and ICSI need',
      'Medicine dose and monitoring schedule',
      'Freezing, blastocyst culture or genetic testing',
      'Whether follow-up and transfer are included',
    ],
    sections: [
      {
        heading: 'Local clarity matters',
        body:
          'Bhubaneswar patients often compare multiple clinics quickly. The safest comparison is not the lowest quote; it is the clearest written plan with medical rationale, likely exclusions and next-step milestones.',
      },
      {
        heading: 'What Santaan reviews before cost finalization',
        body:
          'Our team reviews both partners, including ovarian reserve, hormone trends, ultrasound findings, semen analysis and prior attempt history. That keeps the price discussion tied to the actual treatment path.',
      },
    ],
    faqs: [
      {
        question: 'Does IVF cost in Bhubaneswar include medicines?',
        answer:
          'It depends on the quote. Medicines are often a major variable, so patients should ask whether injections, scans, anesthesia, retrieval, lab and transfer are included.',
      },
      {
        question: 'Can I get EMI for IVF in Bhubaneswar?',
        answer:
          'EMI may be available through partner financing subject to eligibility. The exact terms should be confirmed before treatment starts.',
      },
      {
        question: 'Should I start with IVF immediately?',
        answer:
          'Not always. The right next step depends on age, duration of trying, tubes, semen findings, AMH and prior treatment history.',
      },
    ],
    related: [
      { href: '/ivf-clinic-bhubaneswar', label: 'IVF centre in Bhubaneswar', description: 'See the Bhubaneswar centre page and care pathway.' },
      ...sharedRelated,
    ],
  },
  'ivf-cost-berhampur': {
    slug: 'ivf-cost-berhampur',
    title: 'IVF Cost in Berhampur',
    description:
      'Understand IVF cost in Berhampur, including cycle planning, medicines, ICSI, freezing, EMI options and how Santaan keeps estimates transparent.',
    h1: 'IVF Cost in Berhampur',
    kicker: 'Berhampur Cost Planning',
    intro:
      'IVF planning in Berhampur should help couples reduce travel, confusion and surprise billing. The right estimate explains what is included and what may change after stimulation begins.',
    primaryKeyword: 'IVF cost Berhampur',
    planningRange: '₹1,20,000–₹2,50,000+ depending on diagnosis and lab needs',
    quickAnswer:
      'IVF cost in Berhampur depends on medicines, monitoring, egg retrieval, embryology, transfer and add-ons such as ICSI or freezing. A written plan is the safest way to compare options.',
    rows: [
      { item: 'Initial plan review', range: '₹800–₹1,500*', note: 'Consultation and report review.' },
      { item: 'IVF cycle planning', range: '₹1,20,000–₹2,50,000+', note: 'Protocol-specific range before complex add-ons.' },
      { item: 'ICSI if clinically needed', range: '₹25,000–₹55,000+', note: 'Added when sperm or fertilization factors require it.' },
      { item: 'Freezing/storage', range: '₹35,000–₹1,00,000+', note: 'Depends on duration and embryo/egg plan.' },
    ],
    factors: [
      'Stimulation medicine dose and response',
      'Need for ICSI or advanced embryology steps',
      'Embryo freezing and storage duration',
      'Number of visits and monitoring scans',
      'Prior IUI/IVF history and diagnosis complexity',
    ],
    sections: [
      {
        heading: 'Why written estimates help Berhampur families',
        body:
          'Couples should not have to travel or commit before they understand the likely cost pathway. A written estimate helps families plan the cycle, financing and time away from work with fewer surprises.',
      },
      {
        heading: 'Santaan’s cost-first clarity',
        body:
          'The Berhampur pathway connects cost counseling with the medical plan, so couples understand why a step is recommended and whether it is essential, optional or avoidable.',
      },
    ],
    faqs: [
      {
        question: 'Is IVF cheaper in Berhampur than metro cities?',
        answer:
          'Local access may reduce travel and stay costs, but medical pricing still depends on protocol, medicines and lab needs. Compare total journey cost, not only procedure cost.',
      },
      {
        question: 'Do I need ICSI with every IVF cycle?',
        answer:
          'No. ICSI is recommended based on sperm findings, fertilization risk or prior cycle history. It should be medically justified.',
      },
      {
        question: 'Can Santaan provide a written IVF estimate?',
        answer:
          'Yes. A specialist review helps create a clearer estimate based on reports, diagnosis and likely treatment path.',
      },
    ],
    related: [
      { href: '/ivf-clinic-berhampur', label: 'IVF centre in Berhampur', description: 'Explore the Berhampur centre and patient pathway.' },
      ...sharedRelated,
    ],
  },
  'ivf-cost-bangalore': {
    slug: 'ivf-cost-bangalore',
    title: 'IVF Cost in Bangalore',
    description:
      'Compare IVF cost in Bangalore with Santaan AECS Layout. Learn price ranges, medicines, ICSI, PGT, freezing and practical cost questions before treatment.',
    h1: 'IVF Cost in Bangalore',
    kicker: 'Bangalore Cost Planning',
    intro:
      'In Bangalore, IVF costs can vary widely across clinics because of lab inclusions, doctor model, medicines, ICSI, PGT and freezing decisions. A useful estimate should be transparent enough to compare.',
    primaryKeyword: 'IVF cost Bangalore',
    planningRange: '₹1,50,000–₹3,00,000+ depending on city, protocol and add-ons',
    quickAnswer:
      'IVF cost in Bangalore can move higher than smaller cities because of city overheads, lab model and add-on choices. Patients should compare written inclusions, not only advertised package price.',
    rows: [
      { item: 'IVF cycle planning', range: '₹1,50,000–₹3,00,000+', note: 'City and clinic model can influence the range.' },
      { item: 'ICSI add-on', range: '₹25,000–₹55,000+', note: 'Often separate from base IVF.' },
      { item: 'PGT embryo testing', range: '₹1,00,000–₹2,50,000+', note: 'Usually embryo-count dependent.' },
      { item: 'Freezing/storage', range: '₹35,000–₹1,00,000+', note: 'Ask duration and renewal policy.' },
    ],
    factors: [
      'Clinic location and lab model',
      'Doctor availability and monitoring plan',
      'Medicine dose and response',
      'ICSI, PGT, freezing or donor pathway',
      'Whether virtual follow-up reduces visit burden',
    ],
    sections: [
      {
        heading: 'Why Bangalore estimates need careful comparison',
        body:
          'Bangalore patients often see a wide spread of quotes. The important question is whether the estimate covers the complete cycle pathway or only part of the treatment journey.',
      },
      {
        heading: 'Santaan AECS Layout approach',
        body:
          'Santaan’s Bangalore pathway is designed for busy professionals who need clear milestones, discreet communication and practical treatment planning without unnecessary add-ons.',
      },
    ],
    faqs: [
      {
        question: 'Why does IVF cost more in some Bangalore clinics?',
        answer:
          'Costs can rise because of clinic overheads, imported consumables, lab model, add-ons, medicine dose and how the package defines a cycle.',
      },
      {
        question: 'Should I compare IVF packages or full treatment plans?',
        answer:
          'Compare full treatment plans. A package may not include medicines, freezing, ICSI, PGT, anesthesia or repeat transfer-related costs.',
      },
      {
        question: 'Can I reduce visits with virtual follow-up?',
        answer:
          'Some follow-up steps can be coordinated remotely, but scans, procedures and key monitoring steps require in-person care.',
      },
    ],
    related: [
      { href: '/ivf-clinic-bangalore-aecs-layout', label: 'IVF centre in AECS Layout', description: 'Explore Santaan Bangalore and its care pathway.' },
      ...sharedRelated,
    ],
  },
  'iui-cost': {
    slug: 'iui-cost',
    title: 'IUI Cost in India',
    description:
      'Understand IUI cost in India, what is included, when IUI is worth trying, and when couples should move to IVF instead of repeating failed cycles.',
    h1: 'IUI Cost in India',
    kicker: 'First-Step Treatment Cost',
    intro:
      'IUI is often a lower-cost first treatment, but it works only for selected cases. The real decision is not just cost per cycle; it is whether repeated IUI attempts are medically sensible for your timeline.',
    primaryKeyword: 'IUI cost India',
    planningRange: '₹10,000–₹20,000+ per cycle before medicines and extra monitoring',
    quickAnswer:
      'IUI cost in India is often planned around ₹10,000 to ₹20,000 per cycle, with medicines, scans and trigger injections varying by patient. It is best suited when tubes are open, sperm parameters are acceptable and age/timeline allow it.',
    rows: [
      { item: 'IUI procedure cycle', range: '₹10,000–₹20,000+', note: 'Usually excludes some medicines and monitoring variables.' },
      { item: 'Ovulation medicines', range: 'Variable', note: 'Depends on oral medication or injections.' },
      { item: 'Monitoring scans', range: 'Variable', note: 'Needed to time ovulation accurately.' },
      { item: 'Semen preparation', range: 'Clinic-specific', note: 'Ask if included in the IUI quote.' },
    ],
    factors: [
      'Whether ovulation induction is oral or injectable',
      'Number of scans required before procedure',
      'Semen preparation method',
      'Age, duration of infertility and tube status',
      'How many attempts are medically reasonable',
    ],
    sections: [
      {
        heading: 'When IUI is sensible',
        body:
          'IUI may be useful for selected couples with open tubes, mild ovulation issues, mild male-factor concerns or unexplained infertility where age and duration still support a lower-intervention approach.',
      },
      {
        heading: 'When repeated IUI becomes costly',
        body:
          'A low per-cycle cost can become expensive if repeated without improving the odds. After failed attempts, couples should reassess diagnosis, age, semen factors and whether IVF offers a better chance per month.',
      },
    ],
    faqs: [
      {
        question: 'How much does IUI cost in India?',
        answer:
          'A common planning range is ₹10,000 to ₹20,000 or more per cycle, with medicines, scans and clinic-specific inclusions changing the final amount.',
      },
      {
        question: 'How many IUI cycles should I try?',
        answer:
          'This depends on age, diagnosis and prior attempts. Many couples reassess after two to three failed cycles rather than continuing indefinitely.',
      },
      {
        question: 'Is IUI always cheaper than IVF?',
        answer:
          'Per cycle, IUI is usually cheaper. But repeated low-probability IUI cycles can delay treatment and increase total emotional and financial cost.',
      },
    ],
    related: sharedRelated,
  },
  'icsi-cost': {
    slug: 'icsi-cost',
    title: 'ICSI Cost in India',
    description:
      'Learn ICSI cost in India, when ICSI is recommended with IVF, what changes the final cost and how to ask for transparent lab inclusions.',
    h1: 'ICSI Cost in India',
    kicker: 'Advanced Lab Add-on Cost',
    intro:
      'ICSI is usually an add-on to IVF where one sperm is injected into one mature egg. It can be valuable for male-factor infertility, prior fertilization failure or selected clinical scenarios, but it should be medically justified.',
    primaryKeyword: 'ICSI cost India',
    planningRange: '₹25,000–₹55,000+ as an IVF add-on',
    quickAnswer:
      'ICSI cost in India is commonly quoted as an IVF add-on in the ₹25,000 to ₹55,000+ range. The complete IVF+ICSI journey also includes stimulation, retrieval, embryology, transfer, medicines and any freezing or testing.',
    rows: [
      { item: 'ICSI lab add-on', range: '₹25,000–₹55,000+', note: 'Usually separate from base IVF pricing.' },
      { item: 'IVF base pathway', range: '₹1,20,000–₹2,50,000+', note: 'Required because ICSI happens within an IVF cycle.' },
      { item: 'Sperm retrieval if needed', range: 'Case-specific', note: 'TESA/PESA or surgical retrieval may add cost.' },
      { item: 'Embryo freezing', range: '₹35,000–₹1,00,000+', note: 'Depends on embryo plan and storage duration.' },
    ],
    factors: [
      'Semen count, motility, morphology and DNA concerns',
      'Prior fertilization failure',
      'Need for surgical sperm retrieval',
      'Embryology lab method and consumables',
      'Whether blastocyst culture or freezing is added',
    ],
    sections: [
      {
        heading: 'When ICSI may be recommended',
        body:
          'ICSI is commonly considered for significant male-factor infertility, very low sperm count, poor motility, surgically retrieved sperm, previous fertilization failure or selected cases where fertilization risk is high.',
      },
      {
        heading: 'What to ask the clinic',
        body:
          'Ask whether ICSI is included in the IVF quote, whether it is being recommended for a specific reason, and whether additional sperm retrieval, freezing or embryo culture charges may apply.',
      },
    ],
    faqs: [
      {
        question: 'Is ICSI included in IVF cost?',
        answer:
          'Often it is separate, but packages vary. Patients should ask clearly whether IVF pricing includes ICSI or whether it is billed as an add-on.',
      },
      {
        question: 'Does every IVF cycle need ICSI?',
        answer:
          'No. ICSI should be based on sperm factors, fertilization risk or prior cycle history. It is not automatically needed for every couple.',
      },
      {
        question: 'Can ICSI improve success rates?',
        answer:
          'ICSI can improve fertilization in selected cases, especially male-factor infertility, but it does not remove all age, egg quality, embryo or uterine factors.',
      },
    ],
    related: sharedRelated,
  },
  'egg-freezing-cost': {
    slug: 'egg-freezing-cost',
    title: 'Egg Freezing Cost in India',
    description:
      'Understand egg freezing cost in India, including stimulation, retrieval, vitrification, storage, renewal fees and when fertility preservation is worth considering.',
    h1: 'Egg Freezing Cost in India',
    kicker: 'Fertility Preservation Cost',
    intro:
      'Egg freezing cost should include more than retrieval day. A realistic plan covers ovarian stimulation, monitoring, egg retrieval, vitrification, storage duration and future thaw/IVF considerations.',
    primaryKeyword: 'egg freezing cost India',
    planningRange: '₹1,10,000–₹2,40,000+ for cycle planning, plus storage policy',
    quickAnswer:
      'Egg freezing cost in India is often planned around ₹1.1 lakh to ₹2.4 lakh or more for the cycle, with storage fees varying by duration. Future thawing, fertilization and transfer are usually separate.',
    rows: [
      { item: 'Egg freezing cycle', range: '₹1,10,000–₹2,40,000+', note: 'Includes stimulation, retrieval and vitrification depending on package.' },
      { item: 'Medicines and monitoring', range: 'Variable', note: 'Depends on ovarian reserve and response.' },
      { item: 'Storage and renewal', range: '₹35,000–₹1,00,000+', note: 'Ask storage duration and renewal charges.' },
      { item: 'Future thaw/IVF use', range: 'Separate', note: 'Usually not included in the freezing cycle quote.' },
    ],
    factors: [
      'Age and ovarian reserve at freezing',
      'Medicine dose and number of monitoring visits',
      'Number of eggs retrieved and frozen',
      'Storage duration and renewal rules',
      'Future thaw, ICSI and embryo transfer costs',
    ],
    sections: [
      {
        heading: 'Best value comes from timing',
        body:
          'Egg freezing is most useful when done before egg quality declines sharply. Cost should be judged alongside age, AMH, AFC and the number of mature eggs likely to be frozen.',
      },
      {
        heading: 'What the quote should clarify',
        body:
          'Ask whether medicines, scans, anesthesia, retrieval, vitrification and first-year storage are included. Also ask what future thawing, ICSI and embryo transfer may cost.',
      },
    ],
    faqs: [
      {
        question: 'What is the cost of egg freezing in India?',
        answer:
          'A practical range is often ₹1.1 lakh to ₹2.4 lakh or more for one cycle, with medicines and storage policies changing the final amount.',
      },
      {
        question: 'Is storage included in egg freezing cost?',
        answer:
          'Sometimes only a limited storage period is included. Always confirm duration, renewal charges and what happens if storage is extended.',
      },
      {
        question: 'Does egg freezing guarantee pregnancy later?',
        answer:
          'No. Egg freezing preserves an opportunity, not a guarantee. Future success depends on age at freezing, number and quality of eggs, thaw survival, fertilization and embryo factors.',
      },
    ],
    related: sharedRelated,
  },
};

export const seoCostPageSlugs = Object.keys(seoCostPages);

export function getSeoCostPageBySlug(slug: string) {
  return seoCostPages[slug] ?? null;
}
