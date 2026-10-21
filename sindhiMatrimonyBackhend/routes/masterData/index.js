import express from "express";
import {
  getDropdowns,
  getEntityDropdown,
  getBootstrapConfig,
  getSubcastes,
  getGotras,
  lookupSurname,
  getOccupationsAndEducation,
  getCountries,
  getCities,
  getHoroscopeOptions,
} from "../../controllers/masterData/masterDataController.js";

const router = express.Router();

/**
 * @route   GET /api/v1/master/dropdowns
 * @desc    Get selective or complete dropdown configuration (supports ?select=...)
 * @access  Public
 */
router.get("/dropdowns", getDropdowns);

/**
 * @route   GET /api/v1/master/dropdowns/:entity
 * @desc    Get single dropdown entity (e.g. gender, castes, gotras, cities, heights)
 * @access  Public
 */
router.get("/dropdowns/:entity", getEntityDropdown);

/**
 * @route   GET /api/v1/master/bootstrap
 * @desc    Get complete unified dropdown configuration bundle (Cached with ETag)
 * @access  Public
 */
router.get("/bootstrap", getBootstrapConfig);

/**
 * @route   GET /api/v1/master/subcastes
 * @desc    Get all Sindhi subcastes with descriptions
 * @access  Public
 */
router.get("/subcastes", getSubcastes);

/**
 * @route   GET /api/v1/master/gotras
 * @desc    Get Sindhi gotras (filterable by subcaste and search)
 * @access  Public
 */
router.get("/gotras", getGotras);

/**
 * @route   GET /api/v1/master/surnames/lookup
 * @desc    Smart Sindhi surname lookup (auto-detects Gotra and Subcaste)
 * @access  Public
 */
router.get("/surnames/lookup", lookupSurname);

/**
 * @route   GET /api/v1/master/occupations
 * @desc    Get education degrees, employment sectors, popular occupations & income slabs
 * @access  Public
 */
router.get("/occupations", getOccupationsAndEducation);

/**
 * @route   GET /api/v1/master/locations/countries
 * @desc    Get countries with prominent Sindhi diaspora
 * @access  Public
 */
router.get("/locations/countries", getCountries);

/**
 * @route   GET /api/v1/master/locations/cities
 * @desc    Search and filter major cities & Sindhi diaspora hubs
 * @access  Public
 */
router.get("/locations/cities", getCities);

/**
 * @route   GET /api/v1/master/horoscope
 * @desc    Get Manglik options, 12 Raas, and 27 Vedic Nakshatras
 * @access  Public
 */
router.get("/horoscope", getHoroscopeOptions);

export default router;
