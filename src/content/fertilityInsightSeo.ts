interface FertilityInsightSeoOverride {
  title: string;
  description: string;
}

const fertilityInsightSeoOverrides: Record<string, FertilityInsightSeoOverride> = {
  'why-everything-is-normal-doesnt-mean-you-re-not-infertile': {
    title: 'Normal Fertility Tests but Still Not Pregnant? What to Check Next',
    description:
      'Normal fertility reports do not always explain delayed conception. Learn what a couple-based review may examine next and when to seek specialist guidance.',
  },
  'icsi-treatment-bhubaneswar-male-fertility': {
    title: 'ICSI Treatment in Bhubaneswar: When Male-Factor Fertility Care May Help',
    description:
      'Understand when ICSI may be considered for male-factor infertility, how it differs from standard IVF and what to discuss with a Bhubaneswar fertility specialist.',
  },
  'failed-iui-to-ivf-your-next-steps-in-bhubaneswar': {
    title: 'After Failed IUI: When to Consider IVF in Bhubaneswar',
    description:
      'Review what doctors assess after an unsuccessful IUI cycle and when another IUI or IVF may be considered in Bhubaneswar based on age, diagnosis and reports.',
  },
  'thin-endometrium-normal-reports-why-the-lining-forgets-to-receive': {
    title: 'Thin Endometrium With Normal Reports: Causes and Fertility Options',
    description:
      'Learn what a thin endometrial lining may mean when other fertility reports appear normal, how it is evaluated and which questions to ask at a consultation.',
  },
};

export function getFertilityInsightSeoOverride(slug: string) {
  return fertilityInsightSeoOverrides[slug] ?? null;
}
