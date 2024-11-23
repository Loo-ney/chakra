import nodemailer from 'nodemailer';


// google password: wtmx djyk xfrn ulgi
// chakra wont work here , this is backend
export const sendVerificationEmail = (token, email, name) => {
    const html = `
    <html>
        <body>
            <h3>Dear ${name}</h3>
            <p>Thanks for signing up at Chakra!</p>
            <p>Use the link below to verify your email</p>
            <a href="http://localhost:3000/email-verify/${token}">Click here!</a> 
        </body>
    </html>
    `;
    
    // stuff we need from the nodemailer
    const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'noe.ralte@gmail.com',
			pass: 'wtmx djyk xfrn ulgi',
		},
	}); 
    const mailOptions = {
		from: 'noe.ralte@gmail.com',
		to: email,
		subject: 'Verify your email address',
		html: html,
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log(`Email send to ${email}`);
			console.log(info.response);
		}
	});
       
}; 