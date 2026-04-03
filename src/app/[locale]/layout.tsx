import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';
import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import '../globals.css';

const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ['latin', 'arabic'],
});

export const metadata: Metadata = {
  title: 'أبو الخطاب للعطور - Abu Alkhattab Perfumes',
  description: 'عطور من وحي الجنوب منذ أكثر من 15 عامًا - Perfumes inspired by the South for over 15 years',
};

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default async function LocaleLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  }
) {
  const { children } = props;
  const params = await props.params;

  const {
    locale
  } = params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <div className={`${cairo.variable} ${cairo.className} min-h-screen bg-black`}>
      <NextIntlClientProvider messages={messages}>
        <Navbar />
        {children}
        <Footer />
      </NextIntlClientProvider>
    </div>
  );
}
