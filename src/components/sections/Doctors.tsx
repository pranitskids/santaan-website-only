"use client";

import { motion } from 'framer-motion';
import type { ElementType } from 'react';

const clinicalTeam = [
    {
        name: 'Dr. Deepika KN Padhi',
        role: 'Clinical Director',
        scope: 'Centre Head · Berhampur',
        image: 'https://static.wixstatic.com/media/fd2a61_589f6721d1af451d907bc74cd23fef5e~mv2.jpeg/v1/crop/x_428,y_135,w_1041,h_1942/fill/w_227,h_427,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/B22ADF58-293A-42C2-9AA8-534D93464369.jpeg',
    },
    {
        name: 'Dr. Kaninika Panda',
        role: 'Head, Santaan Academy & Quality',
        scope: 'Centre Head · Bhubaneswar',
        image: 'https://static.wixstatic.com/media/fd2a61_55ca1c808b8a44a58099994d3cf32e00~mv2.jpg/v1/crop/x_412,y_0,w_456,h_850/fill/w_227,h_427,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG-20210726-WA0028.jpg',
    },
];

const leadershipTeam = [
    {
        name: 'Dr. Satish',
        role: 'Founder & Head of R&D',
        scope: 'Clinical Scientist & Fertility Technology',
        image: 'https://static.wixstatic.com/media/fd2a61_76a58758207f474c986ee0611950f9ac~mv2.jpg/v1/crop/x_90,y_0,w_224,h_418/fill/w_227,h_427,al_c,lg_1,q_80,enc_avif,quality_auto/SatishRath.jpg',
    },
    {
        name: 'Raghab',
        role: 'Champion of Growth Projects',
        scope: 'Femtech Accelerator & Incubator',
        image: 'https://static.wixstatic.com/media/fd2a61_67db601f16c0438bbe0e4706d718c15f~mv2.jpg/v1/crop/x_438,y_0,w_2195,h_4096/fill/w_227,h_427,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/raghab.jpg',
    },
];

interface DoctorsProps {
    headingAs?: Extract<ElementType, 'h1' | 'h2'>;
}

export function Doctors({ headingAs = 'h2' }: DoctorsProps) {
    const HeadingTag = headingAs;
    const GroupHeadingTag = headingAs === 'h1' ? 'h2' : 'h3';
    const ProfileHeadingTag = headingAs === 'h1' ? 'h3' : 'h4';

    return (
        <section id="doctors" className="bg-[#E6F0E6]/30 py-20 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mx-auto mb-12 max-w-3xl text-center md:mb-14">
                    <span className="text-sm font-medium uppercase tracking-[0.18em] text-santaan-teal">Our clinical team</span>
                    <HeadingTag className="mt-3 font-playfair text-3xl font-bold text-gray-900 md:text-4xl">
                        Meet Santaan&apos;s <span className="text-santaan-amber">Odisha doctors</span>
                    </HeadingTag>
                    <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-gray-600">
                        Fertility specialists leading evidence-driven consultations, clinical quality, and treatment planning
                        across Santaan&apos;s active Odisha centres.
                    </p>
                </div>

                <div className="mx-auto max-w-5xl">
                    <GroupHeadingTag className="sr-only">Fertility doctors</GroupHeadingTag>
                    <div className="grid gap-6 md:grid-cols-2">
                        {clinicalTeam.map((doctor, index) => (
                            <motion.article
                                key={doctor.name}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08, duration: 0.45 }}
                                className="group overflow-hidden rounded-3xl border border-santaan-sage/20 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="flex h-full flex-row">
                                    <div className="h-60 w-32 shrink-0 overflow-hidden bg-santaan-sage/15 sm:h-64 sm:w-40 lg:w-44">
                                        <img
                                            src={doctor.image}
                                            alt={doctor.name}
                                            loading="lazy"
                                            decoding="async"
                                            className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                                        />
                                    </div>
                                    <div className="flex min-w-0 flex-1 flex-col justify-center p-5 text-left sm:p-7">
                                        <ProfileHeadingTag className="font-playfair text-xl font-bold leading-tight text-gray-900 sm:text-2xl">
                                            {doctor.name}
                                        </ProfileHeadingTag>
                                        <p className="mt-3 font-semibold leading-snug text-santaan-teal">{doctor.role}</p>
                                        <p className="mt-2 text-sm text-gray-500">{doctor.scope}</p>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>

                    <div className="mt-10 overflow-hidden rounded-[2rem] bg-santaan-dark-teal p-6 shadow-xl sm:p-8 lg:p-10">
                        <div className="max-w-2xl">
                            <GroupHeadingTag className="font-playfair text-2xl font-bold text-white md:text-3xl">
                                Leadership, research &amp; growth
                            </GroupHeadingTag>
                            <p className="mt-3 leading-relaxed text-white/70">
                                Building Santaan&apos;s research direction, fertility technology, growth projects, and Femtech ecosystem.
                            </p>
                        </div>

                        <div className="mt-7 grid gap-4 md:grid-cols-2">
                            {leadershipTeam.map((member, index) => (
                                <motion.article
                                    key={member.name}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.08 + index * 0.08, duration: 0.45 }}
                                    className="flex items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.07] p-4 transition hover:border-santaan-amber/35 hover:bg-white/10 sm:p-5"
                                >
                                    <div className="h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-white/10 shadow-lg">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            loading="lazy"
                                            decoding="async"
                                            className="h-full w-full object-cover object-[center_18%]"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <ProfileHeadingTag className="font-playfair text-xl font-bold text-white">
                                            {member.name}
                                        </ProfileHeadingTag>
                                        <p className="mt-2 font-semibold leading-snug text-santaan-amber">{member.role}</p>
                                        <p className="mt-2 text-sm leading-relaxed text-white/65">{member.scope}</p>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
