const { REQUEST_STATUS, USER_ROLE } = require('../../constants/constants');
const statisticservice = require('../..//services/statisticService/statistic.service');

exports.getStatistic = async (req, res) => {
    try {
        const totalRequestPending = await statisticservice.getTotalRequestByStatus(REQUEST_STATUS.PENDING);
        const totalRequestRescuing = await statisticservice.getTotalRequestByStatus(REQUEST_STATUS.RESCUING);
        const totalRequestRescued = await statisticservice.getTotalRequestByStatus(REQUEST_STATUS.RESCUED);
        const totalRequestRejected = await statisticservice.getTotalRequestByStatus(REQUEST_STATUS.REJECTED);
        const totalRequests = await statisticservice.getTotalRequestByStatus('');

        const totalUsers = await statisticservice.getTotalUserByRole(USER_ROLE.USER);
        const totalRescuers = await statisticservice.getTotalUserByRole(USER_ROLE.RESCUER);

        const statistic = {
            totalRequestPending,
            totalRequestRescuing,
            totalRequestRescued,
            totalRequestRejected,
            totalUsers,
            totalRescuers,
            totalRequests
        }

        return res.status(200).json(statistic);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
