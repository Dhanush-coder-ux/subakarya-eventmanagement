import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Mail,
  MessageCircle,
  FileText,
  ShieldCheck,
  Send,
  CheckCircle2,
} from 'lucide-react';

export const HelpSupportSection: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportCategory, setSupportCategory] = useState('Repost Inquiries');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const faqs = [
    {
      q: 'How does the Customer-to-Professional Repost Experience work?',
      a: 'When viewing any professional’s reel, customers can tap the "Repost" action to submit a verified or general experience testimonial. The reel is NOT published immediately. The professional receives a dedicated permission request in their Repost Requests Inbox where they can review your rating, photos, and commentary before granting approval. Once approved, it appears in your public profile Reposts tab with full creator attribution.',
    },
    {
      q: 'Can a creator revoke permission for a repost after it is approved?',
      a: 'Yes. Creators retain intellectual property ownership over their reel media. If a vendor revokes permission, the syndicated repost is instantly and gracefully removed from public profile view without affecting the original reel.',
    },
    {
      q: 'Can customers remove an approved repost from their own profile?',
      a: 'Absolutely. Customers can tap the remove action on any repost card on their profile or from Settings > Repost Activity at any time. Removing a repost does not affect the creator’s original reel.',
    },
    {
      q: 'What is the difference between Product Orders and Event Bookings?',
      a: 'Event Bookings represent scheduled client jobs, formal quotations, venue bookings, and calendar-locked dates. Product Orders represent equipment rental shipments, cameras, lighting gear, and decorative assets fulfilled from inventory.',
    },
    {
      q: 'How are vendor settlements processed?',
      a: 'Settlements for completed bookings and equipment hire are credited according to your configured payout cadence (Daily Sweep, Weekly, or Instant UPI Push) directly into your verified bank account.',
    },
  ];

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setSupportMessage('');
    }, 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-charcoal">Help and Support</h2>
        <p className="text-xs text-charcoal-muted mt-0.5">
          Frequently asked questions, dispute resolution guidelines, and direct concierge assistance.
        </p>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card space-y-3">
        <h3 className="font-bold text-sm text-charcoal flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-wine" />
          <span>Frequently Asked Questions</span>
        </h3>

        <div className="divide-y divide-border/60 pt-1">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="py-3">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-xs font-bold text-charcoal hover:text-wine transition-colors gap-3"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-charcoal-muted shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-wine' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs text-charcoal-muted leading-relaxed animate-in fade-in duration-150">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Concierge Form */}
      <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card space-y-4">
        <div>
          <h3 className="font-bold text-sm text-charcoal flex items-center gap-2">
            <Mail className="w-4 h-4 text-wine" />
            <span>Contact Subakarya Concierge Support</span>
          </h3>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Our team responds to booking disputes and creator permission tickets within 2 hours.
          </p>
        </div>

        {ticketSubmitted ? (
          <div className="p-4 rounded-xl bg-success-light border border-success/30 text-xs font-semibold text-success flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Support ticket submitted! Reference #TK-{Math.floor(1000 + Math.random() * 9000)}. Our concierge team will reach out.</span>
          </div>
        ) : (
          <form onSubmit={handleSupportSubmit} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-charcoal">Issue Category</label>
              <select
                value={supportCategory}
                onChange={(e) => setSupportCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
              >
                <option value="Repost Inquiries">Repost & Content Permissions</option>
                <option value="Booking Dispute">Booking or Quotation Dispute</option>
                <option value="Payout Inquiry">Settlement & Bank Payouts</option>
                <option value="Technical Issue">Platform Bug / Technical Glitch</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-charcoal">Describe Your Inquiry</label>
              <textarea
                rows={3}
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                placeholder="Include reference IDs or details..."
                className="w-full p-3 rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine resize-none"
                required
              />
            </div>

            <div className="pt-1 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-wine hover:bg-wine-dark text-white font-bold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Ticket</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

