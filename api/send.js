import { Resend } from 'resend';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { email, service, preferredDate, preferredTime, address, additionalNotes } = req.body;

  try {
    await resend.emails.send({
  from: 'Appointments <info@appointment.trusttvmounting.com>',
  to: ['trusttvmountingservices@gmail.com', email],
  subject: `New Appointment: ${service}`,
  html: `<p><strong>Email:</strong> ${email}</p>
         <p><strong>Service:</strong> ${service}</p>
         <p><strong>Date/Time:</strong> ${preferredDate} at ${preferredTime}</p>
         <p><strong>Address:</strong> ${address}</p>
         <p><strong>Notes:</strong> ${additionalNotes || 'None'}</p>`
});
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
