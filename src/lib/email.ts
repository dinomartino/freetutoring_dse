import nodemailer from 'nodemailer';

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
}

// Create reusable transporter
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    // Check if Gmail credentials are configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.warn('Gmail credentials not configured. Emails will only be logged to console.');
      return null;
    }

    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
}

/**
 * Send email using Gmail via Nodemailer
 * Falls back to console logging if Gmail is not configured
 */
export async function sendEmail(template: EmailTemplate): Promise<void> {
  try {
    const mailer = getTransporter();

    if (!mailer) {
      // Development mode - log to console
      console.log('📧 Email would be sent:');
      console.log('To:', template.to);
      console.log('Subject:', template.subject);
      console.log('---');
      return Promise.resolve();
    }

    // Send actual email via Gmail
    const info = await mailer.sendMail({
      from: `"FreeTutor" <${process.env.GMAIL_USER}>`,
      to: template.to,
      subject: template.subject,
      html: template.html,
    });

    console.log('✅ Email sent successfully:', info.messageId);
    return Promise.resolve();
  } catch (error) {
    console.error('❌ Error sending email:', error);
    // Don't throw error - we don't want email failures to break the app
    return Promise.resolve();
  }
}

/**
 * Email template for student registration
 */
export function getStudentRegistrationEmail(
  fullName: string,
  email: string
): EmailTemplate {
  return {
    to: email,
    subject: 'FreeTutor - 學生註冊申請已收到',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>FreeTutor</h1>
            <p>免費導師配對平台</p>
          </div>
          <div class="content">
            <h2>您好，${fullName}！</h2>
            <p>感謝您在 FreeTutor 註冊成為學生用戶。</p>
            <p>我們已收到您的註冊申請，我們的管理團隊將在 <strong>3-5 個工作天</strong>內審核您提交的文件。</p>

            <h3>下一步:</h3>
            <ul>
              <li>我們會仔細審核您提交的特殊需求證明文件</li>
              <li>審核完成後，您會收到電子郵件通知</li>
              <li>獲得批准後，您就可以開始尋找合適的導師</li>
            </ul>

            <p>如有任何疑問，請隨時聯絡我們。</p>
          </div>
          <div class="footer">
            <p>© 2024 FreeTutor. 保留所有權利。</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

/**
 * Email template for tutor registration
 */
export function getTutorRegistrationEmail(
  fullName: string,
  email: string
): EmailTemplate {
  return {
    to: email,
    subject: 'FreeTutor - 導師註冊申請已收到',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>FreeTutor</h1>
            <p>免費導師配對平台</p>
          </div>
          <div class="content">
            <h2>您好，${fullName}！</h2>
            <p>感謝您在 FreeTutor 註冊成為義務導師。</p>
            <p>我們已收到您的註冊申請，我們的管理團隊將在 <strong>3-5 個工作天</strong>內審核您提交的文件。</p>

            <h3>下一步:</h3>
            <ul>
              <li>我們會仔細審核您提交的學歷證明和成績文件</li>
              <li>審核完成後，您會收到電子郵件通知</li>
              <li>獲得批准後，您的個人資料將顯示在導師列表中</li>
              <li>學生可以瀏覽您的資料並與您聯絡</li>
            </ul>

            <p>感謝您願意成為義務導師，幫助有特殊需求的學生！</p>
          </div>
          <div class="footer">
            <p>© 2024 FreeTutor. 保留所有權利。</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

/**
 * Email template for application approval
 */
export function getApprovalEmail(
  fullName: string,
  email: string,
  userType: 'student' | 'tutor'
): EmailTemplate {
  const isStudent = userType === 'student';

  return {
    to: email,
    subject: `FreeTutor - 您的${isStudent ? '學生' : '導師'}申請已獲批准`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .success { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 恭喜您！</h1>
            <p>您的申請已獲批准</p>
          </div>
          <div class="content">
            <h2>您好，${fullName}！</h2>
            <div class="success">
              <strong>好消息！</strong>您的 FreeTutor ${isStudent ? '學生' : '導師'}申請已經通過審核。
            </div>

            ${isStudent ? `
              <h3>您現在可以:</h3>
              <ul>
                <li>瀏覽所有已驗證的導師資料</li>
                <li>查看導師的教學科目和時間安排</li>
                <li>向合適的導師發送配對請求</li>
                <li>與導師建立聯繫，開始學習之旅</li>
              </ul>
              <p style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/tutors" class="button">
                  開始尋找導師
                </a>
              </p>
            ` : `
              <h3>您現在可以:</h3>
              <ul>
                <li>您的個人資料已在導師列表中公開</li>
                <li>學生可以查看您的教學科目和時間安排</li>
                <li>接收來自學生的配對請求</li>
                <li>與學生建立聯繫，開始提供幫助</li>
              </ul>
              <p style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" class="button">
                  查看我的儀表板
                </a>
              </p>
            `}

            <p>再次感謝您加入 FreeTutor 社群！</p>
          </div>
          <div class="footer">
            <p>© 2024 FreeTutor. 保留所有權利。</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

/**
 * Email template for application rejection
 */
export function getRejectionEmail(
  fullName: string,
  email: string,
  userType: 'student' | 'tutor',
  notes?: string
): EmailTemplate {
  const isStudent = userType === 'student';

  return {
    to: email,
    subject: `FreeTutor - 關於您的${isStudent ? '學生' : '導師'}申請`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          .info { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>FreeTutor</h1>
            <p>申請審核結果</p>
          </div>
          <div class="content">
            <h2>您好，${fullName}！</h2>
            <p>感謝您對 FreeTutor 的興趣和提交申請。</p>
            <p>經過仔細審核，我們很遺憾地通知您，您的${isStudent ? '學生' : '導師'}申請暫時未能通過。</p>

            ${notes ? `
              <div class="info">
                <strong>審核意見：</strong><br>
                ${notes}
              </div>
            ` : ''}

            <h3>您可以:</h3>
            <ul>
              <li>檢查並補充所需文件</li>
              <li>確保文件清晰可讀且符合要求</li>
              <li>重新提交申請</li>
            </ul>

            <p>如有任何疑問，歡迎與我們聯絡。我們期待再次收到您的申請！</p>
          </div>
          <div class="footer">
            <p>© 2024 FreeTutor. 保留所有權利。</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}
