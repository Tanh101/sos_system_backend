const userStatusList = {
    "1": "active",
    "0": "inactive",
    "-1": "deleted"
};
const ITEM_PER_PAGE = 10;
const PAGE = 1;
const REQUEST_STATUS = {
    "0": "pending",
    "1": "approved",
    "2": "completed",
    "3": "rejected"
};

module.exports = {
    userStatusList,
    ITEM_PER_PAGE,
    PAGE,
    REQUEST_STATUS
};
