import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(
    to: string | string[],
    subject: string,
    template: string,
    context: any,
    from?: string,
    cc?: string[],
    bcc?: string[],
    attachments?: Array<{ filename: string; path: string; content?: Buffer }>,
  ) {
    try {
      if (to && Array.isArray(to)) {
        to = to.join(", ");
      }
      await this.mailerService.sendMail({
        from: from || '"UNO Minda Group" <noreply.ems@mindagroup.com>', // Default sender
        to, // Recipient(s)
        cc, // Carbon copy (optional)
        bcc, // Blind carbon copy (optional)
        subject, // Subject of the email
        template, // Name of the Pug template file without extension
        context, // Variables for the Pug template
        attachments, // Optional attachments
      });
      console.log(`Email sent to ${to} successfully.`);
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error.message);
      // Optionally rethrow or log the error to a monitoring service
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
