'use server'

import nodemailer from 'nodemailer'

interface ConsultationPayload {
  name: string
  email: string
  phone: string
  message: string
  // estimation context
  service: string
  projectType: string
  features: string[]
  companyType: string
  priceMin: number | null
  priceMax: number | null
}

export async function sendConsultation(payload: ConsultationPayload) {
  const { name, email, phone, message, service, projectType, features, companyType, priceMin, priceMax } = payload

  if (!name?.trim() || !email?.trim()) {
    return { ok: false, error: 'Name and email are required.' }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const fmtPrice = (n: number) => n.toLocaleString('fr-DZ') + ' DZD'

  const priceRange =
    priceMin != null && priceMax != null
      ? `${fmtPrice(priceMin)} — ${fmtPrice(priceMax)}`
      : 'Not calculated'

  const featuresList =
    features.length > 0
      ? features.map(f => `  • ${f}`).join('\n')
      : '  None selected'

  const text = `
New Consultation Request
========================

Contact Information
-------------------
Name:    ${name}
Email:   ${email}
Phone:   ${phone || 'Not provided'}

Message
-------
${message || 'No message provided.'}

Project Estimation
------------------
Service:       ${service || '—'}
Project Type:  ${projectType || '—'}
Company Type:  ${companyType || '—'}
Features:
${featuresList}

Estimated Budget Range: ${priceRange}

---
Sent from TexFix Studio website
`.trim()

  const html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #1a1a2e;">
  <div style="background: linear-gradient(160deg, #1e3a5f 0%, #0a0a0a 100%); padding: 32px 28px 24px;">
    <h1 style="margin: 0 0 4px; font-size: 20px; font-weight: 700; color: #ffffff;">New Consultation Request</h1>
    <p style="margin: 0; font-size: 13px; color: #60a5fa;">via TexFix Studio Estimator</p>
  </div>

  <div style="padding: 24px 28px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px 0; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 110px; vertical-align: top;">Name</td>
        <td style="padding: 10px 0; color: #e4e4e7; font-size: 14px;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Email</td>
        <td style="padding: 10px 0; color: #e4e4e7; font-size: 14px;"><a href="mailto:${email}" style="color: #60a5fa; text-decoration: none;">${email}</a></td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Phone</td>
        <td style="padding: 10px 0; color: #e4e4e7; font-size: 14px;">${phone || '<span style="color:#52525b;">Not provided</span>'}</td>
      </tr>
    </table>

    ${message ? `
    <div style="margin: 20px 0; padding: 16px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
      <p style="margin: 0 0 8px; font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 1px;">Message</p>
      <p style="margin: 0; font-size: 14px; color: #d4d4d8; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
    </div>
    ` : ''}

    <div style="margin-top: 20px; padding: 20px; background: linear-gradient(160deg, rgba(59,130,246,0.12) 0%, rgba(0,0,0,0.3) 100%); border-radius: 8px; border: 1px solid rgba(59,130,246,0.2);">
      <p style="margin: 0 0 16px; font-size: 12px; color: #60a5fa; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Project Estimation</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #71717a; font-size: 12px; width: 110px; vertical-align: top;">Service</td>
          <td style="padding: 8px 0; color: #e4e4e7; font-size: 14px;">${service || '—'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #71717a; font-size: 12px; vertical-align: top;">Project Type</td>
          <td style="padding: 8px 0; color: #e4e4e7; font-size: 14px;">${projectType || '—'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #71717a; font-size: 12px; vertical-align: top;">Company</td>
          <td style="padding: 8px 0; color: #e4e4e7; font-size: 14px;">${companyType || '—'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #71717a; font-size: 12px; vertical-align: top;">Features</td>
          <td style="padding: 8px 0; color: #e4e4e7; font-size: 14px;">${features.length > 0 ? features.join(', ') : 'None selected'}</td>
        </tr>
      </table>
      <div style="margin-top: 16px; padding: 16px; background: rgba(59,130,246,0.1); border-radius: 8px; text-align: center;">
        <p style="margin: 0 0 4px; font-size: 11px; color: #60a5fa; text-transform: uppercase; letter-spacing: 1px;">Estimated Budget</p>
        <p style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff;">${priceRange}</p>
      </div>
    </div>
  </div>

  <div style="padding: 16px 28px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
    <p style="margin: 0; font-size: 11px; color: #52525b;">Sent from TexFix Studio website</p>
  </div>
</div>
  `.trim()

  try {
    await transporter.sendMail({
      from: `"TexFix Studio" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'texfix.info@gmail.com',
      replyTo: email,
      subject: `New Consultation: ${name} — ${service || 'General'}`,
      text,
      html,
    })

    return { ok: true }
  } catch (err) {
    console.error('Email send failed:', err)
    return { ok: false, error: 'Failed to send. Please try again or contact us directly.' }
  }
}
