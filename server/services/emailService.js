const nodemailer = require('nodemailer');

const ADMIN_NOTIFICATION_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL || 'sahamatekomal@gmail.com';

/**
 * Configure SMTP Transporter
 * Works with Gmail, Hostinger, Brevo, or generic SMTP
 */
function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null; // SMTP not yet configured in env
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

/**
 * Send New Order Notification to Komal (sahamatekomal@gmail.com)
 */
async function sendOrderNotificationToAdmin(order) {
  try {
    const customer = order.customer || {};
    const items = order.items || [];
    const orderId = order.orderId || order._id?.toString() || 'SD-ORD';
    const total = order.totalAmount ? Number(order.totalAmount).toLocaleString('en-IN') : '0';
    const paymentMethod = order.paymentMethod || 'COD';
    const paymentStatus = order.paymentStatus || 'Pending';

    console.log(`📧 [ORDER NOTIFICATION] Sending order #${orderId} alert to: ${ADMIN_NOTIFICATION_EMAIL}`);

    const itemsRowsHtml = items
      .map(
        (it) => `
        <tr style="border-bottom: 1px solid #e5d7d0;">
          <td style="padding: 10px; font-weight: 600; color: #26050e;">
            ${it.title || 'Handcrafted Outfit'}
            <div style="font-size: 12px; color: #8c6913; font-weight: normal;">Size: ${it.size || 'Free Size'}</div>
          </td>
          <td style="padding: 10px; text-align: center; color: #443538;">${it.quantity || 1}</td>
          <td style="padding: 10px; text-align: right; color: #443538;">₹${(it.price || 0).toLocaleString('en-IN')}</td>
          <td style="padding: 10px; text-align: right; font-weight: bold; color: #6b1d2f;">₹${((it.price || 0) * (it.quantity || 1)).toLocaleString('en-IN')}</td>
        </tr>
      `
      )
      .join('');

    const cleanPhone = (customer.phone || '').replace(/\D/g, '');
    const waUrl = `https://wa.me/91${cleanPhone}?text=Hi%20${encodeURIComponent(customer.name || 'there')}!%20Thank%20you%20for%20your%20order%20%23${orderId}%20at%20Sui-Dhaga.`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Order #${orderId}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fdfaf7; margin: 0; padding: 20px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #eaded6;">
          
          <!-- Brand Header -->
          <tr>
            <td style="background-color: #26050e; padding: 24px 30px; text-align: center; border-bottom: 3px solid #d4af37;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 0.1em; font-family: Georgia, serif;">SUI-DHAGA</h1>
              <div style="color: #d4af37; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 4px;">by Komal • Atelier Order Alert</div>
            </td>
          </tr>

          <!-- Notification Banner -->
          <tr>
            <td style="padding: 24px 30px 10px;">
              <div style="background-color: #fcf7ed; border-left: 4px solid #d4af37; padding: 14px 18px; border-radius: 4px; margin-bottom: 20px;">
                <h2 style="color: #6b1d2f; margin: 0 0 6px; font-size: 18px;">🎉 New Customer Order Received!</h2>
                <p style="margin: 0; color: #554448; font-size: 14px;">A new order has been placed on <strong>connectsuidhaga.com</strong>.</p>
              </div>

              <!-- Order Overview Table -->
              <table width="100%" cellspacing="0" cellpadding="6" style="font-size: 14px; margin-bottom: 20px; background-color: #faf6f2; border-radius: 8px; padding: 12px;">
                <tr>
                  <td style="color: #776669; width: 40%;"><strong>Order ID:</strong></td>
                  <td style="color: #26050e; font-weight: bold;">#${orderId}</td>
                </tr>
                <tr>
                  <td style="color: #776669;"><strong>Date & Time:</strong></td>
                  <td style="color: #26050e;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td>
                </tr>
                <tr>
                  <td style="color: #776669;"><strong>Payment Method:</strong></td>
                  <td style="color: #26050e; font-weight: bold;">${paymentMethod} (${paymentStatus})</td>
                </tr>
                <tr>
                  <td style="color: #776669;"><strong>Grand Total:</strong></td>
                  <td style="color: #15803d; font-size: 17px; font-weight: 800;">₹${total}</td>
                </tr>
              </table>

              <!-- Customer Details -->
              <h3 style="color: #26050e; border-bottom: 1px solid #eaded6; padding-bottom: 8px; font-size: 16px; margin-top: 24px;">👤 Customer Information</h3>
              <table width="100%" cellspacing="0" cellpadding="6" style="font-size: 14px; margin-bottom: 20px;">
                <tr>
                  <td style="color: #776669; width: 35%;">Name:</td>
                  <td style="color: #26050e; font-weight: 600;">${customer.name || 'Valued Customer'}</td>
                </tr>
                <tr>
                  <td style="color: #776669;">Phone Number:</td>
                  <td style="color: #26050e;">
                    <a href="tel:${customer.phone}" style="color: #6b1d2f; text-decoration: none; font-weight: bold;">${customer.phone || 'N/A'}</a>
                    ${
                      cleanPhone
                        ? ` • <a href="${waUrl}" style="color: #25D366; text-decoration: none; font-weight: bold;">Chat on WhatsApp ↗</a>`
                        : ''
                    }
                  </td>
                </tr>
                <tr>
                  <td style="color: #776669;">Email Address:</td>
                  <td style="color: #26050e;">
                    <a href="mailto:${customer.email}" style="color: #6b1d2f; text-decoration: none;">${customer.email || 'N/A'}</a>
                  </td>
                </tr>
                <tr>
                  <td style="color: #776669; vertical-align: top;">Shipping Address:</td>
                  <td style="color: #26050e; line-height: 1.4;">
                    ${customer.address || ''}<br/>
                    ${customer.city || ''}, ${customer.state || ''} - <strong>${customer.pincode || ''}</strong>
                  </td>
                </tr>
                ${
                  order.notes
                    ? `<tr><td style="color: #776669;">Customer Note:</td><td style="color: #6b1d2f; font-style: italic;">"${order.notes}"</td></tr>`
                    : ''
                }
              </table>

              <!-- Items Ordered -->
              <h3 style="color: #26050e; border-bottom: 1px solid #eaded6; padding-bottom: 8px; font-size: 16px; margin-top: 24px;">👗 Outfits Ordered</h3>
              <table width="100%" cellspacing="0" cellpadding="0" style="font-size: 13px; margin-bottom: 20px;">
                <thead>
                  <tr style="background-color: #f4ece6; color: #554448; font-weight: bold;">
                    <th style="padding: 8px 10px; text-align: left;">Outfit</th>
                    <th style="padding: 8px 10px; text-align: center;">Qty</th>
                    <th style="padding: 8px 10px; text-align: right;">Unit Price</th>
                    <th style="padding: 8px 10px; text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRowsHtml}
                </tbody>
              </table>

              <!-- Action Link -->
              <div style="text-align: center; margin: 30px 0 10px;">
                <a href="${waUrl}" style="background-color: #25D366; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 30px; font-weight: bold; font-size: 14px; display: inline-block;">
                  💬 WhatsApp Customer Now
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #faf6f2; padding: 16px 30px; text-align: center; font-size: 12px; color: #88777a; border-top: 1px solid #eaded6;">
              This is an automated order alert for <strong>Komal Ketan Yande</strong> (Sui-Dhaga).<br/>
              Atelier: Vasai – Virar (East), Maharashtra, India.
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const transporter = getTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: `"SUI-DHAGA Atelier" <${process.env.SMTP_USER || 'orders@connectsuidhaga.com'}>`,
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: `🎉 New Order #${orderId} - ₹${total} from ${customer.name || 'Customer'} (Sui-Dhaga)`,
        html: htmlContent,
      });
      console.log(`✅ Order notification email sent successfully to ${ADMIN_NOTIFICATION_EMAIL}`);
    } else {
      console.log(
        `ℹ️ [SMTP Info] Order notification logged for ${ADMIN_NOTIFICATION_EMAIL}. To send via real inbox SMTP, configure SMTP_USER & SMTP_PASS in .env.`
      );
    }
    return true;
  } catch (err) {
    console.error('❌ Failed to send order notification email:', err.message);
    return false;
  }
}

