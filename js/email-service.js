class EmailService {
  static async sendResetEmail(email, token) {
    // Simulate email sending
    console.log(`Reset email sent to ${email} with token: ${token}`);

    // Store token in localStorage (in production, this would be in a database)
    const resetTokens = JSON.parse(localStorage.getItem("resetTokens") || "{}");
    resetTokens[email] = {
      token: token,
      expiry: Date.now() + 30 * 60 * 1000, // 30 minutes expiry
    };
    localStorage.setItem("resetTokens", JSON.stringify(resetTokens));

    return true;
  }

  static async sendVerificationEmail(email, code) {
    // Simulate sending verification code
    console.log(`Verification code sent to ${email}: ${code}`);

    // Store verification code
    const verificationCodes = JSON.parse(
      localStorage.getItem("verificationCodes") || "{}",
    );
    verificationCodes[email] = {
      code: code,
      expiry: Date.now() + 10 * 60 * 1000, // 10 minutes expiry
    };
    localStorage.setItem(
      "verificationCodes",
      JSON.stringify(verificationCodes),
    );

    return true;
  }
}
