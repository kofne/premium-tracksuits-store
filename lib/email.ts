import { ContactFormData, OrderFormData } from './firestore';

// Email configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@yourdomain.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@yourdomain.com';

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send email using Resend API
 */
async function sendEmail(emailData: EmailData) {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Resend API error: ${error}`);
    }

    const result = await response.json();
    console.log('Email sent successfully:', result.id);
    return { success: true, id: result.id };
  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Generate contact form notification email
 */
function generateContactEmail(contactData: ContactFormData) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Contact Form Submission</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #dc2626;">New Contact Form Submission</h2>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Contact Details</h3>
          
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${contactData.email}">${contactData.email}</a></p>
          <p><strong>Message:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #dc2626;">
            ${contactData.message.replace(/\n/g, '<br>')}
          </div>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
          Submitted on: ${new Date().toLocaleString()}
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #6b7280; font-size: 12px;">
          This email was sent from your website contact form.
        </p>
      </div>
    </body>
    </html>
  `;

  return {
    to: ADMIN_EMAIL,
    subject: `New Contact Form Submission from ${contactData.name}`,
    html,
  };
}

/**
 * Generate order notification email
 */
function generateOrderEmail(orderData: OrderFormData) {
  const subjectsList = orderData.subjects.map(subject => `<li>${subject}</li>`).join('');
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order Submission</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #059669;">New Order Submission</h2>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
          <h3 style="margin-top: 0; color: #065f46;">Order Details</h3>
          
          <p><strong>Customer Name:</strong> ${orderData.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${orderData.email}">${orderData.email}</a></p>
          <p><strong>Grade Level:</strong> ${orderData.grade}</p>
          <p><strong>Subjects:</strong></p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            ${subjectsList}
          </ul>
          
          ${orderData.message ? `
            <p><strong>Additional Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; margin: 10px 0;">
              ${orderData.message.replace(/\n/g, '<br>')}
            </div>
          ` : ''}
        </div>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;">
            <strong>Status:</strong> Payment completed ✅
          </p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
          Submitted on: ${new Date().toLocaleString()}
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #6b7280; font-size: 12px;">
          This order was submitted after successful payment processing.
        </p>
      </div>
    </body>
    </html>
  `;

  return {
    to: ADMIN_EMAIL,
    subject: `New Order from ${orderData.name} - ${orderData.grade}`,
    html,
  };
}

/**
 * Generate tracksuit order notification email
 */
function generateTracksuitOrderEmail(orderData: OrderFormData) {
  const cartItemsList = orderData.cartItems.map(item => 
    `<li><strong>${item.itemName}</strong> (${item.category}) - Size: ${item.selectedSize} - Qty: ${item.quantity} - $${item.price * item.quantity}</li>`
  ).join('');
  
  const referralInfo = orderData.referralCode ? `
    <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #92400e;">Referral Information</h3>
      <p><strong>Referral Code Used:</strong> ${orderData.referralCode}</p>
      ${orderData.referredBy ? `<p><strong>Referred By:</strong> ${orderData.referredBy}</p>` : ''}
    </div>
  ` : '';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Tracksuit Order</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #059669;">🎉 New Tracksuit Order Received!</h2>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
          <h3 style="margin-top: 0; color: #065f46;">Customer Information</h3>
          
          <p><strong>Name:</strong> ${orderData.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${orderData.email}">${orderData.email}</a></p>
          <p><strong>WhatsApp:</strong> ${orderData.whatsapp}</p>
          <p><strong>Delivery Address:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 4px; margin: 10px 0;">
            ${orderData.deliveryAddress.replace(/\n/g, '<br>')}
          </div>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Order Details</h3>
          
          <p><strong>Total Items:</strong> ${orderData.totalQuantity}</p>
          <p><strong>Total Amount:</strong> $${orderData.totalPrice.toFixed(2)}</p>
          ${orderData.paymentId ? `<p><strong>Payment ID:</strong> ${orderData.paymentId}</p>` : ''}
          
          <h4 style="color: #374151; margin-top: 20px;">Items Ordered:</h4>
          <ul style="margin: 10px 0; padding-left: 20px;">
            ${cartItemsList}
          </ul>
        </div>
        
        ${referralInfo}
        
        <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #1e40af;">
            <strong>Status:</strong> Payment completed ✅
          </p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
          Order received on: ${new Date().toLocaleString()}
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #6b7280; font-size: 12px;">
          This tracksuit order was submitted after successful payment processing.
        </p>
      </div>
    </body>
    </html>
  `;

  return {
    to: ADMIN_EMAIL,
    subject: `New Tracksuit Order from ${orderData.name} - $${orderData.totalPrice.toFixed(2)}`,
    html,
  };
}

/**
 * Generate customer confirmation email
 */
function generateCustomerConfirmationEmail(orderData: OrderFormData) {
  const cartItemsList = orderData.cartItems.map(item => 
    `<li><strong>${item.itemName}</strong> (${item.category}) - Size: ${item.selectedSize} - Qty: ${item.quantity} - $${item.price * item.quantity}</li>`
  ).join('');
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #059669;">🎉 Thank You for Your Order!</h2>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
          <h3 style="margin-top: 0; color: #065f46;">Order Summary</h3>
          
          <p><strong>Order Date:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Total Items:</strong> ${orderData.totalQuantity}</p>
          <p><strong>Total Amount:</strong> $${orderData.totalPrice.toFixed(2)}</p>
          ${orderData.paymentId ? `<p><strong>Payment ID:</strong> ${orderData.paymentId}</p>` : ''}
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Items Ordered</h3>
          <ul style="margin: 10px 0; padding-left: 20px;">
            ${cartItemsList}
          </ul>
        </div>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #92400e;">Delivery Information</h3>
          <p><strong>Delivery Address:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 4px; margin: 10px 0;">
            ${orderData.deliveryAddress.replace(/\n/g, '<br>')}
          </div>
          <p style="margin-top: 15px;"><strong>Estimated Delivery:</strong> 4-7 business days</p>
        </div>
        
        <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #1e40af;">
            <strong>Status:</strong> Order confirmed and processing ✅
          </p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
          We'll send you updates on your order status. Thank you for choosing our tracksuits!
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #6b7280; font-size: 12px;">
          If you have unknown questions, please contact our customer support.
        </p>
      </div>
    </body>
    </html>
  `;

  return {
    to: orderData.email,
    subject: `Order Confirmation - $${orderData.totalPrice.toFixed(2)}`,
    html,
  };
}

/**
 * Send contact form notification email
 */
export async function sendContactNotification(contactData: ContactFormData) {
  const emailData = generateContactEmail(contactData);
  return await sendEmail(emailData);
}

/**
 * Send order notification email
 */
export async function sendOrderNotification(orderData: OrderFormData) {
  const emailData = generateOrderEmail(orderData);
  return await sendEmail(emailData);
}

/**
 * Send tracksuit order notification email to admin
 */
export async function sendTracksuitOrderNotification(orderData: OrderFormData) {
  const emailData = generateTracksuitOrderEmail(orderData);
  return await sendEmail(emailData);
}

/**
 * Send customer confirmation email
 */
export async function sendCustomerConfirmation(orderData: OrderFormData) {
  const emailData = generateCustomerConfirmationEmail(orderData);
  return await sendEmail(emailData);
} 
