import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getSocketId, io } from "../socket/socket.js";
import { ApiResponse } from "../utils/api-response.js";



//for chatting
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.userId;
        const receiverId = req.params.id;
        const { textMessage: message } = req.body;
        console.log(message)

        let conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, receiverId]
            }
        })
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message: message
        })
        if (newMessage) {
            conversation.messages.push(newMessage._id)
            await conversation.save()
        }
        //implement socketio 
        const receiverSocketId = getSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage)
        }
        return res.status(201).json(new ApiResponse(201, newMessage, "Message send"))
    } catch (error) {
        console.log("Error in SendMessage : ", error)
    }
}

export const getMessage = async (req, res) => {

    const senderId = req.userId;
    const receiverId = req.params.id;
    const conversation = await Conversation.findOne({
        participants: {
            $all: [senderId, receiverId]
        }
    }).populate({
        path: "messages",
        options: { sort: { createdAt: 1 } }, // ✅ oldest → newest
        select: "senderId message createdAt"       // ✅ only needed fields
      });
    if (!conversation) return res.status(200).json(new ApiResponse(200, { messages: [] }, "message fetched"))

    return res.status(200).json(new ApiResponse(200,  conversation?.messages, "message fetched"))

}
