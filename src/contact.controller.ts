import { Controller, Post, Body, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('contact')
export class ContactController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('send')
  async sendInquiry(@Body() body: any) {
    const { fullName, email, phone, company, services, message } = body;

    try {
      await this.mailerService.sendMail({
        to: 'wasifzahoor296@gmail.com', 
        subject: `New Project Inquiry: ${company || 'Client'}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #10B981; border-radius: 10px;">
            <h2 style="color: #10B981;">New Inquiry from Website</h2>
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Services:</strong> ${Array.isArray(services) ? services.join(", ") : services}</p>
            <p><strong>Message:</strong> ${message}</p>
          </div>
        `,
      });

      await this.mailerService.sendMail({
        to: email, 
        subject: `Thank you for contacting Digi Media Skill! ✨`,
        html: `
          <div style="font-family: sans-serif; padding: 30px; border-radius: 20px; background-color: #fafafa; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee;">
            <h1 style="color: #10B981; text-align: center;">Hello ${fullName}!</h1>
            <p style="font-size: 16px; line-height: 1.6; text-align: center;">
              Thank you for reaching out to <strong>Digi Media Skill</strong>. We have received your inquiry regarding <strong>${Array.isArray(services) ? services.join(", ") : services}</strong>.
            </p>
            <p style="font-size: 14px; color: #666; text-align: center; margin-top: 20px;">
              Our expert team is reviewing your requirements and we will get back to you within 24 hours to discuss how we can scale your business.
            </p>
            <div style="margin-top: 30px; padding: 20px; border-top: 2px solid #10B981; text-align: center;">
              <p style="margin: 0; font-weight: bold;">Digi Media Skill Team</p>
              <p style="margin: 5px 0; font-size: 12px; color: #aaa;">Think Unlimited</p>
            </div>
          </div>
        `,
      });

      return { success: true, message: 'Emails sent to both Admin and Client.' };
    } catch (error) {
      console.error("Mailer Error:", error);
      throw new InternalServerErrorException('Failed to process inquiry.');
    }
  }
}