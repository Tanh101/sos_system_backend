module.exports = {
    handleClientRequest: (io, socket, data, rescuers) => {
        console.log('Client request:', data);
        // Gửi yêu cầu đến tất cả rescuer
        rescuers.forEach((rescuer) => {
            io.to(rescuer.id).emit('newRequest', {...data, clientId: socket.id });
        });
    },
    sendResponseToClient: (io, data) => {
        console.log('Send response to client:', data);

    }
};