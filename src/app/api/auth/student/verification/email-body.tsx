export const emailBody = (verificationId: string) => `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      color: #333;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #007BFF;
      padding: 20px;
      text-align: center;
    }
    .header img {
      max-width: 150px;
    }
    .content {
      padding: 20px;
      text-align: center;
    }
    .content h1 {
      margin-top: 0;
      color: #007BFF;
    }
    .content p {
      line-height: 1.5;
      font-size: 16px;
    }
    .actions {
      margin: 20px 0;
    }
    .actions a {
      display: inline-block;
      margin: 0 10px;
      padding: 10px 20px;
      font-size: 16px;
      color: #fff;
      text-decoration: none;
      border-radius: 4px;
    }
    .actions .confirm {
      background-color: #28a745;
    }
    .actions .abort {
      background-color: #dc3545;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 10px;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <img src="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/logo.png" alt="Logo">
    </div>
    <div class="content">
      <h1>Action Required</h1>
      <p>Please review the details below and take the appropriate action. Ensure that you understand the consequences of your decision before proceeding.</p>
      <div class="actions">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/verification/${verificationId}" class="confirm">Confirm</a>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/abort" class="abort">Abort</a>
      </div>
      <p><strong>Note:</strong> If you did not request this, please ignore this email or contact support immediately.</p>
    </div>
    <div class="footer">
      &copy; 2024 Campus Orbit. All rights reserved.
    </div>
  </div>
</body>
</html>
`
