
import connection from "../config/connectDB";

let getAllUsers = () => {
    return new Promise((resolve, reject) => {
        try {
            connection.query("SELECT * from user", function (error, rows) {
                if (error) reject(error);
                resolve(rows);
            });
        } catch (e) {
            reject(e);
        }
    });
};
// Function to get a user by ID
let getUserById = (id) => {
    return new Promise((resolve, reject) => {
        try {
            connection.query(
                "SELECT * FROM user WHERE id = ? ",
                [id],
                function (error, rows) {
                    if (error) reject(error);
                    resolve(rows[0]);
                }
            );
        } catch (e) {
            reject(e);
        }
    });
};
// Function to get a user by ID
let getBaoCao = (id) => {
    return new Promise((resolve, reject) => {
        try {
            connection.query(
                "SELECT * FROM baocaokhoa WHERE id = ?",
                [id],
                function (error, rows) {
                    if (error) reject(error);
                    resolve(rows[0]);
                }
            );
        } catch (e) {
            reject(e);
        }
    });
};
// Function to get a user by ID
let getLLV = (id) => {
    return new Promise((resolve, reject) => {
        try {
            connection.query(
                "SELECT * FROM lichlamviec WHERE id = ?",
                [id],
                function (error, rows) {
                    if (error) reject(error);
                    resolve(rows[0]);
                }
            );
        } catch (e) {
            reject(e);
        }
    });
};
// Function to update a user by ID
let updateUserById = (id, updatedUser) => {
    return new Promise((resolve, reject) => {
        try {
            connection.query(
                "UPDATE user SET email = ?, role = ? WHERE id = ?",
                [updatedUser.email, updatedUser.role, id],
                function (error, result) {
                    if (error) reject(error);
                    resolve(result);
                }
            );
        } catch (e) {
            reject(e);
        }
    });
};
// Function to delete a user by ID
let deleteUserById = (id) => {
    return new Promise((resolve, reject) => {
        try {
            connection.query(
                "DELETE FROM user WHERE id = ?",
                [id],
                function (error, result) {
                    if (error) reject(error);
                    resolve(result);
                }
            );
        } catch (e) {
            reject(e);
        }
    });
};
// Function to update user's geolocation by ID
let updateUserGeolocation = (userId, geolocation) => {
    return new Promise((resolve, reject) => {
        try {
            connection.query(
                "UPDATE user SET latitude = ?, longitude = ?  WHERE id = ?",
                [geolocation.latitude, geolocation.longitude, userId],
                function (error, result) {
                    if (error) reject(error);
                    resolve(result);
                }
            );
        } catch (e) {
            reject(e);
        }
    });
};
let fetchDataForUser = async (userId, selectedFields) => {
    try {
        const user = await getUserById(userId);
        const [baocao, giaovien] = await Promise.all([
            getBaoCao(userId),
            getLLV(userId)
        ]);

        let fetchedData = {};

        if (selectedFields.includes("giaovien") && giaovien) {
            fetchedData.gvien = giaovien.giaovien;
        }

        if (selectedFields.includes("baocao") && baocao) {
            fetchedData.bcao = baocao.baocao;
        }

        if (!fetchedData.gvien && !fetchedData.bcao) {
            throw new Error("Data by user not exist on database!!!");
        }

        return fetchedData;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllUsers: getAllUsers,
    getUserById: getUserById,
    updateUserById: updateUserById,
    deleteUserById: deleteUserById,
    updateUserGeolocation: updateUserGeolocation,
    fetchDataForUser: fetchDataForUser,
};