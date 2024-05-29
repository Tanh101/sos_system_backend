const userStatusList = {
    "1": "active",
    "0": "inactive",
    "-1": "deleted"
};
const ITEM_PER_PAGE = 10;
const PAGE = 1;

const REQUEST_STATUS = {
    PENDING: 0,
    APPROVED: 1,
    RESCUING: 2,
    RESCUED: 3,
    REJECTED: 4
};

const VOTE_TYPE = {
    "upvote": 1,
    "downvote": 0,
    "none": 2
}

module.exports = {
    userStatusList,
    ITEM_PER_PAGE,
    PAGE,
    REQUEST_STATUS,
    VOTE_TYPE
};
