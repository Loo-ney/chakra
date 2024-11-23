import express from 'express';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../middleware/sendVerificationEmail.js';
import { sendPasswordResetEmail } from '../middleware/sendPasswordResetEmail.js';



const userRoutes = express.Router();


//TODO: redefine expiresIn
const genToken = (id) => {
	return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: '1d' });
};


// login
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if(user && (await user.matchPasswords(password))) {
        user.firstLogin = false;
		await user.save();
        // responding to frontend if everthing is alright
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			googleImage: user.googleImage,
			goodleId: user.googleId,
			isAdmin: user.isAdmin,
			token: genToken(user._id),
			active: user.active,
			firstLogin: user.firstLogin,
			created: user.createdAt,
		});
    } else {
        res.status(401).send('Invalid Email or Password.');
		throw new Error('User not found.');
    }
});

// register
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body; 

    // check if user exists    
    const userExists = await User.findOne({ email });
    if (userExists) {
		res.status(400).send('We already have an account with that email address.');
	}

    // if user do not exist, create new user
    const user = await User.create({
		name,
		email,
		password,
	});

	const newToken = genToken(user._id);

    // send verification email
    sendVerificationEmail(newToken, email, name);

    // if saving is successful respond
    if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			googleImage: user.googleImage,
			googleId: user.googleId,
			firstLogin: user.firstLogin,
			isAdmin: user.isAdmin,
			token: newToken,
			active: user.active,
			createdAt: user.createdAt,
		});
    } else {
            res.status(400).send('We could not register you.');
            throw new Error('Something went wrong. Please check your information and try again.');
        }
})


// verify email
const verifyEmail = asyncHandler(async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findById(decoded.id);

        if(user) {
            user.active = true;
            await user.save()
            res.json('Thanks for activating your account.You can close this window now.')
        } else {
            res.status(404).send('User not found.');
        }
    } catch (error) {
        res.status(401).send('Email address could not be verify')
    }


	// const user = req.user;
// 	user.active = true;
// 	await user.save();
// 	res.json('Thanks for activating your account. You can close this window now.');
});


// password reset request
const passwordResetRequest = asyncHandler(async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email: email });
		if (user) {
			const newToken = genToken(user._id);
			sendPasswordResetEmail(newToken, user.email, user.name);
			res.status(200).send(`We have send you a recover email to ${email}`);
		}
	} catch (error) {
		res.status(401).send('There is not account with such an email address');
	}
});


// password reset
const passwordReset = asyncHandler(async (req, res) => {
	const token = req.headers.authorization.split(' ')[1];
	try {
		const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
		const user = await User.findById(decoded.id);

		if (user) {
			user.password = req.body.password;
			await user.save();
			res.json('Your password has been updated successfully.');
		} else {
			res.status(404).send('User not found.');
		}
	} catch (error) {
		res.status(401).send('Password reset failed.');
	}
});


//google login


userRoutes.route('/login').post(loginUser);
userRoutes.route('/register').post(registerUser);
userRoutes.route('/verify-email').get( verifyEmail);
userRoutes.route('/password-reset-request').post(passwordResetRequest);
userRoutes.route('/password-reset').post(passwordReset);
// userRoutes.route('/google-login').post(googleLogin);
// userRoutes.route('/:id').get(protectRoute, getUserOrders);
// userRoutes.route('/').get(protectRoute, admin, getUsers);
// userRoutes.route('/:id').delete(protectRoute, admin, deleteUser);

export default userRoutes;