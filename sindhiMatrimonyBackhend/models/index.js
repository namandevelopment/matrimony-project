import User from "./users/user.model.js";
import Profile from "./users/profile.model.js";
import PartnerPreference from "./users/partnerPreference.model.js";
import ProfileAccessGrant, { ACCESS_ROLES } from "./users/profileAccessGrant.model.js";
import ProfileView from "./matchmaking/profileView.model.js";
import SuccessStory from "./stories/successStory.model.js";
import UserConversation from "./chat/userConversation.model.js";
import UserMessage from "./chat/userMessage.model.js";
import MembershipPlan from "./plans/membershipPlan.model.js";
import UserSubscription from "./plans/userSubscription.model.js";
import LegalContent from "./common/legalContent.model.js";
import OurProcess from "./common/ourProcess.model.js";
import HelpSupport from "./support/helpSupport.model.js";
import SupportTicket from "./support/supportTicket.model.js";
import Employee from "./employees/employee.model.js";

export {
  User,
  Profile,
  PartnerPreference,
  ProfileAccessGrant,
  ACCESS_ROLES,
  ProfileView,
  SuccessStory,
  UserConversation,
  UserMessage,
  MembershipPlan,
  UserSubscription,
  LegalContent,
  OurProcess,
  HelpSupport,
  SupportTicket,
  Employee,
};

export const Models = {
  User,
  Profile,
  PartnerPreference,
  ProfileAccessGrant,
  ACCESS_ROLES,
  ProfileView,
  SuccessStory,
  UserConversation,
  UserMessage,
  MembershipPlan,
  UserSubscription,
  LegalContent,
  OurProcess,
  HelpSupport,
  SupportTicket,
  Employee,
};

export default Models;

