import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  try {
    const { data, error } = await resend.emails.send({
      // For testing:
      from: "Mango Support <support@mangoreview.ai>",

      // After verifying your domain, change to:
      // from: "Mango Support <support@mango.umaidhamid.in>",

      to,
      subject,
      html,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};
  //  Verify Account Email

export const sendVerificationEmail = async (
  to:        string,
  verifyUrl: string
) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
      <h2 style="margin:0 0 8px;color:#111827;">Set Your Password</h2>
      <p style="margin:0 0 24px;color:#6b7280;font-size:14px;line-height:1.6;">
        Welcome to Mango. Your account is almost ready. Create your password to activate your account securely.
      </p>
      <a href="${verifyUrl}" target="_blank"
        style="display:inline-block;padding:12px 28px;background:#111827;color:#ffffff;font-size:14px;font-weight:600;border-radius:8px;text-decoration:none;">
        Set Password
      </a>
      <p style="margin:24px 0 8px;font-size:12px;color:#9ca3af;">If the button doesn't work, copy and paste this link:</p>
      <p style="margin:0 0 16px;font-size:12px;color:#6b7280;word-break:break-all;">${verifyUrl}</p>
      <p style="margin:0;font-size:12px;color:#9ca3af;">This link expires in 10 minutes.</p>
      <p style="margin:8px 0 0;font-size:12px;color:#9ca3af;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;
  return await sendEmail(to, "Verify your account", html);
};

export const sendResetPasswordEmail = async (
  to:       string,
  resetUrl: string
) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
      <h2 style="margin:0 0 8px;color:#111827;">Reset Your Password</h2>
      <p style="margin:0 0 24px;color:#6b7280;font-size:14px;line-height:1.6;">
        We received a request to reset your password. Click the button below to continue securely.
      </p>
      <a href="${resetUrl}" target="_blank"
        style="display:inline-block;padding:12px 28px;background:#111827;color:#ffffff;font-size:14px;font-weight:600;border-radius:8px;text-decoration:none;">
        Reset Password
      </a>
      <p style="margin:24px 0 8px;font-size:12px;color:#9ca3af;">If the button doesn't work, copy and paste this link:</p>
      <p style="margin:0 0 16px;font-size:12px;color:#6b7280;word-break:break-all;">${resetUrl}</p>
      <p style="margin:0;font-size:12px;color:#9ca3af;">This link expires in 10 minutes.</p>
      <p style="margin:8px 0 0;font-size:12px;color:#9ca3af;">If you didn't request this reset, you can safely ignore this email.</p>
    </div>
  `;
  return await sendEmail(to, "Reset your password", html);
};

export const sendManagerInviteEmail = async (
  to:           string,
  locationName: string,
  verifyUrl:    string
) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
      <h2 style="margin:0 0 8px;color:#111827;">You've been invited as a Manager</h2>
      <p style="margin:0 0 6px;color:#6b7280;font-size:14px;">You have been invited to manage</p>
      <p style="margin:0 0 24px;font-size:16px;font-weight:700;color:#111827;">${locationName}</p>
      <p style="margin:0 0 24px;color:#6b7280;font-size:14px;line-height:1.6;">
        Click the button below to set your password and accept the invitation.
      </p>
      <a href="${verifyUrl}" target="_blank"
        style="display:inline-block;padding:12px 28px;background:#111827;color:#ffffff;font-size:14px;font-weight:600;border-radius:8px;text-decoration:none;">
        Accept Invite & Set Password
      </a>
      <p style="margin:24px 0 8px;font-size:12px;color:#9ca3af;">If the button doesn't work, copy and paste this link:</p>
      <p style="margin:0 0 16px;font-size:12px;color:#6b7280;word-break:break-all;">${verifyUrl}</p>
      <p style="margin:0;font-size:12px;color:#9ca3af;">This link expires in 10 minutes.</p>
      <p style="margin:8px 0 0;font-size:12px;color:#9ca3af;">If you didn't expect this, you can safely ignore this email.</p>
    </div>
  `;
  return await sendEmail(to, `You've been invited to manage ${locationName}`, html);
};

export const sendExistingUserInviteEmail = async (
  to:           string,
  locationName: string,
  verifyUrl:    string
) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
      <h2 style="margin:0 0 8px;color:#111827;">Permission Request</h2>
      <p style="margin:0 0 6px;color:#6b7280;font-size:14px;">You have been invited to become a manager for</p>
      <p style="margin:0 0 24px;font-size:16px;font-weight:700;color:#111827;">${locationName}</p>
      <p style="margin:0 0 24px;color:#6b7280;font-size:14px;line-height:1.6;">
        Click the button below to accept this invitation.
      </p>
      <a href="${verifyUrl}" target="_blank"
        style="display:inline-block;padding:12px 28px;background:#111827;color:#ffffff;font-size:14px;font-weight:600;border-radius:8px;text-decoration:none;">
        Accept Invitation
      </a>
      <p style="margin:24px 0 8px;font-size:12px;color:#9ca3af;">If the button doesn't work, copy and paste this link:</p>
      <p style="margin:0 0 16px;font-size:12px;color:#6b7280;word-break:break-all;">${verifyUrl}</p>
      <p style="margin:0;font-size:12px;color:#9ca3af;">This link expires in 10 minutes.</p>
      <p style="margin:8px 0 0;font-size:12px;color:#9ca3af;">If you didn't expect this invitation, you can safely ignore this email.</p>
    </div>
  `;
  return await sendEmail(to, `Permission request to manage ${locationName}`, html);
};