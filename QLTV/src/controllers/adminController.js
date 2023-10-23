import userService from "../services/userService";
import socketIO from 'socket.io-client';
let getAdminPage = (req, res) => {
    return res.render("admin.ejs", {
        user: req.user
    });
};
let getUsersList = async (req, res) => {
    try {
        let userList = await userService.getAllUsers();
        return res.render("admin/manageTV", { userList });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
let getUsersListJSON = async (req, res) => {
    try {
        let userList = await userService.getAllUsers();
        return res.status(200).json(userList);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
let getEditUserPage = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(id);
        return res.render("admin/editUser", { user });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
let editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, role } = req.body;
        await userService.updateUserById(id, { email, role });
        return res.redirect("/admin/manageTV");
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
let getDeleteUserConfirmation = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(id);
        return res.render("admin/deleteUser", { user });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
let deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await userService.deleteUserById(id);
        return res.redirect("/admin/manageTV");
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};




module.exports = {
    getAdminPage: getAdminPage,
    getUsersList: getUsersList,
    getEditUserPage: getEditUserPage,
    editUser: editUser,
    getDeleteUserConfirmation: getDeleteUserConfirmation,
    deleteUser: deleteUser,
    getUsersListJSON: getUsersListJSON,

};