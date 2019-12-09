const ErrorResponse = require('../utils/ErrorResponse')
const asyncHandler = require('../middleware/async')
const User = require('../models/User')

//@desc     Register user
//@route    POST /auth/register
//@access   Public
exports.register = asyncHandler(async (req, res, next) => {
    const {
        name,
        email,
        password,
        role
    } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role
    })

    sendTokenResponse(user, 200, res)
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
        return next(new ErrorResponse('Password is incorrect', 401))
    }

    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({
        success: true,
        data: user
    })
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