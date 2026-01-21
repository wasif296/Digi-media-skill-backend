import { Controller, Post, Body, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('contact')
export class ContactController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('send')
  async sendInquiry(@Body() body: any) {
    console.log("📩 New Request Arrived at Backend");
    console.log("📦 Incoming Data:", body);

    const { 
      fullName = "Not Provided", 
      email = "Not Provided", 
      phone = "No Phone Provided", 
      company = "N/A", 
      services = [], 
      message = "No Message Provided" 
    } = body;

    const selectedServices = Array.isArray(services) 
      ? (services.length > 0 ? services.join(", ") : "None Selected") 
      : (services || "Not Specified");

    try {
      console.log("⏳ Sending Email to Admin...");
      await this.mailerService.sendMail({
        to: 'digimediaskill@gmail.com', 
        subject: `🚀 Website Inquiry: ${company}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 25px; border: 2px solid #10B981; border-radius: 15px; max-width: 600px; color: #333;">
            <h2 style="color: #10B981; text-align: center; border-bottom: 1px solid #eee; padding-bottom: 15px;">New Project Inquiry</h2>
            <div style="margin-top: 20px; line-height: 1.8;">
              <p><strong>👤 Name:</strong> ${fullName}</p>
              <p><strong>📧 Email:</strong> ${email}</p>
              <p><strong>📞 Phone:</strong> <span style="color: #2563EB; font-weight: bold;">${phone}</span></p>
              <p><strong>🏢 Company:</strong> ${company}</p>
              <p><strong>🛠️ Services:</strong> ${selectedServices}</p>
            </div>
            <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid #10B981; border-radius: 5px;">
              <strong>💬 Message:</strong><br/>
              <p style="margin-top: 10px;">${message}</p>
            </div>
            <p style="text-align: center; margin-top: 20px; font-size: 11px; color: #999;">Sent from Digi Media Skill Website</p>
          </div>
        `,
      });
      console.log("✅ Admin Email Done");

      console.log(`⏳ Sending Confirmation to ${email}...`);
      await this.mailerService.sendMail({
        to: email, 
        subject: `We've received your inquiry - Digi Media Skill ✨`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 30px; border-radius: 15px; background-color: #fafafa; border: 1px solid #eee; max-width: 600px; margin: auto;">
            <h1 style="color: #10B981; text-align: center;">Hello ${fullName}!</h1>
            <p style="font-size: 16px; color: #555; text-align: center;">Thank you for reaching out to us. We have received your inquiry regarding <strong>${selectedServices}</strong>.</p>
            <p style="font-size: 14px; color: #777; text-align: center; margin-top: 15px;">Our team will review your details and contact you at <strong>${phone}</strong> within 24 hours.</p>
            <div style="margin-top: 30px; border-top: 2px solid #10B981; pt-20px; text-align: center;">
              <p style="margin-top: 20px; font-weight: bold; color: #10B981;">Digi Media Skill Team</p>
            </div>
          </div>
        `,
      });
      console.log("✅ Client Auto-reply Done");

      return { success: true, message: 'Emails delivered successfully.' };

    } catch (error) {
      console.error("❌ MAILER ERROR:", error);
      throw new InternalServerErrorException('Mailer Service Error: ' + error.message);
    }
  }
}