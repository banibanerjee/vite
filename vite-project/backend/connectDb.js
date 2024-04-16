const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected successfully');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectDb; // Export the function directly
