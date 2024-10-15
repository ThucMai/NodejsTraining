import Bull from 'bull';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const redisHost = process.env.REDIS_HOST;
const redisPort = parseInt(process.env.REDIS_PORT || '6379');
const emailHost = process.env.EMAIL_HOST;
const emailPort = process.env.EMAIL_PORT;
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASSWORD;
const mailFromAddress = process.env.MAIL_FROM_ADDRESS;

// create bull queue
const emailQueue = new Bull('email', {
    redis: {
        host: redisHost,
        port: redisPort
    }
});

// define email transporter
const transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    auth: {
        user: emailUser,
        pass: emailPass
    }
} as SMTPTransport.Options);

// process queue to send email
emailQueue.process(async (job) => {
    const { to, subject, text } = job.data;

    try {
        await transporter.sendMail({
            from: mailFromAddress,
            to,
            subject,
            text
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.log(`Fail to send email to ${to}`, error);
        throw error;
    }
});

export default emailQueue;