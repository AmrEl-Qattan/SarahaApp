export const confirmEmailTemplate = ({link , userName} = {})=>{
    return `<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <title>Email Confirmation</title>
    <style>
      body {
        background-color: #f4f4f7;
        font-family: Arial, Helvetica, sans-serif;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        background: #2d89ef;
        padding: 20px;
        text-align: center;
        color: #fff;
      }
      .content {
        padding: 30px;
        color: #333;
        font-size: 16px;
        line-height: 1.6;
      }
      .btn {
        display: inline-block;
        margin-top: 20px;
        padding: 12px 25px;
        background: #2d89ef;
        color: #fff;
        font-size: 16px;
        text-decoration: none;
        border-radius: 6px;
      }
      .footer {
        margin-top: 30px;
        padding: 20px;
        text-align: center;
        font-size: 14px;
        color: #888;
        border-top: 1px solid #eee;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <h1>Sarahaha App</h1>
      </div>

      <!-- Content -->
      <div class="content">
        <h2>Hi ${userName},</h2>
        <p>
          Thanks for signing up! Please confirm your email address by clicking
          the button below. This helps us keep your account secure.
        </p>

        <a href="${link}" class="btn">Confirm Email</a>

        <p>
          If you did not create an account, please ignore this email.
        </p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>&copy; 2025 Sarahaha App. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`
}