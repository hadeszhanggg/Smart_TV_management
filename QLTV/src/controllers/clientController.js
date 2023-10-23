import userService from "../services/userService";
let getClientPage = (req, res) => {
    console.log("User ID:", req.user.id); // Đảm bảo giá trị id xuất hiện trong console log
    return res.render("client.ejs", {
        user: req.user,
        id: req.user.id
    });
};

let handleGeolocation = async (req, res) => {
    try {
        const userId = req.user.id;// Lấy ID của người dùng từ session
        const { latitude, longitude } = req.body;
        await userService.updateUserGeolocation(userId, { latitude, longitude });
        // Cập nhật địa điểm địa lý của người dùng trong cơ sở dữ liệu

        return res.status(200).json({ message: "Cập nhật địa điểm địa lý thành công." });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};
module.exports = {
    getClientPage: getClientPage,
    handleGeolocation: handleGeolocation,
};