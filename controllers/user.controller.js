const User = require('../models/user.model');
const validator = require('validator');
const sharp = require('sharp');

const getProfiles = async(req, res) => {

    const role = req.user.role;
    
    try {
        
        if(role === "user") {

            const profiles = await User.find({privacy: "public"}, '_id fullName email privacy');

            return res.status(200).json({
                data: {
                    profiles
                },
                message: "Public profiles"
            });

        } else {

            const profiles = await User.find({role: { $ne: 'admin' }, privacy: { $in: ['public', 'private'] }}, '_id fullName email privacy');

            return res.status(200).json({
                data: {
                    profiles
                },
                message: "Public and private profiles"
            });
        }

    } catch (e) {
        console.log(e);
        res.status(500).json({error: "Internal server error"});
    }
}

const profileDetails = async(req, res) => {

    const id = req.params.id;
    const userId = req.user.id;
    const role = req.user.role;

    if(!id) {
        return res.status(400).json({error: "id paramters is required"});
    }

    try {
        const user = await User.findById(id).select('-password -role -refreshToken');;
        if(!user) {
            return res.status(404).json({error: "No such user exists"});
        }

        if(user.privacy === "public" || userId === id || role === "admin") {
            return res.status(200).json({
                data: user,
                message: "User found successfully"
            });
        }

        res.status(403).json({error: "You cannot access a private profile"});

    } catch (e) {
        console.log(e);
        res.status(500).json({error: "Internal server error"});
    }
    
}

const updateProfileDetails = async(req, res) => {

    const id = req.params.id;
    const userId = req.user.id;

    if(!id) {
        return res.status(400).json({error: "id paramters is required"});
    }

    if(userId !== id) {
       return res.status(403).json({error: "Forbidden request"});
    }

    try {

        const user = await User.findById(id);
        if(!user) {
            return res.status(404).json({error: "No such user exists"})
        }

        const {name, email, password, phoneNumber, bio, privacy} = req.body;
        
        if (name && name.trim().length >= 2 && name.trim().length <= 50) {
            user.fullName = name;
        }
        
        if (email && validator.isEmail(email)) {
            user.email = email;
        }
        
        if (password && validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1,   minSymbols: 1 })) {
            user.password = password;
        }

        if (phoneNumber && validator.isMobilePhone(phoneNumber, 'any')) {
            user.phoneNumber = phoneNumber;
        }

        if (bio && bio.trim().length >= 2 && bio.trim().length <= 100) {
            user.bio = bio;
        }

        if(privacy && (privacy === "public" || privacy === "private")) {
            user.privacy = privacy;
        }

        await user.save();
        res.status(200).json({
            data: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                bio: user.bio,
                privacy: user.privacy
            },
            message: "Profile updated successfully"})
        
    } catch (e) {
        console.log(e);
        res.status(500).json({error: "Internal server error"});
    }

}

const updateProfileImage = async(req, res) => {

    const id = req.params.id;
    const userId = req.user.id;

    if(!id) {
        return res.status(400).json({error: "id paramters is required"});
    }

    if(userId !== id) {
       return res.status(403).json({error: "Forbidden request"});
    }

    try {

        const imageBuffer = req?.file?.buffer;
        const image = req?.body?.profileImg;

        if(!image && !imageBuffer) {
            return res.status(400).json({error: "Image is required"})
        }

        const user = await User.findById(id);
        if(!user) {
            return res.status(404).json({error: "No such user exists"})
        }


        if(imageBuffer) {
            const buffer = await sharp(imageBuffer).resize({width: 250, height: 250}).png().toBuffer() 
            user.photo = buffer;
           
        } else if(validator.isURL(image)) {
            user.photo = image;
        } else {
            return res.status(400).json({error: "Invalid url"});
        }

        await user.save();
        res.status(200).json({message: "Profile image uploaded successfully"});


    } catch (e) {

        console.log(e);
        res.status(500).json({error: "Internal server error"});
    }
}



module.exports = {
    getProfiles,
    profileDetails,
    updateProfileDetails,
    updateProfileImage
}
