export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string; }) { 
    console.log(`Sending email to ${to} with subject \"${subject}\"`);
    return Promise.resolve();
}
