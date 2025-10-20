export const verifyEmailTemplate = (verifyUrl, appName) => {
  return `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
      <h2 style="color: #333333; text-align: center;">Verify Your Email</h2>
      <p style="color: #555555; line-height: 1.6;">
        Thank you for signing up for <strong>${appName}</strong>!  
        To complete your registration, please confirm your email address by clicking the button below.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" 
           style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
          Verify Email
        </a>
      </div>
      <p style="color: #777; font-size: 14px;">
        If you did not sign up for ${appName}, you can safely ignore this email.
      </p>
      <p style="color: #aaa; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
    </div>
  </div>
  `;
}

export const forgotPasswordTemplate = (resetUrl, appName = "MySaaS") => {
  return `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
      <h2 style="color: #333333; text-align: center;">Reset Your Password</h2>
      <p style="color: #555555; line-height: 1.6;">
        We received a request to reset your password for your <strong>${appName}</strong> account.  
        Click the button below to set a new password. This link will expire in 15 minutes for your security.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" 
           style="background-color: #007BFF; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
          Reset Password
        </a>
      </div>
      <p style="color: #777; font-size: 14px;">
        If you did not request a password reset, you can ignore this message — your password will remain unchanged.
      </p>
      <p style="color: #aaa; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
    </div>
  </div>
  `;
}