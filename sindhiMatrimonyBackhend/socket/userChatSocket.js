import { UserConversation, UserMessage, Profile, User } from "../models/index.js";
import { verifyAndConsumeChatQuota } from "../services/chatQuotaService.js";
import { logMessage } from "../utils/globalFunction.js";

/**
 * ⚡ Real-Time Candidate-to-Candidate 1-on-1 Chat Socket Handler
 * @param {import("socket.io").Server} io
 * @param {import("socket.io").Socket} socket
 */
export const registerUserChatSocket = (io, socket) => {
  const senderUserId =
    socket.user?.id ||
    socket.user?._id ||
    socket.user?.userId;

  if (!senderUserId) return;

  // 1. Join Conversation Room
  socket.on("join_conversation", (data) => {
    const { conversationId } = data || {};
    if (conversationId) {
      socket.join(`conv_${conversationId}`);
      logMessage(`💬 Socket ${socket.id} joined conversation room: conv_${conversationId}`, null, "info");
    }
  });

  // 2. Leave Conversation Room
  socket.on("leave_conversation", (data) => {
    const { conversationId } = data || {};
    if (conversationId) {
      socket.leave(`conv_${conversationId}`);
      logMessage(`👋 Socket ${socket.id} left conversation room: conv_${conversationId}`, null, "info");
    }
  });

  // 3. User Typing Indicator
  socket.on("typing", (data) => {
    const { conversationId, recipientUserId } = data || {};
    if (conversationId) {
      socket.to(`conv_${conversationId}`).emit("user_typing", {
        conversationId,
        senderUserId,
      });
    }
    if (recipientUserId) {
      io.to(`user_${recipientUserId}`).emit("user_typing", {
        conversationId,
        senderUserId,
      });
    }
  });

  // 4. User Stop Typing Indicator
  socket.on("stop_typing", (data) => {
    const { conversationId, recipientUserId } = data || {};
    if (conversationId) {
      socket.to(`conv_${conversationId}`).emit("user_stop_typing", {
        conversationId,
        senderUserId,
      });
    }
    if (recipientUserId) {
      io.to(`user_${recipientUserId}`).emit("user_stop_typing", {
        conversationId,
        senderUserId,
      });
    }
  });

  // 5. Send Real-Time Chat Message with Plan & Trial Verification
  socket.on("send_message", async (data, callback) => {
    try {
      const {
        conversationId: providedConvId,
        recipientProfileId,
        recipientUserId: providedRecipientUserId,
        text,
        messageType = "TEXT",
      } = data || {};

      if (!text || !text.trim()) {
        const errResp = { success: false, message: "Message text cannot be empty." };
        if (typeof callback === "function") callback(errResp);
        return socket.emit("chat_error", errResp);
      }

      // Resolve Sender Active Profile
      let senderProfileId = socket.user?.activeProfileId || socket.user?.profileId;
      if (!senderProfileId) {
        const senderUser = await User.findById(senderUserId).select("activeProfileId").lean();
        senderProfileId = senderUser?.activeProfileId;
      }

      // Check Plan & Trial Message Quota (FREE user: 5 trial msgs, PAID user: unlimited direct chat)
      const quotaCheck = await verifyAndConsumeChatQuota(senderUserId, senderProfileId);

      if (!quotaCheck.allowed) {
        const quotaError = {
          success: false,
          code: quotaCheck.code || "PLAN_REQUIRED_TO_CHAT",
          message:
            quotaCheck.message ||
            "Your 5 free trial messages have ended. Please upgrade to a paid membership plan to continue chatting.",
          remainingTrialMessages: 0,
          upgradeRequired: true,
        };
        if (typeof callback === "function") callback(quotaError);
        return socket.emit("chat_error", quotaError);
      }

      // Resolve Recipient Profile & User
      let recipientProfile = null;
      let recipientUserId = providedRecipientUserId;

      if (recipientProfileId) {
        recipientProfile = await Profile.findById(recipientProfileId).select("userId name avatar status").lean();
        if (recipientProfile) {
          recipientUserId = recipientProfile.userId;
        }
      }

      if (!recipientUserId && !providedConvId) {
        const errResp = { success: false, message: "Recipient user could not be determined." };
        if (typeof callback === "function") callback(errResp);
        return socket.emit("chat_error", errResp);
      }

      // Prevent sending messages to self
      if (recipientUserId && recipientUserId.toString() === senderUserId.toString()) {
        const errResp = { success: false, message: "You cannot message your own profile." };
        if (typeof callback === "function") callback(errResp);
        return socket.emit("chat_error", errResp);
      }

      // Find or Create Conversation Thread
      let conversation = null;
      if (providedConvId) {
        conversation = await UserConversation.findById(providedConvId);
      }

      if (!conversation && recipientProfileId && senderProfileId) {
        conversation = await UserConversation.findOne({
          participants: { $all: [senderProfileId, recipientProfileId] },
        });

        if (!conversation) {
          conversation = await UserConversation.create({
            participants: [senderProfileId, recipientProfileId],
            participantUserIds: [senderUserId, recipientUserId],
            lastMessage: {
              text: text.trim(),
              senderProfileId,
              senderUserId,
              timestamp: Date.now(),
              isRead: false,
            },
            status: "ACTIVE",
          });
        }
      }

      const activeConvId = conversation?._id || providedConvId;

      // Create & Persist Message in Database
      const messageDoc = await UserMessage.create({
        conversationId: activeConvId,
        senderUserId,
        senderProfileId: senderProfileId || null,
        recipientUserId: recipientUserId || null,
        recipientProfileId: recipientProfileId || null,
        text: text.trim(),
        messageType,
        status: "SENT",
        isTrialMessage: quotaCheck.isTrial || false,
      });

      // Update Conversation Last Message & Unread Count
      if (conversation) {
        conversation.lastMessage = {
          text: text.trim(),
          senderProfileId: senderProfileId || null,
          senderUserId,
          timestamp: Date.now(),
          isRead: false,
        };

        if (recipientProfileId) {
          const currentCount = conversation.unreadCounts?.get(recipientProfileId.toString()) || 0;
          conversation.set(`unreadCounts.${recipientProfileId.toString()}`, currentCount + 1);
        }
        await conversation.save();
      }

      const outboundPayload = {
        _id: messageDoc._id,
        conversationId: activeConvId,
        senderUserId,
        senderProfileId,
        recipientUserId,
        recipientProfileId,
        text: text.trim(),
        messageType,
        status: "SENT",
        isTrialMessage: quotaCheck.isTrial,
        createdAt: messageDoc.createdAt || Date.now(),
      };

      // Broadcast to Conversation Room
      if (activeConvId) {
        io.to(`conv_${activeConvId}`).emit("new_message", outboundPayload);
      }

      // Direct Broadcast to Recipient's User Room
      if (recipientUserId) {
        io.to(`user_${recipientUserId}`).emit("new_message", outboundPayload);
        io.to(`user_${recipientUserId}`).emit("conversation_updated", {
          conversationId: activeConvId,
          lastMessage: outboundPayload,
        });
      }

      // Acknowledge Sender
      const successResp = {
        success: true,
        message: "Message sent successfully.",
        data: outboundPayload,
        chatQuota: {
          isPaid: quotaCheck.status?.isPaid || false,
          isUnlimited: quotaCheck.isUnlimited || false,
          remainingTrialMessages: quotaCheck.remainingTrialMessages,
        },
      };

      if (typeof callback === "function") callback(successResp);
      socket.emit("message_sent", successResp);
    } catch (err) {
      logMessage("Error in Socket send_message handler:", err, "error");
      const errResp = { success: false, message: "Failed to send message: " + (err.message || err) };
      if (typeof callback === "function") callback(errResp);
      socket.emit("chat_error", errResp);
    }
  });

  // 6. Mark Conversation Messages as Read
  socket.on("mark_read", async (data, callback) => {
    try {
      const { conversationId, senderUserId: originalSenderId } = data || {};
      if (!conversationId) return;

      await UserMessage.updateMany(
        { conversationId, recipientUserId: senderUserId, status: { $ne: "READ" } },
        { $set: { status: "READ", readAt: Date.now() } }
      );

      const conv = await UserConversation.findById(conversationId);
      if (conv && socket.user?.activeProfileId) {
        conv.set(`unreadCounts.${socket.user.activeProfileId.toString()}`, 0);
        await conv.save();
      }

      const readPayload = {
        conversationId,
        readByUserId: senderUserId,
        readAt: Date.now(),
      };

      io.to(`conv_${conversationId}`).emit("messages_read", readPayload);

      if (originalSenderId) {
        io.to(`user_${originalSenderId}`).emit("messages_read", readPayload);
      }

      if (typeof callback === "function") {
        callback({ success: true, ...readPayload });
      }
    } catch (err) {
      logMessage("Error in mark_read socket handler:", err, "error");
    }
  });
};

export default registerUserChatSocket;
