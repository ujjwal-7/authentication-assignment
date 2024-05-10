const JWT = require('jsonwebtoken');
require('dotenv').config();

const authenticate = async (req, res, next) => {

    const accessToken = req.header("Authorization")?.replace("Bearer ", "");
    const apiToken = req.header("x-api-key");

    console.log(apiToken)
    if(!apiToken || (apiToken && apiToken !== process.env.API_TOKEN)) {
        return res.status(401).json({error: 'Unauthorized Request'});
    }

    if (!accessToken) {
        return res.status(401).json({error: 'Access token not provided'});
    }

    try {

        const user = await JWT.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);

        req.user = user;

        next();
        
    } catch(e) {
        return res.status(403).json({error: 'Invalid access token'});
    }
}

module.exports = authenticate;