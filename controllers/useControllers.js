// urlShortner logic

const URL = require("../models/urlSchema");
const {nanoid} = require("nanoid");
const dotenv = require("dotenv");
const validator = require("validator"); // for validation of url

dotenv.config();

class UrlController {
    static async shortenUrl(req, res) {
        const {originalUrl} = req.body;
        
        if(!originalUrl) {
            return res.status(400).json({error: "Original URL is required."});
        }

        //validate the URL before proceeding
        if(!validator.isURL(originalUrl, {require_protocol: true})) {
            return res
                .status(400)
                .json({ error: "Invalid URL format, Include 'http://' or 'https://'" });
        }

        try {
            //checking of if the url is passed exist or not
            let existingurl = await URL.findOne({originalUrl});
            if(existingurl) {
                return res.json({
                    shortUrl: `${process.env.BASE_URL || "http://localhost:8080"}/${
                        existingurl.shortUrl
                    }`,
                });
            }

            // if passed url doesn't exist, shorten and save it to the db
            const shortUrl = nanoid(8);
            const newUrl = await URL.create({originalUrl, shortUrl});

            // append base_url to short url and return shorted url to user

            res.json({
                shortUrl: `${process.env.BASE_URL || "http://localhost:8080"}/${
                    newUrl.shortUrl
                }`,
            });

        } catch (error) {
            res.status(500).json({error: `Server error: ${error.message}`});
        }
    }

    //handles url redirection
    static async redirectUrl(req, res) {
        try {
            //get the shorturl id from the request
            const {shortUrl} = req.params;
            const urlDoc = await URL.findOne({shortUrl});

            if(!urlDoc) {
                return res.status(404).json({error: "Short URL not found."});
            }

            //Increment click count before redirecting
            await URL.updateOne({_id: urlDoc._id}, {$inc: {clicks: 1}});

            // redirect to original url
            res.redirect(urlDoc.originalUrl);

        } catch (error) {
            res.status(500).json({error: `Server error: ${error.message}`});
        }
    }

    //get shorturls
    static async getAllUrls(req, res) {
        try {
            const urls = await UR.find().sort({createdAt: -1});
            res.json(urls);
        } catch (error) {
            res.status(500).json({error: `Server error: ${error.message}`});
        }
    }
}

module.exports = UrlController;