function handleStudentLogin(event) {
    event.preventDefault();
    // 这里简单模拟登录，实际项目中需要与后端交互
    window.location.href = '/student/dashboard.html';
    return false;
}

function handleTeacherLogin(event) {
    event.preventDefault();
    window.location.href = '/teacher/dashboard.html';
    return false;
}

function handleParentLogin(event) {
    event.preventDefault();
    window.location.href = '/parent/dashboard.html';
    return false;
}