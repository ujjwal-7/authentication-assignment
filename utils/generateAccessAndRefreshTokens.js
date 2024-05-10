const JWT = require('jsonwebtoken');

const generateAccessAndRefreshTokens = (id, email, role) => {

    const accessToken = JWT.sign(
        {
            id,
            email,
            role
        }, 
        process.env.ACCESS_TOKEN_SECRET_KEY, 
        {   
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );

    const refreshToken = JWT.sign(
        {
            id,
            timestamp: Date.now()
        }, 
        process.env.REFRESH_TOKEN_SECRET_KEY, 
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
    
    return {accessToken, refreshToken};
}

module.exports = generateAccessAndRefreshTokens;

