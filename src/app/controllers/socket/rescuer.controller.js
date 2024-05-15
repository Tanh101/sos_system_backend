module.exports = {
    handleRescuerJoin: (socket, rescuers) => {
        console.log("Rescuer joined: ", socket.id);
        rescuers.push({ id: socket.id });
    },
    handleRescuerResponse: (io, socket, data, clientController) => {
        console.log("tesstttt response:", data);
        // Gửi phản hồi về cho client qua clientController
        io.to(data.clientId).emit("responseFromRescuer", data);
    },
    handleDisconnect: (socket, rescuers) => {
        // Loại bỏ rescuer khi họ ngắt kết nối
        return rescuers.filter((rescuer) => rescuer.id !== socket.id);
    },
};