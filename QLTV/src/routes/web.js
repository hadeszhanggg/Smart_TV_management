import express from "express";
import registerController from "../controllers/registerController";
import loginController from "../controllers/loginController";
import adminController from "../controllers/adminController";
import clientController from "../controllers/clientController";
import initPassportLocal from "../controllers/passportLocalController";
initPassportLocal();
let router = express.Router();
// Middleware kiểm tra quyền truy cập vào trang admin
let isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    } else {
        return res.redirect("/client");
    }
};
// Middleware kiểm tra quyền truy cập vào trang client
let isUser = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
        return next();
    } else {
        return res.redirect("/admin");
    }
};
let initWebRoutes = (app) => {
    router.get("/", loginController.checkLoggedIn, (req, res) => {
        if (req.user.role === 'admin') {
            return res.redirect("/admin");
        } else {
            return res.redirect("/client");
        }
    });
    router.post("/logout", loginController.postLogOut);//route logout 
    router.get("/register", registerController.getRegisterPage);//route register
    router.post("/register-new-user", registerController.createNewUser);
    router.post("/register-new-user", async (req, res) => {
        let { email, password, passwordConfirmation } = req.body;
        let check = validateInput(email, password, passwordConfirmation);
        if (check) {
            return res.status(400).json({ message: "Invalid input. Please check your email and password." });
        }
        try {
            await registerController.createNewUser({ email, password });
            return res.status(200).json({ message: "Create user successfully." });
        } catch (error) {
            return res.status(500).json({ message: "Failed to create user. Please try again later." });
        }
    });
    router.get("/login", loginController.checkLoggedOut, loginController.getLoginPage);
    router.post("/login", loginController.handleLogin);
    // Route cho trang admin, chỉ cho phép user có role là 'admin' vào
    router.get("/admin", loginController.checkLoggedIn, isAdmin, adminController.getAdminPage, adminController.getUsersList);
    // Thêm route mới để lấy danh sách người dùng
    router.get("/admin/manageTV", loginController.checkLoggedIn, isAdmin, adminController.getUsersList);
    // Thêm route mới để lấy danh sách người dùng dưới dạng JSON
    router.get("/admin/manageTV/getUsersList", loginController.checkLoggedIn, isAdmin, adminController.getUsersListJSON);
    //route update, delete
    router.post("/admin/manageTV/edit/:id", loginController.checkLoggedIn, isAdmin, adminController.editUser);
    router.post("/admin/manageTV/delete/:id", loginController.checkLoggedIn, isAdmin, adminController.deleteUser);

    //route client
    router.get("/client", loginController.checkLoggedIn, isUser, clientController.getClientPage);
    //router.post("/post-geolocation", loginController.checkLoggedIn, isUser, clientController.handleGeolocation);//route geolocation
    return app.use("/", router);
};
module.exports = initWebRoutes;