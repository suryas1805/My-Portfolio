export const adminNotificationTemplate = (name, email, message) => `
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f9fc;padding:40px 0;font-family:Arial, sans-serif;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.05);">
        
        <tr>
          <td style="background:#2563eb;padding:20px;text-align:center;color:#ffffff;font-size:22px;font-weight:bold;">
            🔔 New Portfolio Enquiry
          </td>
        </tr>

        <tr>
          <td style="padding:30px;">
            <p style="font-size:16px;color:#1f2937;margin:0 0 15px 0;">
              You received a new enquiry from your portfolio website.
            </p>

            <div style="background:#f3f4f6;padding:15px;border-radius:8px;margin-bottom:20px;">
              <p style="margin:0;font-size:15px;"><strong>Name:</strong> ${name}</p>
              <p style="margin:5px 0;font-size:15px;"><strong>Email:</strong> ${email}</p>
              <p style="margin:5px 0;font-size:15px;"><strong>Message:</strong></p>
              <p style="margin:0;font-size:15px;color:#374151;">${message}</p>
            </div>

            <p style="font-size:14px;color:#6b7280;">
              Please reply to this enquiry from your admin dashboard if needed.
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
`;

export const userAutoReplyTemplate = (name) => `
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f9fc;padding:40px 0;font-family:Arial, sans-serif;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.05);">

        <tr>
          <td style="background:#10b981;padding:20px;text-align:center;color:#ffffff;font-size:22px;font-weight:bold;">
            💬 Thank You for Contacting Me!
          </td>
        </tr>

        <tr>
          <td style="padding:30px;">
            <p style="font-size:16px;color:#1f2937;margin:0;">
              Hello <strong>${name}</strong>,
            </p>

            <p style="font-size:15px;color:#4b5563;margin:15px 0;">
              Thank you for reaching out through my portfolio website.  
              I have received your message and will get back to you shortly after reviewing your details.
            </p>

            <p style="font-size:15px;color:#4b5563;">
              I appreciate your interest, and I’ll make sure your request gets the proper attention.
            </p>

            <p style="font-size:16px;color:#1f2937;margin-top:25px;">
              Regards,<br />
              <strong>Surya S</strong>
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
`;

export const adminReplyTemplate = (name, replyMessage) => `
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f9fc;padding:40px 0;font-family:Arial, sans-serif;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.05);">

        <tr>
          <td style="background:#3b82f6;padding:20px;text-align:center;color:#ffffff;font-size:22px;font-weight:bold;">
            📩 Response to Your Enquiry
          </td>
        </tr>

        <tr>
          <td style="padding:30px;">
            <p style="font-size:16px;color:#1f2937;margin:0;">
              Hi <strong>${name}</strong>,
            </p>

            <p style="font-size:15px;color:#4b5563;margin:15px 0;">
              Thank you for contacting me earlier. Below is my reply to your enquiry:
            </p>

            <div style="background:#eef2ff;padding:18px;border-left:4px solid #6366f1;border-radius:6px;margin-bottom:25px;">
              <p style="margin:0;font-size:15px;color:#374151;">${replyMessage}</p>
            </div>

            <p style="font-size:15px;color:#4b5563;">
              If you have any more questions, please feel free to reply to this email.
            </p>

            <p style="font-size:16px;color:#1f2937;margin-top:25px;">
              Regards,<br />
              <strong>Surya S</strong>
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
`;
