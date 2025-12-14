import transporter from '../config/email.js'

class EmailService {
  async sendTicketEmail({ to, performance, ticket, qrCodeImage }) {
    const emailHtml = this.buildEmailTemplate({ performance, ticket })

    // Convert data URL to buffer for attachment
    const base64Data = qrCodeImage.replace(/^data:image\/\w+;base64,/, '')
    const qrBuffer = Buffer.from(base64Data, 'base64')

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: to,
      subject: `Vaša ulaznica za predstavu: ${performance.name}`,
      html: emailHtml,
      attachments: [
        {
          filename: 'qr-code.png',
          content: qrBuffer,
          cid: 'qrcode@ticket'
        }
      ]
    }

    try {
      const info = await transporter.sendMail(mailOptions)
      console.log('Email sent:', info.messageId)
      return { success: true, messageId: info.messageId }
    } catch (error) {
      console.error('Email send error:', error)
      throw new Error('Failed to send email')
    }
  }

  buildEmailTemplate({ performance, ticket }) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vaša ulaznica</title>
</head>
<body style="margin: 0; padding: 0; background: #0b1120; font-family: 'Inter', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td style="text-align: center; padding-bottom: 30px;">
        <h1 style="color: #e2e8f0; margin: 0;">Vaša ulaznica</h1>
      </td>
    </tr>
    <tr>
      <td style="background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(148, 163, 184, 0.35); border-radius: 16px; padding: 30px;">
        <h2 style="color: #f8fafc; margin: 0 0 20px;">${performance.name}</h2>
        <table style="width: 100%; color: #cbd5e1; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0;"><strong>Datum:</strong></td>
            <td style="text-align: right;">${performance.start_date}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Vreme:</strong></td>
            <td style="text-align: right;">${performance.satnica}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Kategorija:</strong></td>
            <td style="text-align: right;">${performance.category}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>ID ulaznice:</strong></td>
            <td style="text-align: right; font-family: monospace; font-size: 12px;">${ticket.id}</td>
          </tr>
        </table>
        <div style="text-align: center; margin-top: 30px; padding: 20px; background: white; border-radius: 12px;">
          <img src="cid:qrcode@ticket" alt="QR Code" style="max-width: 300px; width: 100%; height: auto; display: block; margin: 0 auto;" />
        </div>
        <p style="color: #94a3b8; font-size: 13px; text-align: center; margin-top: 20px;">
          Molimo prinesite ovaj QR kod na ulazu u pozorište.
        </p>
      </td>
    </tr>
    <tr>
      <td style="text-align: center; padding-top: 30px; color: #64748b; font-size: 12px;">
        <p>© 2024 Pozorište. Sva prava zadržana.</p>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  }
}

export default new EmailService()
