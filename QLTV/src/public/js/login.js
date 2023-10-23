
function handleLoginBtn() {
    $("#loginBtn").on("click", function (event) {
        event.preventDefault();
        let email = $("#email").val();
        let password = $("#password").val();

        $.ajax({
            url: `${window.location.origin}/login`,
            method: "POST",
            data: { email: email, password: password },
            success: function (data) {
                window.location.href = "/";
            },
            error: function (err) {
                alert("Mật khẩu hoặc email không đúng. Vui lòng kiểm tra lại!");
            }
        })
    });
}
$(document).ready(function () {
    handleLoginBtn();
});