const nodemailer = require('nodemailer');
const twilio = require('twilio'); // Use Twilio for SMS

// Email setup (using nodemailer)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: 'pubgkorucbuy@gmail.com',
        pass: 'bipa tpko oybg udvb',
    },
});



// Send verification code via email or SMS
exports.sendVerificationCode = async (identifier, verificationCode) => {
    console.log("choosing verification method");
    if (identifier.includes('@')) { // If it's an email
        console.log("sending mail");
        await transporter.sendMail({
            from: {
                name: 'Ajay Raj',
                address: 'pubgkorucbuy@gmail.com'
            },
            to: identifier,
            subject: 'Verification Code',
            text: `Your verification code is: ${verificationCode}`,
        });
        console.log("mail sent");
    } else { // If it's a phone number
        console.log("using phone");
        const accountSid = 'your-twilio-account-sid';
        const authToken = 'your-twilio-auth-token';
        const client = twilio(accountSid, authToken);

        await client.messages.create({
            body: `Your verification code is: ${verificationCode}`,
            from: 'your-twilio-phone-number',
            to: identifier,
        });
    }
};
