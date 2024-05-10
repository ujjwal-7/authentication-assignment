const connectToDb = require('../db/index.js');
const User = require('../models/user.model.js');

const seedAdmin = async () => {

    try {
        const connection = await connectToDb();
        const existingAdmin = await User.findOne({role: 'admin'});

        if(!existingAdmin) {

            const admin = new User({
                fullName: process.env.ADMIN_NAME,
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
                phoneNumber: process.env.ADMIN_PHONE_NUMBER,
                bio: process.env.ADMIN_BIO,
                privacy: process.env.ADMIN_PRIVACY,
                role: "admin"
            });

            await admin.save();
            console.log("Admin user created successfully");
        } else {
            console.log("Admin user already exists");
        }
        connection.disconnect();
        
    } catch (e) {
        console.log(e);
    }
    
}


seedAdmin().then(() => {
    console.log("Admin seeding completed");
}).catch((e) => {
    console.error("Error seeding admin:", e);
});
