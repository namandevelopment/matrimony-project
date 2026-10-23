import { asyncHandler, apiHTTPResponse } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import { STAFF_EMPLOYEES } from "../../services/realDataService.js";
import { getIO } from "../../socket/socket.js";

// In-Memory store for internal staff team chat
let staffMessagesStore = [
  {
    _id: "smsg_1",
    senderId: "staff_002",
    senderName: "Pooja Advani",
    receiverId: "staff_001",
    receiverName: "Rajesh Vazirani",
    messageText: "Hi Rajesh, please review the proposal for Kunal Ahuja (SM10001).",
    leadRef: {
      leadId: "LD-1501",
      candidateName: "Kunal Ahuja",
      profileId: "SM10001",
    },
    isRead: true,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    _id: "smsg_2",
    senderId: "staff_001",
    senderName: "Rajesh Vazirani",
    receiverId: "staff_002",
    receiverName: "Pooja Advani",
    messageText: "Reviewed. Alliance looks promising. I will follow up with Simran's family.",
    leadRef: null,
    isRead: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: "smsg_3",
    senderId: "staff_003",
    senderName: "Deepak Mirchandani",
    receiverId: "staff_001",
    receiverName: "Rajesh Vazirani",
    messageText: "Aadhar verification approved for candidate SM10005.",
    leadRef: null,
    isRead: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

/**
 * 1. GET /api/v1/admin/chat/conversations
 * List active 1-on-1 conversations for the staff member
 */
export const getStaffConversations = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.id || req.user?.userId || "staff_001";

  // Build conversations grouped by partner
  const conversationsMap = new Map();

  for (const staff of STAFF_EMPLOYEES) {
    if (staff._id === currentUserId) continue;

    // Find last message between currentUserId and this staff member
    const relevantMsgs = staffMessagesStore.filter(
      (m) =>
        (m.senderId === currentUserId && m.receiverId === staff._id) ||
        (m.senderId === staff._id && m.receiverId === currentUserId)
    );

    const lastMsg = relevantMsgs.length > 0 ? relevantMsgs[relevantMsgs.length - 1] : null;
    const unreadCount = staffMessagesStore.filter(
      (m) => m.senderId === staff._id && m.receiverId === currentUserId && !m.isRead
    ).length;

    conversationsMap.set(staff._id, {
      partnerId: staff._id,
      partnerName: staff.fullName || staff.name,
      partnerRole: staff.role,
      partnerEmail: staff.email,
      partnerAvatar: staff.avatar || null,
      isOnline: Boolean(staff.status === "ACTIVE"),
      lastMessage: lastMsg
        ? {
            text: lastMsg.messageText,
            timestamp: lastMsg.createdAt,
            senderId: lastMsg.senderId,
            isLeadCard: Boolean(lastMsg.leadRef),
          }
        : null,
      unreadCount,
    });
  }

  const conversations = Array.from(conversationsMap.values()).sort((a, b) => {
    const timeA = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0;
    const timeB = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0;
    return timeB - timeA;
  });

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Staff chat conversations retrieved successfully.",
    conversations,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 2. GET /api/v1/admin/chat/messages/:partnerId
 * Conversation message history between logged in staff and partner
 */
export const getStaffMessages = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.id || req.user?.userId || "staff_001";
  const { partnerId } = req.params;
  const { limit = 50, page = 1 } = req.query;

  if (!partnerId) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'partnerId' is required in route params.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const threadMessages = staffMessagesStore
    .filter(
      (m) =>
        (m.senderId === currentUserId && m.receiverId === partnerId) ||
        (m.senderId === partnerId && m.receiverId === currentUserId)
    )
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const partnerInfo = STAFF_EMPLOYEES.find((s) => s._id === partnerId) || {
    _id: partnerId,
    fullName: "Staff Member",
    role: "STAFF",
  };

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Message history with ${partnerInfo.fullName || "partner"} retrieved successfully.`,
    {
      partner: {
        _id: partnerInfo._id,
        name: partnerInfo.fullName || partnerInfo.name,
        role: partnerInfo.role,
        status: partnerInfo.status,
      },
      messages: threadMessages,
      totalCount: threadMessages.length,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 3. POST /api/v1/admin/chat/messages
 * Send message with optional lead card reference
 */
export const sendStaffMessage = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.id || req.user?.userId || "staff_001";
  const currentUserName = req.user?.name || req.user?.fullName || "Staff Admin";

  const { receiverId, messageText, leadRef = null } = req.body;

  if (!receiverId) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'receiverId' is required.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  if (!messageText || typeof messageText !== "string" || !messageText.trim()) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'messageText' is required and cannot be empty.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const receiver = STAFF_EMPLOYEES.find((s) => s._id === receiverId) || {
    _id: receiverId,
    fullName: "Team Member",
  };

  const newMessage = {
    _id: `smsg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    senderId: currentUserId,
    senderName: currentUserName,
    receiverId,
    receiverName: receiver.fullName || receiver.name,
    messageText: messageText.trim(),
    leadRef: leadRef && typeof leadRef === "object" ? leadRef : null,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  staffMessagesStore.push(newMessage);

  // Broadcast real-time message via Socket.IO if active
  try {
    const io = getIO();
    if (io) {
      io.to(`user_${receiverId}`).emit("staff_chat_message", newMessage);
      io.to("admin_broadcast").emit("staff_chat_ping", {
        senderId: currentUserId,
        receiverId,
      });
    }
  } catch {
    // Socket standalone fallback handled
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_CREATED,
    "Message delivered successfully.",
    newMessage,
    CONSTANTS.CREATED,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 4. PUT /api/v1/admin/chat/messages/read
 * Mark partner messages as read
 */
export const markStaffMessagesRead = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.id || req.user?.userId || "staff_001";
  const { partnerId } = req.body;

  if (!partnerId) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'partnerId' is required in request body.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  let updatedCount = 0;
  for (const msg of staffMessagesStore) {
    if (msg.senderId === partnerId && msg.receiverId === currentUserId && !msg.isRead) {
      msg.isRead = true;
      msg.readAt = new Date().toISOString();
      updatedCount++;
    }
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `${updatedCount} messages marked as read.`,
    { partnerId, updatedCount },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});
