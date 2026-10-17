import User from "./users/user.model.js";
import Profile from "./users/profile.model.js";
import PartnerPreference from "./users/partnerPreference.model.js";
import ProfileAccessGrant, { ACCESS_ROLES } from "./users/profileAccessGrant.model.js";

export { User, Profile, PartnerPreference, ProfileAccessGrant, ACCESS_ROLES };

export const Models = {
  User,
  Profile,
  PartnerPreference,
  ProfileAccessGrant,
  ACCESS_ROLES,
};

export default Models;
