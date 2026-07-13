import { Resend } from 'resend';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { email, service, date, time, address, notes } = req.body;

  try {
    await resend.emails.send({
      from: 'Appointments <onboarding@resend.dev>',
      to: 'abdullahwahab1389@gmail.com',
      subject: `New Appointment: ${service}`,
      html: `<p><strong>Email:</strong> ${email}</p>
             <p><strong>Service:</strong> ${service}</p>
             <p><strong>Date/Time:</strong> ${date} at ${time}</p>
             <p><strong>Address:</strong> ${address}</p>
             <p><strong>Notes:</strong> ${notes}</p>`,
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
