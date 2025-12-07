export async function sendSMS(to: string, message: string) { 
    console.log(`Sending SMS to ${to} with message \"${message}\"`);
    return Promise.resolve();
}
