// export const BASE_URL = 'https://dev-streemo.jamsara.com';
export const BASE_URL = 'https://api.sindhiMatrimony.co.in';
// export const BASE_URL = 'https://twilight-blissful-stark.ngrok-free.dev'; //SANJU SIR

export const SOCKET_URL = `https://api.streamo.co.in/socket`
// export const SOCKET_URL = `https://twilight-blissful-stark.ngrok-free.dev/socket`

export const SHARE_URL = `http://streamo.coin/feed/`


export const ApiURL = {
    sendOtp: `${BASE_URL}/api/v1/auth/sendOtp`,
    login: `${BASE_URL}/api/v1/auth/login`,
    sendOtpForForgotPassword: `${BASE_URL}/api/v1/auth/sendOtpForForgotPassword`,//NEW
    verifyForgotPasswordOtp: `${BASE_URL}/api/v1/auth/verifyForgotPasswordOtp`,//NEW
    changeForgotPassword: `${BASE_URL}/api/v1/auth/changeForgotPassword`,//NEW
    logout: `${BASE_URL}/api/v1/auth/userLogout`,
    userRegisterSteps: `${BASE_URL}/api/v1/auth/userRegisterSteps`,
    reSendOtp: `${BASE_URL}/api/v1/auth/reSendOtp`,
    getCountriesListForMobile: `${BASE_URL}/api/v1/settings/getCountriesListForMobile`,
    upload: `${BASE_URL}/api/v1/file-uploader/upload`,
    upload_via_token: `${BASE_URL}/api/v1/file-uploader/upload-via-token`,
    popularProfiles: `${BASE_URL}/api/v1/user/popularProfiles`,
    getUserProfile: `${BASE_URL}/api/v1/user/getUserProfile`,
    getLiveStreams: `${BASE_URL}/api/v1/live-stream/getLiveStreams`,
    followUsers: `${BASE_URL}/api/v1/user/followUsers`,
    followUser: `${BASE_URL}/api/v1/user/followUser`,
    startStream: `${BASE_URL}/api/v1/live-stream/startStream`,
    joinStream: `${BASE_URL}/api/v1/live-stream/joinStream`,
    store_and_mall: `${BASE_URL}/api/v1/store-and-mall/getListForMobile`,
    getGiftList: `${BASE_URL}/api/v1/gifts/getListForMobile`,
    sendGift: `${BASE_URL}/api/v1/live-stream/sendGift`,
    coin_plans: `${BASE_URL}/api/v1/coin-plans/getListForMobile`,
    buyCoins: `${BASE_URL}/api/v1/coin-plans/buyCoins`,
    fileUploaderUpload: `${BASE_URL}/api/v1/file-uploader/upload`,
    getMyWithdrawalList: `${BASE_URL}/api/v1/transactions/getMyWithdrawalList`,
    getFollowDataForMobile: `${BASE_URL}/api/v1/user/getFollowDataForMobile`,
    getStreamActiveUsers: `${BASE_URL}/api/v1/live-stream/getStreamActiveUsers`,
    updateUserProfile: `${BASE_URL}/api/v1/user/updateUserProfile`,
    getLanguageList: `${BASE_URL}/api/v1/settings/getLanguageList`,
    getInterestsList: `${BASE_URL}/api/v1/settings/getInterestsList`,
    googleLogin: `${BASE_URL}/api/v1/auth/googleLogin`,
    getHostsForInvite: `${BASE_URL}/api/v1/live-stream/getHostsForInvite`,
    getStreamModerators: `${BASE_URL}/api/v1/live-stream/getStreamModerators`,
    setStreamModerators: `${BASE_URL}/api/v1/live-stream/setStreamModerators`,
    buyAristocracyPlan: `${BASE_URL}/api/v1/aristocracy/buyAristocracyPlan`,
    aristocracyGetListForMobile: `${BASE_URL}/api/v1/aristocracy/getListForMobile`,
    updatePrivacySetting: `${BASE_URL}/api/v1/user/updatePrivacySetting`,
    loginToProtect: `${BASE_URL}/api/v1/user/loginToProtect`,
    linkGoogle: `${BASE_URL}/api/v1/auth/linkGoogle`,
    unLinkGoogle: `${BASE_URL}/api/v1/auth/unLinkGoogle`,
    setTransactionPassword: `${BASE_URL}/api/v1/user/setTransactionPassword`,
    sendOtpGeneric: `${BASE_URL}/api/v1/user/sendOtpGeneric`,
    verifyOtpGeneric: `${BASE_URL}/api/v1/user/verifyOtpGeneric`,
    resetTransactionPassword: `${BASE_URL}/api/v1/user/resetTransactionPassword`,
    updatePassword: `${BASE_URL}/api/v1/user/updatePassword`,
    linkPhoneNumber: `${BASE_URL}/api/v1/auth/linkPhoneNumber`,
    verifyPassword: `${BASE_URL}/api/v1/auth/verifyPassword`,




    //NEW APIS
    banner_getListForMobile: `${BASE_URL}/api/v1/banner/getListForMobile`, //GET
    getExchangeRates: `${BASE_URL}/api/v1/transactions/getExchangeRates`, //GET
    diamondsToCoin: `${BASE_URL}/api/v1/transactions/diamondsToCoin`, //GET
    getAmountInCurrency: `${BASE_URL}/api/v1/transactions/getAmountInCurrency`, //GET 
    addBank: `${BASE_URL}/api/v1/bank/add`, //GET /
    bankList: `${BASE_URL}/api/v1/bank/list`, //GET 
    setDefaultBank: `${BASE_URL}/api/v1/bank/setDefaultBank`, //PUT 
    makeWithdrawalRequest: `${BASE_URL}/api/v1/transactions/makeWithdrawalRequest`, //POST 
    getTransactionListForMobile: `${BASE_URL}/api/v1/transactions/getTransactionListForMobile`, //GET 
    getAppConfig: `${BASE_URL}/api/v1/settings/getAppConfig`, //GET 
    saveFamily: `${BASE_URL}/api/v1/family/saveFamily`, //GET 
    getMyFamily: `${BASE_URL}/api/v1/family/getMyFamily`, //GET 
    getFamilyMember: `${BASE_URL}/api/v1/family/getFamilyMember`, //GET 
    userListForaddMember: `${BASE_URL}/api/v1/family/userListForaddMember`, //GET 
    addMemberToFamily: `${BASE_URL}/api/v1/family/addMemberToFamily`, //GET 
    getStorePrivilegesList: `${BASE_URL}/api/v1/aristocracy/getStorePrivilegesList`, //GET 
    buyPrivileges: `${BASE_URL}/api/v1/aristocracy/buyPrivileges`, //POST 
    getMyBacpack: `${BASE_URL}/api/v1/aristocracy/getMyBacpack`, //GET 
    getFeedList: `${BASE_URL}/api/v1/feed/getFeedList`, //GET 
    createPost: `${BASE_URL}/api/v1/feed/createOrUpdatePost`, //GET createOrUpdatePost
    // createPost: `${BASE_URL}/api/v1/feed/createPost`, //GET createOrUpdatePost  
    deletePost: `${BASE_URL}/api/v1/feed/deletePost`, //GET 
    getUserLevelListForMobile: `${BASE_URL}/api/v1/levels/getListForMobile`, //GET 
    toggleLike: `${BASE_URL}/api/v1/feed/like/toggleLike`, //GET 
    getComments: `${BASE_URL}/api/v1/feed/comment/getComments`,
    addComment: `${BASE_URL}/api/v1/feed/comment/addComment`,
    deleteComment: `${BASE_URL}/api/v1/feed/comment/deleteComment`,
    getLiveFriends: `${BASE_URL}/api/v1/user/getLiveFriends`, // MESSAGE SCREEN PR TOP DATA K LIYE 
    getConversationList: `${BASE_URL}/api/v1/user/getConversationList`, // MESSAGE SCREEN List PRINT K LIYE 
    getConversationChatList: `${BASE_URL}/api/v1/user/getConversationChatList`, // MESSAGE SCREEN List PRINT K LIYE 
    toggleMuteConversation: `${BASE_URL}/api/v1/user/toggleMuteConversation`,
    togglePinConversation: `${BASE_URL}/api/v1/user/togglePinConversation`,
    clearChat: `${BASE_URL}/api/v1/user/clearChat`,
    deleteAndClearChat: `${BASE_URL}/api/v1/user/deleteAndClearChat`,
    blockUser: `${BASE_URL}/api/v1/user/blockUser`,
    updateTransactionPassword: `${BASE_URL}/api/v1/user/updateTransactionPassword`,
    resetUserPassword: `${BASE_URL}/api/v1/user/resetUserPassword`,
    deleteAccount: `${BASE_URL}/api/v1/auth/deleteAccount`,
    setGestureLock: `${BASE_URL}/api/v1/user/setGestureLock`,
    toggleGestureLockEnable: `${BASE_URL}/api/v1/user/toggleGestureLockEnable`,
    updateNotificationSetting: `${BASE_URL}/api/v1/user/updateNotificationSetting`,
    broadNotificationUsers: `${BASE_URL}/api/v1/user/broadNotificationUsers`,
    forgetGestureLock: `${BASE_URL}/api/v1/user/forgetGestureLock`,
    liveBroadCastReminder: `${BASE_URL}/api/v1/user/liveBroadCastReminder`,
    getLevelPrivileges: `${BASE_URL}/api/v1/levels/getLevelPrivileges`,
    getTransactionSummeryForMobile: `${BASE_URL}/api/v1/transactions/getTransactionSummeryForMobile`,
    pausesResumePrivileges: `${BASE_URL}/api/v1/aristocracy/pausesResumePrivileges`,
    userListForSendPrivileges: `${BASE_URL}/api/v1/aristocracy/userListForSendPrivileges`,
    pausesResumePrivilegesByEffectType: `${BASE_URL}/api/v1/aristocracy/pausesResumePrivilegesByEffectType`,
    sendPrivileges: `${BASE_URL}/api/v1/aristocracy/sendPrivileges`,
    updateUserProfileImages: `${BASE_URL}/api/v1/user/updateUserProfileImages`,
    bindAgencyCode: `${BASE_URL}/api/v1/hostRequest/bindAgencyCode`,
    getMyRequest: `${BASE_URL}/api/v1/hostRequest/getMyRequest`,
    faceVerify: `${BASE_URL}/api/v1/hostRequest/faceVerify`,
    report_types: `${BASE_URL}/api/v1/settings/report-types?refModel=User`,
    report: `${BASE_URL}/api/v1/user/report`,
    getTopFansList: `${BASE_URL}/api/v1/user/getTopFansList`,
    blockedUsers: `${BASE_URL}/api/v1/user/blockedUsers`,
    joinFamilyRequest: `${BASE_URL}/api/v1/family/joinFamilyRequest`,
    getFamilyRanking: `${BASE_URL}/api/v1/family/getFamilyRanking`,
    joinRequest: `${BASE_URL}/api/v1/family/joinRequest`,
    getFamilyConfig: `${BASE_URL}/api/v1/settings/getFamilyConfig`,
    getFamilyContribution: `${BASE_URL}/api/v1/family/getFamilyContribution`,
    searchFamily: `${BASE_URL}/api/v1/family/searchFamily`,
    addMember: `${BASE_URL}/api/v1/family/addMember`,
    joinRequestList: `${BASE_URL}/api/v1/family/joinRequestList`,
    handleJoinRequest: `${BASE_URL}/api/v1/family/handleJoinRequest`,
    removeMember: `${BASE_URL}/api/v1/family/removeMember`,
    leaveFamily: `${BASE_URL}/api/v1/family/leaveFamily`,
    updateFamilySettings: `${BASE_URL}/api/v1/family/updateFamilySettings`,
    sendGiftToUser: `${BASE_URL}/api/v1/gifts/sendGiftToUser`,
    conversationUserSearch: `${BASE_URL}/api/v1/user/conversationUserSearch`,
    getLeaderBoardRewardList: `${BASE_URL}/api/v1/user/getLeaderBoardRewardList`,
    getLeaderBoardList: `${BASE_URL}/api/v1/user/getLeaderBoardList`,
    verifyPhoneLinkOtp: `${BASE_URL}/api/v1/auth/verifyPhoneLinkOtp`,
    sharePost: `${BASE_URL}/api/v1/feed/share/sharePost`,
    share_users_list: `${BASE_URL}/api/v1/feed/share/users`,
    toggleView: `${BASE_URL}/api/v1/feed/toggleView`,
    user_report: `${BASE_URL}/api/v1/user/report`,
    feed_details: `${BASE_URL}/api/v1/feed/details`,
    searchUser: `${BASE_URL}/api/v1/user/searchUser`,
    popup_api: `${BASE_URL}/api/v1/popup/users/startup-config`,
    popup_view: `${BASE_URL}/api/v1/popup/users/view`,   // "popup_type": " 
    popup_click: `${BASE_URL}/api/v1/popup/users/click`, // "popup_type": "external-redirect", 
    daily_reward: `${BASE_URL}/api/v1/popup/daily-reward/users/config`, // "popup_type": "external-redirect", 
    daily_reward_claim: `${BASE_URL}/api/v1/popup/daily-reward/users/claim`, // "popup_type": "external-redirect", 

    // =========================================================================
    // 💍 OFFICIAL SINDHI MATRIMONY CORE MOBILE ENDPOINTS
    // =========================================================================
    // 1. Startup & Master Dropdowns (Zero Token Required)
    commonDropdowns: `${BASE_URL}/api/v1/common/dropdowns`,

    // 2. Authentication & Onboarding
    authSendOtp: `${BASE_URL}/api/v1/auth/send-otp`,
    authVerifyOtp: `${BASE_URL}/api/v1/auth/verify-otp`,
    authResendOtp: `${BASE_URL}/api/v1/auth/resend-otp`,
    authLogin: `${BASE_URL}/api/v1/auth/login`,
    authRegister: `${BASE_URL}/api/v1/auth/register`,
    authForgotPasswordSendOtp: `${BASE_URL}/api/v1/auth/forgot-password/send-otp`,
    authForgotPasswordVerifyOtp: `${BASE_URL}/api/v1/auth/forgot-password/verify-otp`,
    authForgotPasswordReset: `${BASE_URL}/api/v1/auth/forgot-password/reset`,
    authLogout: `${BASE_URL}/api/v1/auth/logout`,

    // 3. Home Feed & Quick Action Dashboard
    homeFeed: `${BASE_URL}/api/v1/feed/home`,

    // 4. Matches Discovery Feed (Cursor Paginated)
    matchesRecommendations: `${BASE_URL}/api/v1/matches/recommendations`,

    // 5. Connection Interests
    interestsReceived: `${BASE_URL}/api/v1/interests/received`,
    interestsSent: `${BASE_URL}/api/v1/interests/sent`,
    interestsSend: `${BASE_URL}/api/v1/interests/send`,
    interestsAccept: (id: string) => `${BASE_URL}/api/v1/interests/${id}/accept`,
    interestsDecline: (id: string) => `${BASE_URL}/api/v1/interests/${id}/decline`,

    // 6. Real-Time Chat & Messages
    chatConversations: `${BASE_URL}/api/v1/chat/conversations`,
    chatMessages: (conversationId: string) => `${BASE_URL}/api/v1/chat/messages/${conversationId}`,
    chatSendMessage: `${BASE_URL}/api/v1/chat/messages/send`,
    chatClearConversation: (conversationId: string) => `${BASE_URL}/api/v1/chat/conversations/${conversationId}/clear`,

    // 7. Advanced Community Search
    searchMembers: `${BASE_URL}/api/v1/members/search`,

    // 8. Membership & Payments
    getPlans: `${BASE_URL}/api/v1/plans`,
    createPaymentOrder: `${BASE_URL}/api/v1/payments/create-order`,
    verifyPaymentSignature: `${BASE_URL}/api/v1/payments/verify`,

    // 9. Profile Viewing & Multi-Section Edit
    getProfileMe: `${BASE_URL}/api/v1/profile/me`,
    updateProfileBasic: `${BASE_URL}/api/v1/profile/basic`,
    updateProfileEducationCareer: `${BASE_URL}/api/v1/profile/education-career`,
    updateProfileFamily: `${BASE_URL}/api/v1/profile/family`,
    updateProfileHoroscope: `${BASE_URL}/api/v1/profile/horoscope`,
    updatePartnerPreferences: `${BASE_URL}/api/v1/profile/partner-preferences`,
    uploadProfilePhoto: `${BASE_URL}/api/v1/profile/photos`,
    deleteProfilePhoto: (photoId: string) => `${BASE_URL}/api/v1/profile/photos/${photoId}`,

    // 10. Profile Verification & KYC Desk
    kycSelfieVerify: `${BASE_URL}/api/v1/kyc/selfie`,
    kycAadhaarVerify: `${BASE_URL}/api/v1/kyc/aadhaar`,
    kycStatus: `${BASE_URL}/api/v1/kyc/status`,

    // 11. In-App Notifications & FCM
    getNotificationsList: `${BASE_URL}/api/v1/notifications`,
    markNotificationAsRead: (notificationId: string) => `${BASE_URL}/api/v1/notifications/${notificationId}/read`,
    markAllNotificationsAsRead: `${BASE_URL}/api/v1/notifications/mark-all-read`,
    deleteNotificationItem: (notificationId: string) => `${BASE_URL}/api/v1/notifications/${notificationId}`,
    updateFcmDeviceToken: `${BASE_URL}/api/v1/notifications/fcm-token`,

    // 12. Support & Help Center
    supportConfig: `${BASE_URL}/api/v1/support/config`,
    createSupportTicket: `${BASE_URL}/api/v1/support/tickets`,

    // 13. Settings, Privacy & Account Deletion
    updatePrivacySettings: `${BASE_URL}/api/v1/settings/privacy`,
    updateNotificationPreferences: `${BASE_URL}/api/v1/settings/notifications`,
    deleteUserAccount: `${BASE_URL}/api/v1/account/delete`,

    // 14. WatermelonDB Delta Sync Engine
    syncPullDelta: `${BASE_URL}/api/v1/sync/pull`,
    syncPushDelta: `${BASE_URL}/api/v1/sync/push`,
    syncMasterVersion: `${BASE_URL}/api/v1/sync/version`,
};


