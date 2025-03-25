export const checkPermission = (permission) => {
    const storedPermissions = localStorage.getItem('permissions');

    if (storedPermissions === null) {
        return false;
    }

    let permissions;
    try {
        permissions = JSON.parse(storedPermissions);
    } catch (e) {
        console.error('Lỗi khi parse permissions từ localStorage:', e);
        return false;
    }

    if (!permissions || !Array.isArray(permissions)) {
        return false;
    }

    const permissionNames = permissions.map(item => item.name);

    return permissionNames.includes(permission);
};