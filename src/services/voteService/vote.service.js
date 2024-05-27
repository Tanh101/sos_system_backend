const db = require("../../app/models/index");
const Vote = db.votes;
const Request = db.requests;
const { VOTE_TYPE } = require("../../constants/constants");

exports.upvote = async (userId, requestId) => {
    try {
        const request = await Request.findOne({
            where: {
                id: requestId
            }
        });
        let voteCount = request.voteCount;

        const currentVote = await Vote.findOne({
            where: {
                requestId: requestId,
                userId: userId
            },
            paranoid: false
        });

        if (currentVote) {
            if (currentVote.voteType === VOTE_TYPE.upvote) {
                await currentVote.destroy();
                voteCount -= 1;
            } else {
                await currentVote.update({ voteType: VOTE_TYPE.upvote });
                if (currentVote.deletedAt) {
                    await currentVote.restore();
                }
                voteCount += 2;
            }
        } else {
            await Vote.create({
                requestId: requestId,
                userId: userId,
                voteType: VOTE_TYPE.upvote
            });
            voteCount += 1;
        }
        request.voteCount = voteCount;

        await request.save();
        return request.voteCount;
    } catch (error) {
        throw error;
    }
}

exports.downvote = async (userId, requestId) => {
    try {
        const request = await Request.findOne({
            where: {
                id: requestId
            }
        });

        let voteCount = request.voteCount;

        const currentVote = await Vote.findOne({
            where: {
                requestId: requestId,
                userId: userId
            },
            paranoid: false
        });

        if (currentVote) {
            if (currentVote.voteType === VOTE_TYPE.downvote) {
                await currentVote.destroy();
                voteCount += 1;
            } else {
                await currentVote.update({ voteType: VOTE_TYPE.downvote });
                if (currentVote.deletedAt) {
                    await currentVote.restore();
                }
                voteCount -= 2;
            }
        } else {
            await Vote.create({
                requestId: requestId,
                userId: userId,
                voteType: VOTE_TYPE.downvote
            });
            voteCount -= 1;
        }
        request.voteCount = voteCount;

        await request.save();
        return request.voteCount;

    } catch (error) {
        throw error;
    }
}

exports.setNone = async (userId, requestId) => {
    try {
        const request = await Request.findOne({
            where: {
                id: requestId
            }
        });

        const currentVote = await Vote.findOne({
            where: {
                requestId: requestId,
                userId: userId
            },
        });

        let voteCount = request.voteCount;

        if (currentVote) {
            await currentVote.destroy();
            if (currentVote.voteType === VOTE_TYPE.upvote) {
                voteCount -= 1;
            } else if (currentVote.voteType === VOTE_TYPE.downvote) {
                voteCount += 1;
            }
        }

        request.voteCount = voteCount;
        await request.save();

        return request.voteCount;

    } catch (error) {
        throw error;
    }
}
