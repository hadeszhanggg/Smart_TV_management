import connection from "../config/connectDB";
import bcrypt from "bcryptjs";

let createNewUser = (user) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkEmailUser(user.email);
            if (check === false) {
                // Generate a new ID for the user
                let newId = generateNewUserId();

                // Hash user's password
                let salt = bcrypt.genSaltSync(10);
                let data = {
                    id: newId,
                    email: user.email,
                    password: bcrypt.hashSync(user.password, salt),
                    role: "user",// Set the default role to 'user'

                };

                // Create a new user
                connection.query("INSERT INTO user SET ?", data, function (error, rows) {
                    if (error) reject(error);
                    resolve("create a new user successfully");
                });
            }
            if (check === true) {
                reject(`The email ${user.email} has already existed. Please choose another email.`);
            }

        } catch (e) {
            reject(e);
        }
    });
};

let checkEmailUser = (email) => {
    return new Promise((resolve, reject) => {
        try {
            connection.query("SELECT * FROM user WHERE email = ?", email, function (error, rows) {
                if (error) reject(error);
                if (rows && rows.length > 0) resolve(true);
                else resolve(false);
            });
        } catch (e) {
            reject(e);
        }
    });
};

// Function to generate a new unique ID for the user
let generateNewUserId = () => {
    // You can implement your own logic to generate a new unique ID, for example, using a UUID library or any other method
    // For this example, let's generate a random integer as the ID
    return Math.floor(Math.random() * 1000000); // Change the range as needed
};

module.exports = {
    createNewUser: createNewUser
};
