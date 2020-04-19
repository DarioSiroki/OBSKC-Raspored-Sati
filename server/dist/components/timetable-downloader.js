"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
/**
 * Handles checking for new timetable versions online and fetching them.
 */
class TimetableDownloader {
    constructor() {
        /**
         * Holds the timetables available on index page.
         */
        this._timetables = [];
        /**
         * Index page with timetables, usually for current and next week if it's wednesday or later.
         */
        this._indexPage = "http://ss-obrtnicka-koprivnica.skole.hr/rasporedsati?dm2_foldercontents=103&forcetpl=1&mshow=mod_docman&onlylid=mod_docman";
    }
    /**
     * Fetch new versions of timetables if they exist as array buffers.
     */
    async Download() {
        if (this._timetables.length === 0)
            await this._getAvailableTimetables();
        let timetables = [];
        const currentDate = new Date();
        for (const timetable of this._timetables) {
            if (timetable.date > currentDate) {
                try {
                    const response = await axios_1.default({
                        method: "get",
                        url: `http://ss-obrtnicka-koprivnica.skole.hr/rasporedsati?dm_document_id=${timetable.id}&dm_rev=1&dm_dnl=1`,
                        responseType: "arraybuffer"
                    });
                    timetable.data = response.data;
                    timetables.push(timetable);
                }
                catch (error) {
                    throw new Error(`Error fetching timetable:\n${error}`);
                }
            }
        }
        return timetables;
    }
    /**
     * Checks for updates.
     */
    async IsUpdateable() {
        if (this._timetables.length === 0)
            await this._getAvailableTimetables();
        // If any of the timetables is newer then today, return true
        const currentDate = new Date();
        for (const timetable of this._timetables) {
            if (timetable.date > currentDate)
                return true;
        }
        return false;
    }
    /**
     * Get versions page and extract timetables from it
     */
    async _getAvailableTimetables() {
        // Get index page HTML
        const versionsPage = await this._getPageWithTimetables();
        // Extract timetables from it
        this._timetables = this._extractTimetablesFromHTML(versionsPage);
    }
    /**
     * Fetch page which contains timetables.
     */
    async _getPageWithTimetables() {
        try {
            const response = await axios_1.default({
                method: "get",
                url: this._indexPage
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Error fetching index page which contains timetables:\n${error}`);
        }
    }
    /**
     * Extracts timetable urls from website passed as parameter.
     * @param html HTML data from which timetable urls are extracted.
     */
    _extractTimetablesFromHTML(html) {
        if (!html)
            throw new Error(`No HTML to extract timetables from received.`);
        const $ = cheerio.load(html);
        return $("td.fi-title a")
            .map((i, el) => {
            const title = $(el)
                .text()
                .toUpperCase();
            const id = $(el).attr("href"
                .replace("&dm_det=1", "")
                .replace("/rasporedsati?dm_document_id=", ""));
            if (this._isTimetable(title)) {
                return {
                    title,
                    id,
                    date: this._extractDateFromTitle(title)
                };
            }
        })
            .get();
    }
    /**
     * Determine whether timetable is a valid timetable depending on it's title.
     * @param title Timetable title.
     */
    _isTimetable(title) {
        title = title.toUpperCase();
        if (!title.includes("XLSX") ||
            title.includes("PRAKS") ||
            !title.includes("SMJENA")) {
            return false;
        }
        return true;
    }
    /**
     * Extracts date from timetable title.
     * Example:
     * Title: "2.3. BSMJENA.XLSX"
     * 2 - day
     * 3 - month
     * year - get current year
     * Return a new date object for 2020-03-02
     * @param title Timetable title.
     */
    _extractDateFromTitle(title) {
        const titlePieces = title.split(".");
        const day = titlePieces[0];
        const month = titlePieces[1];
        const year = new Date().getFullYear().toString();
        return new Date(`${year}-${month}-${day}`);
    }
}
exports.default = TimetableDownloader;
