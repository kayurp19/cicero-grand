import { PageHero } from '../components/PageHero';
import { useSeo } from '../hooks/useSeo';
import { openCookieSettings } from '../lib/consent';

export default function Privacy() {
  useSeo({
    title: 'Privacy Policy · The Cicero Grand',
    description:
      'How The Cicero Grand handles personal information, cookies and optional Google and Meta tracking. Manage your cookie choices.',
    canonicalPath: '/privacy',
  });

  const lastUpdated = 'October 28, 2026';

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

            <div id="cookies">
              <h2 className="font-display text-2xl tracking-tight mb-3">4. Cookie policy and tracking choices</h2>
              <p>
                Optional analytics and advertising on cicerogrand.com stay off until you
                choose Accept all. Essential only keeps Google Tag Manager, Google Analytics,
                Google Ads and the Meta Pixel from loading. Browsing, inquiry forms and links
                to book a room remain available with either choice.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Preferences and functional storage:</strong> cg_cookie_consent_v2 stores your choice, notice version, time and expiry in this browser for 180 days. The cg_tracking_optout cookie safeguards an essential-only choice for up to 180 days. These are browser-local records, not a centralized consent audit log. The cg_popup cookie remembers a dismissed or completed offer for up to 180 days; cg_admin supports authenticated staff access. These are not advertising cookies.</li>
                <li><strong>Analytics, only after Accept all:</strong> Google Analytics measures site usage. Its cookies can include _ga and _ga_ followed by a property identifier.</li>
                <li><strong>Advertising, only after Accept all:</strong> Google Ads and Meta measure campaigns and may support advertising audiences. Their cookies can include _gcl_au, other _gcl_ cookies, _fbp and _fbc. Google Tag Manager loads the configured Google measurement tools. Vendor cookie names and lifetimes can vary with their configuration.</li>
              </ul>
              <p className="mt-3">
                You can reopen Cookie settings in the footer at any time. Choosing Essential
                only after accepting stops optional tracking, removes known accessible
                first-party tracking cookies and reloads the page to unload running trackers.
                It does not undo information already sent or delete cookies on other domains.
                If your browser sends Global Privacy Control, optional analytics and
                advertising stay off. If browser storage is unavailable, your choice lasts
                only for the current page session; an essential-only safeguard cookie may
                still remember your rejection. A fresh load without a valid acceptance
                starts with tracking off.
              </p>
              <button type="button" onClick={openCookieSettings}
                className="mt-4 rounded-full border border-foreground px-5 py-3 text-sm font-medium hover:bg-foreground hover:text-background">
                Cookie settings
              </button>
              <p className="mt-4">
                Room reservations open on Cloudbeds, a separate service with its own cookies
                and privacy controls. This website setting does not change Cloudbeds&apos;
                settings. Essential server logs and information you intentionally submit in
                a form are separate from optional tracking; accepting cookies does not sign
                you up for marketing emails.
              </p>
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
                Optional advertising tools can involve sharing information for advertising.
                Use Cookie settings to keep these tools off. For other privacy requests,
                contact us using the details below.
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
