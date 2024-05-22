// lib/db.js

import mongoose from 'mongoose'


console.log("ddddddddddddsssss");

export async function connect() {
    try {
        await mongoose.connect('mongodb+srv://moheensajjad82:xzfijv21f9VHR7XJ@cluster0.6vm6du9.mongodb.net/test')
        const connection = mongoose.connection;
        console.log("connecting");

        connection.on('connected', () => {
            console.log("connection successfull");

        })

        connection.on("error", (error) => {
            console.log("connection is not successfull =>", error);
        })
    } catch (error) {
        console.log("catch error durin connection ", error);

    }
}


// const connectDatabase = async () => {
//     try {
//         await mongoose.connect('mongodb+srv://moheensajjad82:xzfijv21f9VHR7XJ@cluster0.6vm6du9.mongodb.net/test', {
//             // useNewUrlParser: true,
//             // useUnifiedTopology: true,
//             // useFindAndModify: false,
//             // useCreateIndex: true
//         });
//         console.log('Connected to MongoDB');
//     } catch (error) {
//         console.error('Error connecting to MongoDB:', error);
//         process.exit(1); // Exit with failure
//     }
// };
// // MongoDB connection instance
// let db: any;

// // Connect to MongoDB when the module is imported
// connectMongo();

// // Function to connect to MongoDB
// async function connectMongo() {
//     try {
//         db = await connectDatabase();
//         console.log('Connected to MongoDB');
//     } catch (error) {
//         console.error('Error connecting to MongoDB:', error);
//     }
// }

// // Export the mongoClient object
// export { db };
