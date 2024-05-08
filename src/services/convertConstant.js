const { userStatusList } = require("../constants/constants");

exports.convertUserStatus = (status) => {

    if (!userStatusList[status]) return null;
    return userStatusList[status];
}
