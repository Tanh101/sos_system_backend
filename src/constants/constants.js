const USER_STATUS = {
    ACTIVE: 1,
    DELETE: 0,
    PENDING: 2,
};

const ITEM_PER_PAGE = 10;
const PAGE = 1;

const REQUEST_STATUS = {
    PENDING: 0,
    RESCUING: 1,
    RESCUED: 2,
    REJECTED: 3
};

const VOTE_TYPE = {
    "upvote": 1,
    "downvote": 0,
    "none": 2
}

const USER_ROLE = {
    ADMIN: "admin",
    USER: "user",
    RESCUER: "rescuer"
}

const DANGER_AREA_STATUS = {
    ACTIVE: "active",
    DELETED: "deleted"
};

const MAX_DISTANCE = 15000;

const KEY_TYPE = {
    GGMAP: "ggmap",
}

module.exports = {
    ITEM_PER_PAGE,
    PAGE,
    REQUEST_STATUS,
    VOTE_TYPE,
    USER_STATUS,
    USER_ROLE,
    DANGER_AREA_STATUS,
    MAX_DISTANCE,
    KEY_TYPE,
};
