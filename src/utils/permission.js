export const checkPermission = (permission) => {
    let permissions = JSON.parse(localStorage.getItem('permissions'));
    if (!permissions) {
        return true
    }
    const permission_names = permissions?.map(item => item.name);
    if (permission_names.includes(permission)) {
        return true
    } else {
        return false
    }
}