/**
 * Send Contact Form Inquiry Notification to Komal
 */
async function sendContactNotificationToAdmin(inquiry) {
  try {
    console.log(`📧 [CONTACT ALERT] Sending inquiry alert to: ${ADMIN_NOTIFICATION_EMAIL}`);
    const transporter = getTransporter();
    const cleanPhone = (inquiry.phone || '').replace(/\D/g, '');
    const waUrl = `https://wa.me/91${cleanPhone}?text=Hi%20${encodeURIComponent(inquiry.name || 'there')}!%20Thank%20you%20for%20contacting%20Sui-Dhaga.`;

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaded6; border-radius: 10px;">
        <div style="background-color: #26050e; padding: 15px; text-align: center; border-radius: 6px;">
          <h2 style="color: #ffffff; margin: 0;">SUI-DHAGA by Komal</h2>
          <div style="color: #d4af37; font-size: 12px;">New Contact Inquiry Received</div>
        </div>
        <div style="padding: 20px 0;">
          <p><strong>Name:</strong> ${inquiry.name}</p>
          <p><strong>Phone:</strong> <a href="tel:${inquiry.phone}">${inquiry.phone}</a> (<a href="${waUrl}">Chat on WhatsApp</a>)</p>
          <p><strong>Email:</strong> <a href="mailto:${inquiry.email}">${inquiry.email}</a></p>
          <p><strong>Subject:</strong> ${inquiry.subject || 'General Inquiry'}</p>
          <div style="background-color: #f9f5f1; padding: 15px; border-left: 4px solid #6b1d2f; margin: 15px 0;">
            <strong>Message:</strong><br/>
            ${inquiry.message.replace(/\n/g, '<br/>')}
          </div>
        </div>
        <div style="font-size: 12px; color: #888; text-align: center;">
          Sent from connectsuidhaga.com contact form
        </div>
      </div>
    `;

    if (transporter) {
      await transporter.sendMail({
        from: `"SUI-DHAGA Contact" <${process.env.SMTP_USER || 'help@connectsuidhaga.com'}>`,
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: `📩 New Contact Inquiry from ${inquiry.name} (${inquiry.subject || 'Sui-Dhaga'})`,
        html: htmlContent,
      });
      console.log(`✅ Contact notification sent to ${ADMIN_NOTIFICATION_EMAIL}`);
    } else {
      console.log(`ℹ️ [SMTP Info] Contact inquiry logged for ${ADMIN_NOTIFICATION_EMAIL}`);
    }
    return true;
  } catch (err) {
    console.error('❌ Failed to send contact notification email:', err.message);
    return false;
  }
}

module.exports = {
  sendOrderNotificationToAdmin,
  sendContactNotificationToAdmin,
};
