const voteService = require('../../services/voteService/vote.service');
const { VOTE_TYPE } = require("../../constants/constants");
const requestService = require("../../services/requestService/request.service");

exports.vote = async (req, res) => {
    try {
        const userId = req.user.id;
        const requestId = req.params.id;
        const { voteType } = req.body;

        const request = await requestService.isExistRequest(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' })
        }

        if (!userId || !requestId || voteType === "") {
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        if (![VOTE_TYPE.upvote, VOTE_TYPE.downvote, VOTE_TYPE.none].includes(voteType)) {
            return res.status(400).json({ message: 'Invalid vote type' });
        }
        let voteCount;
        if (voteType === VOTE_TYPE.upvote) {
            voteCount = await voteService.upvote(userId, requestId);
        } else if (voteType === VOTE_TYPE.downvote) {
            voteCount = await voteService.downvote(userId, requestId);
        }else{
            voteCount = await voteService.setNone(userId, requestId);
        }
        return res.status(200).json({
            message: 'Vote successfully',
            voteCount: voteCount
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
