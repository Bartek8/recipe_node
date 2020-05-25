const ErrorResponse = require('../utils/ErrorResponse')
const asyncHandler = require('../middleware/async')
const User = require('../models/User')
const MailConfig = require('../config/email')
const jwt = require('jsonwebtoken');
const hbs = require('nodemailer-express-handlebars');
const gmailTransport = MailConfig.GmailTransport;
const SMTPTransport = MailConfig.SMTPTransport
//@desc     Register user
//@route    POST /auth/register
//@access   Public
exports.register = asyncHandler(async (req, res, next) => {
    const {
        name,
        email,
        password,
        role,
        terms
    } = req.body;

    if (!terms) {
        return next(new ErrorResponse('Please accept the terms', 400));
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
        terms
    })

    const token = user.getConfirmAccountToken();

    MailConfig.ViewOption(gmailTransport, hbs)
    let HelperOptions = {
        from: '"RecipeWebsite" <recipewebsite@gmail.com>',
        to: email,
        subject: 'Confirm adress email',
        template: 'template',
        context: {
            resetpassword: false,
            title: "Confirm adress email",
            link: "https://recipe-website.netlify.app/register/" + token
        }
    };
    gmailTransport.sendMail(HelperOptions, (error, info) => {
        if (error) {
            return next(new ErrorResponse('Error in sandmail', 404))
        }
        res.status(200).json({
            success: true,
            data: info
        })
    });
})
//@desc     Confirm email
//@route    GET /auth/confirm/:id
//@access   Public
exports.confirm = asyncHandler(async (req, res, next) => {
    let user;
    try {
        const decoded = jwt.verify(req.params.id, process.env.JWT_ACCOUNT_SECRET)
        user = await User.findById(decoded.id)
    } catch (err) {
        return next(new ErrorResponse(`Your token has expired or there is no user with this id`, 401));
    }
    if (user.confirmed) {
        res.status(200).json({
            success: true,
            message: "The account has already been confirmed."
        })
    }
    else {
        user.confirmed = true;
        await user.save();
        res.status(200).json({
            success: true,
            message: "The account has been confirmed successfully!"
        })
    }
})
//@desc     Resend email
//@route    POST /auth/resend
//@access   Public
exports.resend = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    // Check for email
    if (!email) {
        return next(new ErrorResponse('Please enter an email', 400));
    }
    const user = await User.findOne({
        email
    });

    if (!user) {
        return next(new ErrorResponse(`No user with email: ${email}`, 400));
    }

    const token = user.getConfirmAccountToken();

    MailConfig.ViewOption(gmailTransport, hbs)
    let HelperOptions = {
        from: '"RecipeWebsite" <recipewebsite@gmail.com>',
        to: email,
        subject: 'Confirm adress email',
        template: 'template',
        context: {
            resetpassword: false,
            title: "Confirm adress email",
            link: "https://recipe-website.netlify.app/register/" + token
        }
    };
    gmailTransport.sendMail(HelperOptions, (error, info) => {
        if (error) {
            return next(new ErrorResponse('Error in sandmail', 404))
        }
        res.status(200).json({
            success: true,
            data: info
        })
    });
})

//@desc     Logout user
//@route    POST /auth/logout
//@access   Public
exports.logout = asyncHandler(async (req, res, next) => {

    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        data: {}
    })
})

//@desc     Login user
//@route    POST /auth/login
//@access   Public
exports.login = asyncHandler(async (req, res, next) => {
    const {
        email,
        password
    } = req.body;

    // Check for email and password
    if (!email || !password) {
        return next(new ErrorResponse('Please enter an email and password', 400));
    }
    // Find user and add him with password field
    const user = await User.findOne({
        email
    }).select("+password");

    // Check email
    if (!user) {
        return next(new ErrorResponse('Incorrect password or email', 400));
    }
    const isMatch = await user.matchPassword(password);

    // Check password
    if (!isMatch) {
        return next(new ErrorResponse('Incorrect password or email', 400));
    }

    if (!user.confirmed) {
        return next(new ErrorResponse('Confirm your email', 400));
    }

    sendTokenResponse(user, 200, res);
})

// @desc    Get current logged in user
// @route   GET auth/me
// @access  Privat
exports.getMe = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    })
})

// @desc    Update user details
// @route   PUT /auth/update
// @access  Private
exports.update = asyncHandler(async (req, res, next) => {
    let fieldsToUpdate;
    // Skip name if it's undefined or empty field
    if (req.body.name === undefined || req.body.name === "") {
        fieldsToUpdate = {
            email: req.body.email
        }
    }
    // Skip email if it's undefined or empty field
    if (req.body.email === undefined || req.body.email === "") {
        fieldsToUpdate = {
            name: req.body.name
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        runValidators: true,
        new: true
    })

    res.status(200).json({
        success: true,
        data: user
    })
})

// @desc    Update password
// @route   PUT auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
    // Find user by ID and select with password
    const user = await User.findById(req.user.id).select('+password');

    // Match old password with password in database
    if (!(await user.matchPassword(req.body.oldPassword))) {
        return next(new ErrorResponse('Current password is incorrect', 401))
    }

    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({
        success: true,
        data: user
    })
})

// @desc    Reset password
// @route   GET auth/login/resetpassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.query;

    // Check for email
    if (!email) {
        return next(new ErrorResponse('Please enter an email', 400));
    }
    const user = await User.findOne({
        email
    }).select('+password');

    if (!user) {
        return next(new ErrorResponse(`No user with email: ${email}`, 400));
    }

    const newPassword = "Recipes" + Math.random().toString(36).slice(-8);
    user.password = newPassword
    await user.save();

    MailConfig.ViewOption(gmailTransport, hbs);
    let HelperOptions = {
        from: '"RecipeWebsite" <website.recipe@gmail.com>',
        to: email,
        subject: 'Reset password',
        template: 'template',
        context: {
            resetpassword: true,
            title: "Your password has been reset",
            message1: `New password: `,
            password: `${newPassword}`,
            message2: `go to your account and change your password immediately`
        }
    };

    //GMAIL 

    gmailTransport.sendMail(HelperOptions, (error, info) => {
        if (error) {
            return next(new ErrorResponse('Error in sandmail', 404))
        }
        res.status(200).json({
            success: true,
            data: info
        })
    });

    //SMTP

    // SMTPTransport.verify((error, success) => {
    //     if (error) {
    //         return next(new ErrorResponse('Error in verify', 404))
    //     } else {
    //         SMTPTransport.sendMail(HelperOptions, (error, info) => {
    //             if (error) {
    //                 return next(new ErrorResponse('Error in sandmail', 404))
    //             }
    //             res.status(200).json({
    //                 success: true,
    //                 data: info
    //             })
    //         });
    //     }
    // })
})

//Get Token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {

    const token = user.getSignedJwtToken();

    // Options for token 
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === "production") {
        options.secure = true;
    }

    // Send response token with cookie
    res.status(statusCode).cookie('token', token, options).json({
        succes: true,
        token
    })
}