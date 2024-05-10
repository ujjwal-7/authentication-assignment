const JWT = require('jsonwebtoken');
const User = require('../models/user.model');
const generateAccessAndRefreshTokens = require('../utils/generateAccessAndRefreshTokens');
const validation = require('../utils/validation');

const signup = async (req, res) => {

    const {name, email, password, phoneNumber, bio, photo, privacy} = req.body;

    const validationError = validation(name, email, password, phoneNumber, bio);

    if(validationError) {
        return res.status(400).json({error: validationError});
    }

    try {

        const existingEmail = await User.findOne({email});
        
        if(existingEmail) {
            return res.status(409).json({error: 'User with this email already exists'});
        }

        const newUser = new User({
            fullName: name,
            email,
            password,
            phoneNumber,
            bio,
            privacy
        });

        await newUser.save();

        res.status(201).json({
            data: {
                
                id: newUser._id,
                email: newUser.email
            },
            message: 'User created successfully'
            
        });
        
    } catch (e) {
        console.log(e);
        res.status(500).json({error: 'Internal server error'});
    }

}

const login = async (req, res) => {

    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({error: 'All fields are required'});
    }

    try {

        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({error: 'User with this email doest not exists'});
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(401).json({error: 'Invalid credentials'});
        }

        const {accessToken, refreshToken} = generateAccessAndRefreshTokens(user._id, user.email, user.role);

        user.refreshToken = refreshToken;
        await user.save();

        res
        .status(200)
        .json(
            {
                data: {
                    
                    id: user._id,
                    email: user.email,
                    privacy: user.privacy,
                    accessToken,
                    refreshToken
                },
                message: 'User logged in successfully'
                
            }
        );
        
    } catch (e) {
        console.log(e);
        res.status(500).json({error: 'Internal server error.'});
    }
}

const refreshAccessToken = async (req, res) => {

    const oldRefreshToken = req.body.refreshToken;
    
    if(!oldRefreshToken) {
        return res.status(401).json({error: 'Unauthorized request'});
    }

    try {

        const decodedToken = await JWT.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);

        const user = await User.findById(decodedToken?.id);

        if(!user) {
            return res.status(401).json({error: 'Invalid refresh token'});
        }

        if(oldRefreshToken !== user?.refreshToken) {
            return res.status(401).json({error: 'Invalid refresh token'});
        }

        const {accessToken, refreshToken} = generateAccessAndRefreshTokens(user._id, user.email, user.role);

        user.refreshToken = refreshToken;
        await user.save();

        res
        .status(200)
        .json(
            {
                data: {
                    id: user._id,
                    email: user.email,
                    role: user.role,
                    accessToken,
                    refreshToken
                },
                message: 'Access token refreshed successfully.'
            }
        );

    } catch(e) {
        console.log(e);
        return res.status(401).json({error: 'Invalid refresh token'});
    }

}

const logout = async (req, res) => {

    try {
        
        const user = await User.findByIdAndUpdate(req.user.id,  {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        });
    
        return res
        .status(200)
        .json({message: 'User logged out successfully'});

    } catch (e) {
        res.status(500).json({error: 'Interval server error'});
    }
}

module.exports = {
    signup,
    login,
    refreshAccessToken,
    logout
}
