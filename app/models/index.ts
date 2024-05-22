// lib/mongodb/index.js

import mongoose from "mongoose";

export async function connectDatabase() {
    try {
        mongoose.connect('mongodb+srv://moheensajjad82:xzfijv21f9VHR7XJ@cluster0.6vm6du9.mongodb.net/test')
        console.log("connecting");

        const connection = mongoose.connection;
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
