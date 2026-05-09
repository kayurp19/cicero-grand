import { PageHero } from '../components/PageHero';
import { useSeo } from '../hooks/useSeo';

export default function Terms() {
  useSeo({
    title: 'Terms of Use · The Cicero Grand',
    description:
      'Terms governing your use of the cicerogrand.com website and your stay at The Cicero Grand hotel.',
    canonicalPath: '/terms',
  });

  const lastUpdated = 'May 9, 2026';

  return (
    <>
      <PageHero
        eyebrow="Legal"
        image="/photos/exterior-1.jpg"
        title={<>Terms <em className="italic font-light">of Use</em>.</>}
        intro={`Last updated: ${lastUpdated}. These terms govern your use of cicerogrand.com and any reservations made through it.`}
      />

      <section className="bg-background py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-5 lg:px-10">
          <article className="space-y-10 text-base leading-relaxed">
            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">1. Acceptance of terms</h2>
              <p>
                By accessing or using cicerogrand.com ("the site") or making a reservation,
                you agree to these Terms of Use. If you do not agree, please do not use the
                site or our services.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">2. Eligibility</h2>
              <p>
                You must be at least 18 years old to make a reservation. By booking, you
                represent that the information you provide is accurate and that you are
                authorized to use the payment method submitted.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">3. Reservations, rates & payment</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Rates are quoted in U.S. dollars and exclude taxes and fees unless stated.</li>
                <li>A valid credit card is required to hold a reservation.</li>
                <li>Final balance is charged at check-in or as described in the rate's cancellation terms.</li>
                <li>Cancellation policies vary by rate; please review the policy displayed at booking.</li>
                <li>No-shows may be charged the first night's room and tax.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">4. Check-in & check-out</h2>
              <p>
                Standard check-in: 3:00 PM. Check-out: 11:00 AM. Early check-in and late
                check-out are subject to availability. A government-issued photo ID is
                required at check-in.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">5. Hotel policies</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Smoke-free property:</strong> all guest rooms and public areas are non-smoking. A cleaning fee will be assessed for violations.</li>
                <li><strong>Pet policy:</strong> well-behaved pets are welcome with prior arrangement and applicable pet fee. Service animals are always welcome at no charge.</li>
                <li><strong>Damages:</strong> guests are responsible for any damage to the room, furniture, or property.</li>
                <li><strong>Quiet hours:</strong> 10:00 PM to 7:00 AM out of respect for other guests.</li>
                <li><strong>Right to refuse service:</strong> we reserve the right to refuse service or remove guests for unsafe or disruptive conduct.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">6. Use of the site</h2>
              <p>
                You agree to use the site only for lawful purposes. You may not attempt to
                gain unauthorized access, interfere with operation, or use the site to
                transmit harmful content. The site and its content are owned by The Cicero
                Grand or its licensors and are protected by copyright and trademark law.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">7. Third-party services</h2>
              <p>
                Reservations are processed by our property management system (Cloudbeds).
                Some links on the site direct you to third-party services (Visit Syracuse,
                Google Maps, social media). Those services are governed by their own terms
                and privacy policies.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">8. Disclaimers</h2>
              <p>
                The site is provided "as is" without warranties of any kind, express or
                implied. We do not warrant that the site will be uninterrupted or error-free,
                or that information on the site is complete or current. Photos and
                descriptions are representative; rooms may vary.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">9. Limitation of liability</h2>
              <p>
                To the maximum extent permitted by law, The Cicero Grand and its affiliates
                are not liable for any indirect, incidental, special, consequential, or
                punitive damages arising from your use of the site or your stay. Our total
                liability for any claim related to this site shall not exceed the amount you
                paid for the reservation in question.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">10. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless The Cicero Grand from any claims,
                damages, or expenses arising from your violation of these terms or your use
                of the site.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">11. Governing law</h2>
              <p>
                These terms are governed by the laws of the State of New York, without
                regard to conflict of laws principles. Any dispute shall be resolved in the
                state or federal courts located in Onondaga County, New York.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">12. Changes</h2>
              <p>
                We may update these terms from time to time. The "Last updated" date at the
                top reflects the most recent change. Continued use of the site constitutes
                acceptance of the updated terms.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">13. Contact</h2>
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
