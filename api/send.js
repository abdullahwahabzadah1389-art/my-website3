import { Resend } from 'resend';

// Helper function to convert 24h time to 12h AM/PM format
function formatTime12h(timeStr) {
  if (!timeStr) return 'Not provided';
  const [hoursStr, minutesStr] = timeStr.split(':');
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr || '00';
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes} ${ampm}`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { name, phone, email, service, preferredDate, preferredTime, address, additionalNotes } = req.body;

  const formattedTime = formatTime12h(preferredTime);

  // Get current Central Time (US) for the submission timestamp
  const submissionTimestamp = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "medium",
    timeStyle: "short"
  });

  try {
    await resend.emails.send({
      from: 'Trust TV Mounting & Home Solutions <info@appointment.trusttvmounting.com>',
      to: ['trusttvmountingservices@gmail.com', email],
      subject: `New Appointment Request - ${name || 'Customer'}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0f172a; padding: 20px; text-align: left;">
            <h2 style="color: #ffffff; margin: 0; font-size: 20px;">
              <span style="color: #ffffff;">Trust TV Mounting</span> <span style="color: #fbbf24;">& Home Solutions</span>
            </h2>
          </div>
          <div style="padding: 24px; background-color: #ffffff;">
            <h3 style="margin-top: 0; color: #0f172a; font-size: 22px; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px;">New Appointment Request</h3>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 140px; color: #334155;">Submitted On:</td>
                <td style="padding: 8px 0; color: #64748b; font-style: italic;">${submissionTimestamp}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #334155;">Name:</td>
                <td style="padding: 8px 0; color: #0f172a;">${name || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #334155;">Phone Number:</td>
                <td style="padding: 8px 0; color: #0f172a;">${phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #334155;">Email:</td>
                <td style="padding: 8px 0; color: #0f172a;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #334155;">Service:</td>
                <td style="padding: 8px 0; color: #0f172a;">${service}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #334155;">Preferred date:</td>
                <td style="padding: 8px 0; color: #0f172a;">${preferredDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #334155;">Preferred time:</td>
                <td style="padding: 8px 0; color: #0f172a;">${formattedTime}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #334155;">Address:</td>
                <td style="padding: 8px 0; color: #0f172a;">${address}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #334155;">Notes:</td>
                <td style="padding: 8px 0; color: #0f172a;">${additionalNotes || 'None'}</td>
              </tr>
            </table>
          </div>
          <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
            Trust TV Mounting & Home Solutions • Serving the DFW Metroplex • (469) 793-3130
          </div>
        </div>
      `
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
