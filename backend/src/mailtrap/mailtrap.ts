import { MailtrapClient } from "mailtrap";
import "dotenv/config";

export const mailtrapClient = new MailtrapClient({
  token: process.env.MAIL_TRAP_TOKEN!,
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Mailtrap Test",
};
