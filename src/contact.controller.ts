import { Controller, Post, Body, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('contact')
export class ContactController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('send')
  async sendInquiry(@Body() body: any) {
    // --- STEP 1: Check if request arrived ---
    console.log("📩 Request received at /contact/send");
    console.log("📦 Data Body:", body);

    const { fullName, email, phone, company, services, message } = body;

    // Safety check for services array
    const selectedServices = Array.isArray(services) ? services.join(", ") : (services || "Not Specified");

    try {
      // --- STEP 2: Sending Admin Email ---
      console.log("⏳ Sending Email to Admin...");
      await this.mailerService.sendMail({
        to: 'digimediaskill@gmail.com', 
        subject: `🚀 New Project Inquiry: ${company || 'Client'}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #10B981; border-radius: 10px;">
            <h2 style="color: #10B981;">New Inquiry from Website</h2>
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone }</p>
            <p><strong>Services:</strong> ${selectedServices}</p>
            <p><strong>Message:</strong> ${message}</p>
          </div>
        `,
      });
      console.log("✅ Admin Email Sent!");

      // --- STEP 3: Sending Client Auto-Reply ---
      console.log(`⏳ Sending Auto-reply to ${email}...`);
      await this.mailerService.sendMail({
        to: email, 
        subject: `Thank you for contacting Digi Media Skill! ✨`,
        html: `
          <div style="font-family: sans-serif; padding: 30px; border-radius: 20px; background-color: #fafafa; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee;">
            <h1 style="color: #10B981; text-align: center;">Hello ${fullName}!</h1>
            <p style="font-size: 16px; line-height: 1.6; text-align: center;">
              Thank you for reaching out to <strong>Digi Media Skill</strong>. We have received your inquiry.
            </p>
            <p style="text-align: center; margin-top: 20px;">Our team will get back to you within 24 hours.</p>
          </div>
        `,
      });
      console.log("✅ Client Auto-reply Sent!");

      return { success: true, message: 'Emails sent successfully.' };

    } catch (error) {
      console.error("❌ MAILER ERROR DETAILS:", error);
      throw new InternalServerErrorException('Failed to process inquiry: ' + error.message);
    }
  }
}