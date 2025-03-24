// export const checkPermission = (permission) => {
//     let permissions = JSON.parse(localStorage.getItem('permissions'));
//     console.log('permission', permissions);
//     if (!permissions) {
//         return true
//     }
//     const permission_names = permissions?.map(item => item.name);
//     if (permission_names.includes(permission)) {
//         return true
//     } else {
//         return false
//     }
// }

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