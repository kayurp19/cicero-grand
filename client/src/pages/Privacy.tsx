import { PageHero } from '../components/PageHero';
import { useSeo } from '../hooks/useSeo';

export default function Privacy() {
  useSeo({
    title: 'Privacy Policy · The Cicero Grand',
    description:
      'How The Cicero Grand collects, uses, and protects your personal information. CCPA, GDPR, and US privacy law disclosures.',
    canonicalPath: '/privacy',
  });

  const lastUpdated = 'May 9, 2026';

  return (
    <>
      <PageHero
        eyebrow="Legal"
        image="/photos/exterior-1.jpg"
        title={<>Privacy <em className="italic font-light">Policy</em>.</>}
        intro={`Last updated: ${lastUpdated}. This policy describes how The Cicero Grand collects, uses, shares, and protects your information.`}
      />

      <section className="bg-background py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-5 lg:px-10 prose-content">
          <article className="space-y-10 text-base leading-relaxed">
            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">1. Who we are</h2>
              <p>
                The Cicero Grand ("we," "us," "our") operates the website cicerogrand.com
                and the hotel located at 5875 Carmenica Drive, Cicero, NY 13039. For privacy
                questions, contact{' '}
                <a href="mailto:sales@cicerogrand.com" className="underline">sales@cicerogrand.com</a>{' '}
                or call (315) 752-0150.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">2. Information we collect</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Reservation data:</strong> name, address, phone, email, payment information, stay dates, room preferences, special requests.</li>
                <li><strong>Contact form & inquiries:</strong> name, email, phone, and the message you send us.</li>
                <li><strong>Automatically collected:</strong> IP address, browser type, device information, pages viewed, and timestamps via standard server logs and cookies.</li>
                <li><strong>Marketing:</strong> if you opt in, your email and engagement with our newsletters.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">3. How we use your information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To process and manage your reservation and stay.</li>
                <li>To respond to inquiries, requests, and customer service issues.</li>
                <li>To improve our website, services, and guest experience.</li>
                <li>To send transactional communications (booking confirmations, receipts).</li>
                <li>With your consent, to send marketing emails. You can unsubscribe at any time.</li>
                <li>To comply with legal obligations (tax, lodging law, anti-fraud).</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">4. Cookies and tracking technologies</h2>
              <p>
                We use cookies and similar technologies for website functionality, analytics,
                and advertising. You can manage cookie preferences through the consent banner
                on our site or your browser settings. Categories of cookies:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Strictly necessary:</strong> required for the site to function (booking, security).</li>
                <li><strong>Analytics:</strong> Google Analytics or similar — measures site usage.</li>
                <li><strong>Advertising:</strong> Google Ads, Meta — measures campaign performance.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">5. How we share your information</h2>
              <p>We share information only as needed:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Service providers:</strong> property management system (Cloudbeds), payment processors, email service, hosting (Railway), and analytics. They are bound by confidentiality.</li>
                <li><strong>Legal requirements:</strong> if required by law, subpoena, or to protect our rights.</li>
                <li><strong>Business transfers:</strong> in the event of a sale or merger, your information may be transferred.</li>
              </ul>
              <p className="mt-3">
                <strong>We do not sell your personal information.</strong>
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">6. Your rights</h2>
              <p>
                Depending on where you live, you may have the right to access, correct,
                delete, or port your personal information; opt out of marketing; and
                non-discrimination for exercising these rights.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>California residents (CCPA/CPRA):</strong> right to know, delete, correct, and opt out of "sales" or "sharing" for cross-context behavioral advertising.</li>
                <li><strong>EEA / UK residents (GDPR):</strong> right to access, rectify, erase, restrict, port, and object to processing.</li>
                <li><strong>Other states</strong> with consumer privacy laws (Virginia, Colorado, Connecticut, Utah, etc.) provide similar rights.</li>
              </ul>
              <p className="mt-3">
                To exercise these rights, email{' '}
                <a href="mailto:sales@cicerogrand.com" className="underline">sales@cicerogrand.com</a>{' '}
                with your request and proof of identity.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">7. Data security & retention</h2>
              <p>
                We use industry-standard administrative, technical, and physical safeguards
                to protect your information. We retain reservation records as required by tax
                and lodging law, and other data only as long as needed for the purposes
                described above.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">8. Children's privacy</h2>
              <p>
                Our site is not directed to children under 13, and we do not knowingly
                collect personal information from them. If you believe a child has submitted
                information, please contact us so we can remove it.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">9. Third-party links</h2>
              <p>
                Our site may link to third-party services (Cloudbeds, Visit Syracuse,
                Google Maps, social media). Their privacy practices are governed by their own
                policies — we encourage you to read them.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">10. Changes to this policy</h2>
              <p>
                We may update this policy from time to time. The "Last updated" date at the
                top of this page reflects the most recent change. Material changes will be
                posted prominently on the site.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">11. Contact us</h2>
              <p>
                The Cicero Grand · 5875 Carmenica Drive, Cicero, NY 13039 ·{' '}
                <a href="mailto:sales@cicerogrand.com" className="underline">sales@cicerogrand.com</a>{' '}
                · (315) 752-0150
              </p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
