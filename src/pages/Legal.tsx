import type { ReactNode } from 'react';
import { BUY_URL, SUPPORT_EMAIL } from '../lib/config';
import { useAuth } from '../lib/auth';
import { PageHead, Panel } from '../components/ui';

const UPDATED = '14 October 2026';

function Contact() {
  if (SUPPORT_EMAIL) return <>email <span className="select-all font-semibold">{SUPPORT_EMAIL}</span></>;
  if (BUY_URL) return <>message us through the <a href={BUY_URL} target="_blank" rel="noreferrer">Gumroad product page</a></>;
  return <>contact us through the page where you bought the app</>;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <Panel title={title}><div className="prose-cat grid gap-2 text-[0.97rem]">{children}</div></Panel>;
}

export default function Legal({ which }: { which: 'privacy' | 'terms' | 'refunds' }) {
  const { enabled } = useAuth();
  if (which === 'privacy') return (
    <div className="grid gap-4">
      <PageHead eyebrow={`Last updated ${UPDATED}`} title="Privacy" />
      <Section title="What we keep">
        <p>Your study progress: attempts, notes, bookmarks, confidence ratings, the error log, plan ticks, test results and mock logs, plus your start date and target percentile.</p>
        {enabled
          ? <p>If you create an account we also keep your email address. Your password is handled by our sign-in provider (Supabase) and stored only as a hash; we never see it.</p>
          : <p>This copy of the app has no accounts: everything stays in your browser’s storage on this device.</p>}
      </Section>
      <Section title="Why, and where">
        <p>Only to run the app: to save your progress and, with an account, to show the same progress on every device where you sign in. We don’t sell your data, show ads, or use tracking cookies.</p>
        {enabled && <p>Account data is stored with Supabase, our database provider. A copy of your progress is also kept in your browser so the app works offline.</p>}
        <p>Payments are handled by Gumroad. We never see your card details; Gumroad shares your email and purchase so we can give you access.</p>
      </Section>
      <Section title="Your rights">
        <p>You can export your progress at any time from Your data, and erase it there. To see, correct or delete everything we hold about you, including your account, <Contact />. We’ll respond within 30 days.</p>
        <p>We follow India’s Digital Personal Data Protection Act, 2023. The app is meant for adults preparing for the CAT.</p>
      </Section>
    </div>
  );
  if (which === 'terms') return (
    <div className="grid gap-4">
      <PageHead eyebrow={`Last updated ${UPDATED}`} title="Terms of use" />
      <Section title="Your licence">
        <p>Buying CAT Sprint gives you a personal licence to use it for your own preparation. Please don’t share your account, license key, or the app’s questions and content, or resell them. Accounts or keys that are shared may be disabled.</p>
      </Section>
      <Section title="The content">
        <p>All questions, passages and data sets were written for this app; no CAT question is reproduced. Exam facts and paper trends come from public sources, cited on the Sources page, and may change; the official CAT website always takes precedence.</p>
        <p>CAT Sprint is not affiliated with the Indian Institutes of Management or the Common Admission Test.</p>
      </Section>
      <Section title="No guarantees">
        <p>The app helps you practise and plan. It can’t guarantee a score, percentile or admission, and percentile figures in the app are estimates. To the extent the law allows, our liability is limited to what you paid for the app.</p>
      </Section>
      <Section title="Changes and contact">
        <p>We may update the app and these terms; we’ll show the date of the latest version here. These terms are governed by the laws of India. For questions, <Contact />.</p>
      </Section>
    </div>
  );
  return (
    <div className="grid gap-4">
      <PageHead eyebrow={`Last updated ${UPDATED}`} title="Refunds" />
      <Section title="7-day refund">
        <p>If CAT Sprint isn’t right for you, ask for a refund within 7 days of buying and you’ll get your money back in full, no questions asked.</p>
        <p>Request it from your Gumroad receipt, or <Contact />. Refunds go back to your original payment method through Gumroad.</p>
        <p>A refunded purchase no longer unlocks the app. Your progress stays in your account, and the free sample stays available.</p>
      </Section>
    </div>
  );
}
