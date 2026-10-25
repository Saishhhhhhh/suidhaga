import React, { useEffect } from 'react';
import { ArrowLeft, ShieldCheck, FileText, RotateCcw, Clock, Truck, Phone, Mail, MapPin } from 'lucide-react';
import OfficialWhatsAppIcon from '../components/OfficialWhatsAppIcon';

export default function PolicyPage({ type = 'privacy', onSelectType, onBackToHome }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [type]);

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck, path: '/privacy-policy' },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText, path: '/terms-and-conditions' },
    { id: 'returns', label: 'Returns & Shipping', icon: RotateCcw, path: '/return-policy' },
  ];

  const handleTabClick = (tabId, path) => {
    window.history.pushState({}, '', path);
    if (onSelectType) onSelectType(tabId);
  };

  return (
    <div style={{ backgroundColor: '#fcf8f3', minHeight: '80vh', padding: '3.5rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '940px' }}>
        
        {/* Navigation Breadcrumb & Back */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <button
            onClick={onBackToHome}
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <ArrowLeft size={15} />
            <span>Back to Store</span>
          </button>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <span onClick={onBackToHome} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Home</span>
            {' / '}
            <span style={{ color: 'var(--maroon-900)', fontWeight: 600 }}>Legal & Store Policies</span>
          </div>
        </div>

        {/* Policy Tab Switcher */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            backgroundColor: '#ffffff',
            padding: '0.4rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid #eaded6',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            marginBottom: '2.5rem',
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = type === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleTabClick(t.id, t.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.6rem 1.4rem',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--maroon-800)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-medium)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  flex: '1 1 auto',
                  justifyContent: 'center',
                }}
              >
                <Icon size={16} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Policy Main Paper Container */}
        <div
          className="card-luxury"
          style={{
            backgroundColor: '#ffffff',
            padding: '3rem',
            borderRadius: '12px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
            border: '1px solid #eedfd4',
            color: '#26050e',
            lineHeight: 1.75,
          }}
        >
          
          {/* ===================== PRIVACY POLICY ===================== */}
          {type === 'privacy' && (
            <div>
              <div style={{ borderBottom: '1px solid #eedfd4', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <span style={{ fontSize: '0.78rem', color: '#8c6913', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Legal & Trust
                </span>
                <h1 className="font-display" style={{ fontSize: '2.4rem', color: 'var(--maroon-900)', margin: '0.3rem 0 0.5rem' }}>
                  Privacy Policy
                </h1>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Last Updated: <strong>January 13, 2026</strong>
                </div>
              </div>

              <p style={{ fontSize: '0.98rem', color: 'var(--text-dark)', marginBottom: '1.75rem' }}>
                At <strong>SUI-DHAGA</strong>, we value the trust you place in us. This Privacy Policy describes how we collect, use, and protect your personal information when you visit or make a purchase from <strong>connectsuidhaga.com</strong>.
              </p>

              <h2 style={{ fontSize: '1.25rem', color: 'var(--maroon-800)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                1. Information We Collect
              </h2>
              <p style={{ marginBottom: '0.75rem' }}>
                When you visit the site, we collect certain information necessary to process your orders and improve your experience:
              </p>
              <ul style={{ paddingLeft: '1.4rem', marginBottom: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Personal Information:</strong> Name, shipping address, billing address, email address, and phone number (+91).
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Payment Information:</strong> While we do not store credit card numbers, our secure payment processors collect details necessary to complete the transaction.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Device Information:</strong> IP address, browser type, and time zone to help us prevent fraud and optimize our website.
                </li>
              </ul>

              <h2 style={{ fontSize: '1.25rem', color: 'var(--maroon-800)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                2. How We Use Your Information
              </h2>
              <p style={{ marginBottom: '0.75rem' }}>We use the information collected to:</p>
              <ul style={{ paddingLeft: '1.4rem', marginBottom: '1.5rem' }}>
                <li style={{ marginBottom: '0.4rem' }}>Fulfill and ship your “Indo-Western Fusion” orders.</li>
                <li style={{ marginBottom: '0.4rem' }}>Communicate with you regarding order status or styling assistance.</li>
                <li style={{ marginBottom: '0.4rem' }}>Screen our orders for potential risk or fraud.</li>
                <li style={{ marginBottom: '0.4rem' }}>Send you updates about new collections or “Affordable Elegance” deals (only if you have opted-in).</li>
              </ul>

              <h2 style={{ fontSize: '1.25rem', color: 'var(--maroon-800)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                3. Sharing Your Information
              </h2>
              <p style={{ marginBottom: '0.75rem' }}>
                We share your Personal Information with third parties only to help us use it as described above. For example:
              </p>
              <ul style={{ paddingLeft: '1.4rem', marginBottom: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Logistics Partners:</strong> To ensure your handcrafted outfits reach your doorstep in Vasai-Virar or across India.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Payment Gateways:</strong> To process secure transactions (PhonePe, UPI, Netbanking).
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Legal Compliance:</strong> We may share information to comply with applicable laws and regulations in India.
                </li>
              </ul>

              <h2 style={{ fontSize: '1.25rem', color: 'var(--maroon-800)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                4. Data Retention
              </h2>
              <p style={{ marginBottom: '1.5rem' }}>
                When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.
              </p>

              <h2 style={{ fontSize: '1.25rem', color: 'var(--maroon-800)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                5. Security
              </h2>
              <p style={{ marginBottom: '1.5rem' }}>
                We take reasonable precautions and follow industry best practices to make sure your personal information is not inappropriately lost, misused, accessed, disclosed, altered, or destroyed.
              </p>

              <h2 style={{ fontSize: '1.25rem', color: 'var(--maroon-800)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                6. Cookies
              </h2>
              <p style={{ marginBottom: '1.5rem' }}>
                We use cookies to maintain your shopping session and remember items in your cart. You can choose to disable cookies through your browser settings, though it may affect your ability to use certain features of the site.
              </p>

              <h2 style={{ fontSize: '1.25rem', color: 'var(--maroon-800)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                7. Changes to This Policy
              </h2>
              <p style={{ marginBottom: '2rem' }}>
                We may update this privacy policy from time to time to reflect changes to our practices or for other operational, legal, or regulatory reasons.
              </p>

              {/* Contact Box */}
              <div
                style={{
                  backgroundColor: '#faf5f0',
                  border: '1.5px solid #eedfd4',
                  borderRadius: '8px',
                  padding: '1.5rem 1.75rem',
                  marginTop: '2.5rem',
                }}
              >
                <h3 style={{ margin: '0 0 0.8rem', color: 'var(--maroon-900)', fontSize: '1.1rem' }}>
                  Contact Us Regarding Privacy
                </h3>
                <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: 'var(--text-medium)' }}>
                  If you have questions about our privacy practices, or if you would like to make a complaint, please contact us:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <div>📞 <strong>Phone:</strong> <a href="tel:+919773001771" style={{ color: 'var(--maroon-800)' }}>+91 97730 01771</a></div>
                  <div>✉️ <strong>Email:</strong> <a href="mailto:help@connectsuidhaga.com" style={{ color: 'var(--maroon-800)' }}>help@connectsuidhaga.com</a></div>
                  <div>📍 <strong>Address:</strong> SUI-DHAGA, Vasai – Virar (East), Maharashtra, India.</div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TERMS AND CONDITIONS ===================== */}
          {type === 'terms' && (
            <div>
              <div style={{ borderBottom: '1px solid #eedfd4', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <span style={{ fontSize: '0.78rem', color: '#8c6913', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Terms of Service
                </span>
                <h1 className="font-display" style={{ fontSize: '2.4rem', color: 'var(--maroon-900)', margin: '0.3rem 0 0.5rem' }}>
                  Terms and Conditions
                </h1>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Last Updated: <strong>January 13, 2026</strong> • Founder: <strong>KOMAL KETAN YANDE</strong>
                </div>
              </div>

              <p style={{ fontSize: '0.98rem', color: 'var(--text-dark)', marginBottom: '1.75rem' }}>
                Welcome to <strong>SUI-DHAGA</strong>. By accessing or using our website (<strong>connectsuidhaga.com</strong>), you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
              </p>

              <h2 style={{ fontSize: '1.25rem', color: 'var(--maroon-800)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                1. General Overview
              </h2>
              <p style={{ marginBottom: '1.5rem' }}>
                This website is operated by SUI-DHAGA. Throughout the site, the terms “we”, “us” and “our” refer to SUI-DHAGA. We offer this website, including all information, tools, and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here.
              </p>

              <h2 style={{ fontSize: '1.25rem', color: 'var(--maroon-800)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                2. Product Information & Accuracy
              </h2>
              <ul style={{ paddingLeft: '1.4rem', marginBottom: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Fusion Designs:</strong> Our products are handcrafted by artisans. Minor variations in color, weave, or embroidery are not defects but a hallmark of “Made with Love” unique pieces.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Pricing:</strong> All prices are listed in INR (Indian Rupees). We reserve the right to modify prices or discontinue products without prior notice.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Color Disclaimer:</strong> While we strive to display colors accurately, the actual colors you see will depend on your monitor/screen and may vary slightly.
                </li>
              </ul>

              <h2 style={{ fontSize: '1.25rem', color: 'var(--maroon-800)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                3. Orders and Payments
              </h2>
              <ul style={{ paddingLeft: '1.4rem', marginBottom: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Acceptance:</strong> We reserve the right to refuse or cancel any order for reasons including stock unavailability or errors in pricing.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Payment Security:</strong> We use secure third-party payment gateways (PhonePe, UPI, Cards, Netbanking). SUI-DHAGA does not store your credit/debit card details.
                </li>
              </ul>

              <h2 style={{ fontSize: '1.25rem', color: 'var(--maroon-800)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                4. Shipping and Delivery
              </h2>
              <ul style={{ paddingLeft: '1.4rem', marginBottom: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Timeline:</strong> Orders are typically processed within 2-4 business days. Delivery timelines are typically within <strong>7 working days</strong> to your location across India.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Address:</strong> Please ensure the shipping address provided is accurate. We are not responsible for delays caused by incorrect address details.
                </li>
              </ul>

              <h2 style={{ fontSize: '1.25rem', color: 'var(--maroon-800)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                5. Return and Exchange Policy
              </h2>
              <ul style={{ paddingLeft: '1.4rem', marginBottom: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Eligibility:</strong> Items must be unused, unwashed, and have all original tags attached.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Process:</strong> To initiate a return or exchange, please contact us at <a href="mailto:help@connectsuidhaga.com" style={{ color: 'var(--maroon-800)' }}>help@connectsuidhaga.com</a> or via WhatsApp at <a href="https://wa.me/919773001771" style={{ color: '#25D366' }}>+91 97730 01771</a> within <strong>7 days</strong> of delivery.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Non-Returnable:</strong> Customized outfits or items bought during a “Clearance Sale” may not be eligible for return.
                </li>
              </ul>

              <h2 style={{ fontSize: '1.25rem', color: 'var(--maroon-800)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                6. Intellectual Property
              </h2>
              <p style={{ marginBottom: '1.5rem' }}>
                All content on this website, including logos, designs, text, and images, is the property of SUI-DHAGA and Komal Ketan Yande (Founder). Any unauthorized use or reproduction of our “Indo-Western Fusion” designs is strictly prohibited.
              </p>

              <h2 style={{ fontSize: '1.25rem', color: 'var(--maroon-800)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                7. Limitation of Liability
              </h2>
              <p style={{ marginBottom: '1.5rem' }}>
                SUI-DHAGA shall not be liable for any indirect, incidental, or consequential damages resulting from the use of our products or the inability to use our website.
              </p>

              <h2 style={{ fontSize: '1.25rem', color: 'var(--maroon-800)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                8. Governing Law
              </h2>
              <p style={{ marginBottom: '2rem' }}>
                These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in <strong>Vasai / Palghar, Maharashtra</strong>.
              </p>

              {/* Contact Box */}
              <div
                style={{
                  backgroundColor: '#faf5f0',
                  border: '1.5px solid #eedfd4',
                  borderRadius: '8px',
                  padding: '1.5rem 1.75rem',
                  marginTop: '2.5rem',
                }}
              >
                <h3 style={{ margin: '0 0 0.8rem', color: 'var(--maroon-900)', fontSize: '1.1rem' }}>
                  Contact Information
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <div>📞 <strong>Phone:</strong> <a href="tel:+919773001771" style={{ color: 'var(--maroon-800)' }}>+91 97730 01771</a></div>
                  <div>✉️ <strong>Email:</strong> <a href="mailto:help@connectsuidhaga.com" style={{ color: 'var(--maroon-800)' }}>help@connectsuidhaga.com</a></div>
                  <div>📍 <strong>Address:</strong> Vasai – Virar (East), Maharashtra, India.</div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== RETURN, EXCHANGE & REFUND POLICY ===================== */}
          {type === 'returns' && (
            <div>
              <div style={{ borderBottom: '1px solid #eedfd4', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <span style={{ fontSize: '0.78rem', color: '#8c6913', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Hassle-Free Shopping
                </span>
                <h1 className="font-display" style={{ fontSize: '2.4rem', color: 'var(--maroon-900)', margin: '0.3rem 0 0.5rem' }}>
                  Return, Exchange & Refund Policy
                </h1>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Last Updated: <strong>January 13, 2026</strong> • Pan-India Delivery & Returns
                </div>
              </div>

              <p style={{ fontSize: '0.98rem', color: 'var(--text-dark)', marginBottom: '1.75rem' }}>
                At <strong>SUI-DHAGA</strong>, we want you to love your “Indo-Western Fusion” pieces. If you are not entirely satisfied with your purchase, we’re here to help.
              </p>

              <h2 style={{ fontSize: '1.25rem', color: 'var(--maroon-800)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                1. Return & Exchange Window
              </h2>
              <p style={{ marginBottom: '0.75rem' }}>
                You have <strong>7 days</strong> from the date of delivery to request a return or exchange.
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Requests made after this period will unfortunately not be eligible for a refund or exchange.
              </p>

              <h2 style={{ fontSize: '1.25rem', color: 'var(--maroon-800)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                2. Eligibility for Returns
              </h2>
              <p style={{ marginBottom: '0.75rem' }}>To ensure a successful return, please make sure that:</p>
              <ul style={{ paddingLeft: '1.4rem', marginBottom: '1.5rem' }}>
                <li style={{ marginBottom: '0.4rem' }}>The item is unused, unwashed, and in the same pristine condition that you received it.</li>
                <li style={{ marginBottom: '0.4rem' }}>All original tags, labels, and packaging are intact.</li>
                <li style={{ marginBottom: '0.4rem' }}>You have the proof of purchase (invoice / order confirmation).</li>
                <li style={{ marginBottom: '0.4rem' }}>The item does not have any stains, sweat marks, or fragrance/perfume odors.</li>
              </ul>

              <h2 style={{ fontSize: '1.25rem', color: 'var(--maroon-800)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                3. Non-Returnable Items
              </h2>
              <p style={{ marginBottom: '1.5rem' }}>
                <strong>Final Sale Items:</strong> Products purchased during a “Clearance Sale” or custom-stitched to personal bespoke measurements are marked as Non-Returnable.
              </p>

              <h2 style={{ fontSize: '1.25rem', color: 'var(--maroon-800)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                4. The Process: How to Initiate a Return
              </h2>
              <ul style={{ paddingLeft: '1.4rem', marginBottom: '1.5rem' }}>
                <li style={{ marginBottom: '0.6rem' }}>
                  <strong>Request:</strong> Email us at <a href="mailto:help@connectsuidhaga.com" style={{ color: 'var(--maroon-800)', fontWeight: 600 }}>help@connectsuidhaga.com</a> or WhatsApp us at <a href="https://wa.me/919773001771" style={{ color: '#25D366', fontWeight: 600 }}>+91 97730 01771</a> with your Order ID and photos of the product.
                </li>
                <li style={{ marginBottom: '0.6rem' }}>
                  <strong>Pickup / Shipping:</strong> Once approved, we will arrange a reverse pickup from your address (serviceable pin codes only). If a pickup is not available in your location, you may ship the item back to our Vasai – Virar address.
                </li>
                <li style={{ marginBottom: '0.6rem' }}>
                  <strong>Inspection:</strong> Once we receive the item at our atelier, our team will perform a careful quality check.
                </li>
              </ul>

              <h2 style={{ fontSize: '1.25rem', color: 'var(--maroon-800)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                5. Refunds
              </h2>
              <ul style={{ paddingLeft: '1.4rem', marginBottom: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Approved Refunds:</strong> If the item passes quality check, your refund will be processed within <strong>7-10 business days</strong>.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Mode of Refund:</strong>
                  <ul style={{ marginTop: '0.4rem' }}>
                    <li><strong>Prepaid Orders:</strong> Refunded directly to the original payment method (Bank Account / UPI / Card).</li>
                    <li><strong>Cash on Delivery (COD):</strong> We will request your bank account details (Account number & IFSC) to process a direct bank transfer, or provide store credit.</li>
                  </ul>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Shipping Fees:</strong> Original shipping charges are non-refundable.
                </li>
              </ul>

              <h2 style={{ fontSize: '1.25rem', color: 'var(--maroon-800)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                6. Damaged or Defective Items
              </h2>
              <p style={{ marginBottom: '1.5rem' }}>
                If you receive a damaged or incorrect product, please notify us within <strong>48 hours</strong> of delivery with clear photos/videos of the defect. We will replace the item or offer a full refund at no extra cost to you.
              </p>

              <h2 style={{ fontSize: '1.25rem', color: 'var(--maroon-800)', marginTop: '2rem', marginBottom: '0.75rem' }}>
                7. Shipping Policy
              </h2>
              <div
                style={{
                  backgroundColor: '#fefcf8',
                  border: '1px solid #d4af37',
                  borderRadius: '8px',
                  padding: '1.25rem 1.5rem',
                  marginBottom: '2rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--maroon-900)', fontWeight: 700, marginBottom: '0.4rem' }}>
                  <Truck size={20} color="#d4af37" />
                  <span>Pan-India Delivery Guarantee</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.94rem', color: 'var(--text-dark)' }}>
                  All orders are dispatched from our Mumbai atelier and will be delivered within <strong>7 working days</strong> to your location across India. Express tracking updates are provided via SMS and WhatsApp.
                </p>
              </div>

              {/* Contact Our Styling Team */}
              <div
                style={{
                  backgroundColor: '#faf5f0',
                  border: '1.5px solid #eedfd4',
                  borderRadius: '8px',
                  padding: '1.5rem 1.75rem',
                }}
              >
                <h3 style={{ margin: '0 0 0.5rem', color: 'var(--maroon-900)', fontSize: '1.1rem' }}>
                  Contact Our Styling Team
                </h3>
                <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: 'var(--text-medium)' }}>
                  If you have questions about fit or fabric before you return, let’s talk!
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <a
                    href="https://wa.me/919773001771?text=Hi%20Komal!%20I%20have%20a%20question%20regarding%20my%20order%20return/exchange."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                    style={{ borderColor: '#25D366', color: '#16a34a', fontWeight: 700 }}
                  >
                    <OfficialWhatsAppIcon size={16} color="#25D366" />
                    <span>WhatsApp: +91 97730 01771</span>
                  </a>
                  <a href="tel:+919773001771" className="btn btn-outline btn-sm">
                    <Phone size={14} />
                    <span>Call: +91 97730 01771</span>
                  </a>
                  <a href="mailto:help@connectsuidhaga.com" className="btn btn-outline btn-sm">
                    <Mail size={14} />
                    <span>help@connectsuidhaga.com</span>
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      <style>{`
        @media (max-width: 640px) {
          .card-luxury {
            padding: 1.5rem !important;
          }
          h1 {
            font-size: 1.8rem !important;
          }
        }
      `}</style>
    </div>
  );
}
