import {
  getContent,
  getContentByType,
  updateContent,
  submitSupportTicket,
  getMySupportTickets,
  fetchHelpSupport,
} from "../common/contentMasterController.js";
import { HTTP_OK, OK, ERROR_FALSE } from "../../utils/constants.js";
import { apiHTTPResponse } from "../../utils/globalFunction.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

/**
 * 📞 Get Help & Support info
 */
export const getHelpSupport = asyncHandler(async (req, res) => {
  req.query.type = "help-support";
  return getContent(req, res);
});

/**
 * ❓ Get FAQs with optional category or keyword filtering
 */
export const getFaqs = asyncHandler(async (req, res) => {
  const { category, q } = req.query;
  const data = await fetchHelpSupport({ category, q });
  return apiHTTPResponse(
    req,
    res,
    HTTP_OK,
    "FAQs retrieved successfully.",
    {
      faqs: data.faqs,
      categories: data.categories,
      totalFaqsCount: data.totalFaqsCount,
    },
    OK,
    ERROR_FALSE
  );
});

export {
  getContent,
  getContentByType,
  updateContent,
  submitSupportTicket,
  getMySupportTickets,
};
