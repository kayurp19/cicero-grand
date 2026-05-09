import { PageHero } from '../components/PageHero';
import { useSeo } from '../hooks/useSeo';

export default function Accessibility() {
  useSeo({
    title: 'Accessibility Statement · The Cicero Grand',
    description:
      'The Cicero Grand is committed to digital and physical accessibility for guests with disabilities. WCAG 2.1 AA compliance and ADA accommodations.',
    canonicalPath: '/accessibility',
  });

  const lastUpdated = 'May 9, 2026';

  return (
    <>
      <PageHero
        eyebrow="Accessibility"
        image="/photos/exterior-1.jpg"
        title={<>Accessibility <em className="italic font-light">Statement</em>.</>}
        intro={`Last updated: ${lastUpdated}. We are committed to ensuring digital and physical accessibility for guests with disabilities.`}
      />

      <section className="bg-background py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-5 lg:px-10">
          <article className="space-y-10 text-base leading-relaxed">
            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">Our commitment</h2>
              <p>
                The Cicero Grand is committed to providing a website and a hotel that are
                accessible to the widest possible audience, regardless of ability or
                technology. We are continually improving the user experience for everyone
                and applying relevant accessibility standards.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">Conformance status</h2>
              <p>
                We aim to conform to{' '}
                <a
                  href="https://www.w3.org/WAI/WCAG21/quickref/?levels=aa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Web Content Accessibility Guidelines (WCAG) 2.1, Level AA
                </a>{' '}
                across cicerogrand.com. WCAG defines requirements for designers and
                developers to improve accessibility for people with disabilities.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">Website accessibility features</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Semantic HTML with proper heading structure for screen readers.</li>
                <li>Alt text on informational images.</li>
                <li>Keyboard-navigable menus and forms.</li>
                <li>Sufficient color contrast for text and interactive elements.</li>
                <li>Responsive design for mobile, tablet, and assistive zoom.</li>
                <li>Forms with proper labels and clear error messaging.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">Hotel accessibility features</h2>
              <p>The Cicero Grand offers the following on-site accommodations:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>ADA-accessible guest rooms with roll-in showers and grab bars (call to confirm availability).</li>
                <li>Accessible parking spaces near the main entrance.</li>
                <li>Step-free entry to the lobby and main corridors.</li>
                <li>Elevator access to all guest floors.</li>
                <li>Service animals welcome at no charge per ADA requirements.</li>
                <li>Accessible public restrooms.</li>
                <li>Visual alarm devices available upon request.</li>
                <li>TTY access available — call the front desk for relay service.</li>
              </ul>
              <p className="mt-3">
                Specific accommodations or questions about your stay? Call{' '}
                <a href="tel:+13157520150" className="underline">(315) 752-0150</a>{' '}
                in advance and we'll work to meet your needs.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">Feedback and contact</h2>
              <p>
                If you encounter an accessibility barrier on this website, or need
                accommodation during your stay, please contact us — we treat every report
                as a priority:
              </p>
              <ul className="list-none pl-0 space-y-2 mt-3">
                <li>
                  Email:{' '}
                  <a href="mailto:sales@cicerogrand.com" className="underline">
                    sales@cicerogrand.com
                  </a>
                </li>
                <li>
                  Phone:{' '}
                  <a href="tel:+13157520150" className="underline">
                    (315) 752-0150
                  </a>{' '}
                  (front desk, 24/7)
                </li>
                <li>Mail: 5875 Carmenica Drive, Cicero, NY 13039</li>
              </ul>
              <p className="mt-3">
                We will work with you to provide the information, item, or transaction you
                seek through a communication method that is accessible to you, consistent
                with applicable law (for example, Title III of the Americans with
                Disabilities Act).
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl tracking-tight mb-3">Ongoing improvement</h2>
              <p>
                Accessibility is an ongoing effort. We test our site regularly with
                automated tools and real assistive technology, and we welcome feedback that
                helps us do better.
              </p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
