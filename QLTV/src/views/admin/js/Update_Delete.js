$(".btn-edit").click(function () {
    var userId = $(this).attr("data-user-id");
    var userEmail = $(this).attr("data-user-email");
    var userRole = $(this).attr("data-user-role");
    var user = {
        id: userId,
        email: userEmail,
        role: userRole,
    };
    // Set form values to display current user data
    $("#editUserForm").attr("action", "/admin/manageTV/edit/" + user.id);
    $("#userId").val(user.id);
    $("#email").val(user.email);
    $("#role").val(user.role);
    // Show the modal
    $("#editUserModal").modal("show");
});

// Handle Delete button click
$(".btn-delete").click(function () {
    var userId = $(this).attr("data-user-id");
    var user = {
        id: userId,
        email: $(this).attr("data-user-email"),
        role: $(this).attr("data-user-role"),
    };
    // Set form action to delete URL and show the modal for confirmation
    $("#deleteUserForm").attr("action", "/admin/manageTV/delete/" + user.id);
    $("#deleteUserModal").modal("show");
});