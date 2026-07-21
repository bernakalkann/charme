import nodemailer from 'nodemailer';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// SMTP config from environment variables
const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = Number(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_FROM = process.env.SMTP_FROM || '"Charme Cosmetics" <noreply@charme.com>';

// Create Nodemailer Transporter
const transporter = SMTP_HOST
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    })
  : null;

// Base HTML Template Wrap
function getEmailLayout(title: string, bodyContent: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Playfair Display', 'Georgia', serif;
            background-color: #faf8f6;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border: 1px solid #e8e2dc;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          }
          .email-header {
            background-color: #121212;
            padding: 30px;
            text-align: center;
            border-bottom: 2px solid #c5a880;
          }
          .email-header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 26px;
            letter-spacing: 0.15em;
            font-weight: 300;
            text-transform: uppercase;
          }
          .email-body {
            padding: 40px 30px;
            color: #2b2b2b;
            line-height: 1.8;
            font-size: 14px;
            font-family: 'Inter', 'Helvetica', 'Arial', sans-serif;
          }
          .email-body h2 {
            font-family: 'Playfair Display', 'Georgia', serif;
            color: #121212;
            font-size: 20px;
            margin-top: 0;
            margin-bottom: 20px;
            font-weight: 600;
            border-bottom: 1px solid #f4e8e1;
            padding-bottom: 10px;
          }
          .button {
            display: inline-block;
            background-color: #121212;
            color: #ffffff !important;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 12px;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            margin: 25px 0;
            transition: background-color 0.2s ease;
          }
          .button:hover {
            background-color: #c5a880;
          }
          .order-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 13px;
          }
          .order-table th {
            text-align: left;
            padding: 10px;
            border-bottom: 1px solid #c5a880;
            font-weight: 600;
            color: #121212;
          }
          .order-table td {
            padding: 10px;
            border-bottom: 1px solid #f4e8e1;
            color: #555555;
          }
          .order-total {
            text-align: right;
            font-weight: bold;
            font-size: 15px;
            color: #121212;
            padding-top: 15px;
          }
          .email-footer {
            background-color: #fcfbf9;
            padding: 20px;
            text-align: center;
            font-size: 11px;
            color: #8c8279;
            border-top: 1px solid #f4e8e1;
          }
          .email-footer a {
            color: #c5a880;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>Charme</h1>
          </div>
          <div class="email-body">
            <h2>${title}</h2>
            ${bodyContent}
          </div>
          <div class="email-footer">
            <p>Bu e-posta <strong>Charme Lüks Kozmetik & Cilt Bakımı</strong> tarafından gönderilmiştir.</p>
            <p>&copy; ${new Date().getFullYear()} Charme. Tüm Hakları Saklıdır.</p>
            <p><a href="https://www.instagram.com/bernakalkann/">Instagram</a> | <a href="#">Gizlilik Politikası</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Global Send Helper
export async function sendHtmlEmail(to: string, subject: string, html: string) {
  if (transporter) {
    try {
      await transporter.sendMail({
        from: SMTP_FROM,
        to,
        subject,
        html,
      });
      console.log(`[EMAIL SENT SUCCESS] to: ${to}, subject: ${subject}`);
      return { success: true };
    } catch (error) {
      console.error('[EMAIL SEND ERROR]', error);
      return { success: false, error };
    }
  } else {
    // Local mock development output
    try {
      const devEmailsDir = path.join(process.cwd(), 'public', 'emails');
      await mkdir(devEmailsDir, { recursive: true });

      const sanitizedSubject = subject.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `${Date.now()}-${sanitizedSubject}.html`;
      const filepath = path.join(devEmailsDir, filename);

      await writeFile(filepath, html);
      console.log(`[EMAIL SANDBOX SAVED] To: ${to} | View: http://localhost:3002/emails/${filename}`);
      return { success: true, sandboxUrl: `/emails/${filename}` };
    } catch (err) {
      console.error('[EMAIL SANDBOX SAVE ERROR]', err);
      return { success: false, error: err };
    }
  }
}

// 1. Welcome Email
export async function sendWelcomeEmail(userEmail: string, userName: string) {
  const title = 'Charme Dünyasına Hoş Geldiniz';
  const content = `
    <p>Merhaba Sevgili ${userName},</p>
    <p>Güzelliğin ve temiz cilt bakımının eşsiz dünyasını bir araya getiren <strong>Charme</strong>'a adım attığınız için mutluluk duyuyoruz.</p>
    <p>Hesabınız başarıyla oluşturulmuştur. Şimdi en premium formülleri keşfetmek ve lüks alışveriş deneyimini yaşamak için sitemizi ziyaret edebilirsiniz.</p>
    <center>
      <a href="http://localhost:3001" class="button">Alışverişe Başla</a>
    </center>
    <p>Herhangi bir sorunuz olduğunda bizimle iletişime geçmekten çekinmeyin.</p>
    <p>Sevgilerimizle,<br>Charme Ekibi</p>
  `;
  const html = getEmailLayout(title, content);
  return sendHtmlEmail(userEmail, title, html);
}

// 2. Order Confirmation Email
export async function sendOrderConfirmationEmail(userEmail: string, order: any) {
  const title = 'Siparişiniz Alındı';
  
  let itemsHtml = '';
  if (order.items && Array.isArray(order.items)) {
    order.items.forEach((item: any) => {
      itemsHtml += `
        <tr>
          <td>${item.productName} (${item.variantName})</td>
          <td>${item.quantity} Adet</td>
          <td style="text-align: right;">${item.price} TL</td>
        </tr>
      `;
    });
  }

  const content = `
    <p>Merhaba,</p>
    <p>Siparişiniz başarıyla alınmış ve onaylanmıştır. Sipariş detaylarınızı aşağıda bulabilirsiniz:</p>
    <p><strong>Sipariş Numarası:</strong> #${order.id.slice(-8).toUpperCase()}</p>
    
    <table class="order-table">
      <thead>
        <tr>
          <th>Ürün</th>
          <th>Adet</th>
          <th style="text-align: right;">Fiyat</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <div class="order-total">
      Toplam Ödenen: ${order.totalAmount} TL
    </div>

    <p style="margin-top: 25px;"><strong>Teslimat Adresi:</strong><br>
    ${order.shippingAddress?.fullName}<br>
    ${order.shippingAddress?.addressLine}, ${order.shippingAddress?.city}/${order.shippingAddress?.state}</p>

    <center>
      <a href="http://localhost:3001/profile" class="button">Siparişimi Takip Et</a>
    </center>
    <p>Bizi tercih ettiğiniz için teşekkür ederiz.</p>
  `;
  const html = getEmailLayout(title, content);
  return sendHtmlEmail(userEmail, `Charme Sipariş Onayı - #${order.id.slice(-8).toUpperCase()}`, html);
}

// 3. Shipping Status Update Email
export async function sendShippingUpdateEmail(userEmail: string, order: any, trackingCode: string) {
  const title = 'Siparişiniz Kargoya Verildi';
  const content = `
    <p>Merhaba,</p>
    <p>Harika bir haber! <strong>#${order.id.slice(-8).toUpperCase()}</strong> numaralı siparişiniz hazırlanmış ve kargo firmasına teslim edilmiştir.</p>
    
    <p><strong>Kargo Takip Numarası:</strong> <code style="background-color: #f4e8e1; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${trackingCode}</code></p>
    
    <p>Kargonuzun nerede olduğunu öğrenmek ve teslimat sürecini takip etmek için aşağıdaki butona tıklayabilirsiniz:</p>
    
    <center>
      <a href="http://localhost:3001/profile" class="button">Kargo Takip</a>
    </center>
    
    <p>Ürünleriniz ulaştığında bizimle deneyimlerinizi paylaşmayı unutmayın!</p>
    <p>Sevgilerimizle,<br>Charme Ekibi</p>
  `;
  const html = getEmailLayout(title, content);
  return sendHtmlEmail(userEmail, `Siparişiniz Kargolandı! - #${order.id.slice(-8).toUpperCase()}`, html);
}

// 4. Back in Stock Notification Email
export async function sendStockNotificationEmail(userEmail: string, productName: string, productUrl: string) {
  const title = 'Beklediğiniz Ürün Tekrar Stokta!';
  const content = `
    <p>Merhaba,</p>
    <p>Stoklarının yenilenmesini heyecanla beklediğiniz <strong>${productName}</strong> ürünümüz tekrar satışa açılmıştır!</p>
    <p>Sınırlı sayıdaki stok tükenmeden hemen satın almak için aşağıdaki bağlantıya tıklayabilirsiniz:</p>
    
    <center>
      <a href="${productUrl}" class="button">Ürünü İncele</a>
    </center>
    
    <p>Keyifli alışverişler dileriz.</p>
    <p>Sevgilerimizle,<br>Charme Ekibi</p>
  `;
  const html = getEmailLayout(title, content);
  return sendHtmlEmail(userEmail, `Stoklar Yenilendi: ${productName}`, html);
}
