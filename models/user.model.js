const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        
    },

    phoneNumber: {
        type: String,
        required: true
    },

    bio: {
        type: String,
        required: true
    },

    photo: {
        type: mongoose.Schema.Types.Mixed, 
        required: true,
        default: "https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg"
    },

    privacy: {
        type: String,
        enum : ['public', 'private'],
        required: true,
        default: 'public'
    },
    
    role: {
        type: String,
        enum : ['admin', 'user'],
        required: true,
        default: 'user'
    },

    refreshToken: {
        type: String
    }
    
}, {timestamps: true});

userSchema.pre('save', async function (next) {

    const user = this;

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }

    next();
});


userSchema.methods.isPasswordCorrect = async function(password) {
    
    const user = this;
    return await bcrypt.compare(password, user.password);
}

const User = mongoose.model('User', userSchema);
module.exports = User;