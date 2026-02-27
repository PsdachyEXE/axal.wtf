import { useState } from 'react'
import useScrollFadeIn from '../hooks/useScrollFadeIn'

const FAQS = [
  {
    q: 'How do I get access after purchase?',
    a: "After your payment is confirmed you'll receive an email with setup instructions. Join our Discord and open a support ticket if you need help getting started.",
  },
  {
    q: 'What is the difference between Monthly and Lifetime?',
    a: 'Monthly is a one-time payment that gives you 30 days of access — it does not auto-renew. Lifetime is also a one-time payment but grants permanent access with no expiry.',
  },
  {
    q: 'Does the monthly plan auto-renew?',
    a: 'No. The monthly plan is a single one-time purchase for 30 days of access. You will need to repurchase manually when it expires.',
  },
  {
    q: 'Can I upgrade from Monthly to Lifetime?',
    a: 'Yes. Once your monthly access expires, simply purchase a Lifetime license. Reach out on Discord if you need assistance.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'Due to the nature of digital software, all purchases are final. If you have a technical issue, contact support before requesting a refund.',
  },
  {
    q: 'Where can I get support?',
    a: 'Join our Discord server for the fastest response. You can also reach us via the contact details in your purchase confirmation email.',
  },
]

function FAQItem({ item, open, onToggle }) {
  return (
    <div className="faq-item">
      <button
        type="button"
        className="faq-trigger"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span>{item.q}</span>
        <span className="faq-icon" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="faq-body">
          {item.a}
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  const labelRef = useScrollFadeIn()
  const listRef = useScrollFadeIn()
  const [openIdx, setOpenIdx] = useState(null)

  const toggle = (i) => setOpenIdx(openIdx === i ? null : i)

  return (
    <section
      id="faq"
      style={{
        padding: '100px 24px',
        borderTop: '1px solid #1e1e1e',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div ref={labelRef} style={{ marginBottom: '48px' }}>
          <div className="label-comment">// FAQ</div>
          <div className="section-rule" />
        </div>

        <div
          ref={listRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0 64px',
            alignItems: 'start',
          }}
          className="faq-grid"
        >
          <div>
            {FAQS.slice(0, Math.ceil(FAQS.length / 2)).map((item, i) => (
              <FAQItem
                key={i}
                item={item}
                open={openIdx === i}
                onToggle={() => toggle(i)}
              />
            ))}
          </div>
          <div>
            {FAQS.slice(Math.ceil(FAQS.length / 2)).map((item, i) => {
              const idx = i + Math.ceil(FAQS.length / 2)
              return (
                <FAQItem
                  key={idx}
                  item={item}
                  open={openIdx === idx}
                  onToggle={() => toggle(idx)}
                />
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
