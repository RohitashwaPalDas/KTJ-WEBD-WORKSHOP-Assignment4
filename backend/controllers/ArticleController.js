import axios from 'axios'
import dotenv from 'dotenv';
import savedArticleModel from '../models/savedArtcle.js';
import userModel from '../models/user.js';
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
dotenv.config();

const NEWS_API_KEY = process.env.NEWS_API_KEY
console.log("News API KEY is:")
console.log(NEWS_API_KEY);

const articleCache = {};
const articleTimestamps = {};
const CACHE_DURATION = 5 * 60 * 1000; 
let headlinesCache = null;
let headlinesTimestamp = 0;

const getLatestArticles = async (req, res) => {
  try {
    const { query } = req.body;
    const key = query?.toLowerCase() || "news";
    const now = Date.now();

    if (articleCache[key] && now - articleTimestamps[key] < CACHE_DURATION) {
      return res.json({
        success: true,
        message: "Fetched from cache",
        news: articleCache[key],
      });
    }

    const response = await axios.get(`https://newsapi.org/v2/everything`, {
      params: {
        q: key,
        language: "en",
        sortBy: "publishedAt",
        apiKey: NEWS_API_KEY,
      },
    });

    articleCache[key] = response.data;
    articleTimestamps[key] = now;

    res.json({
      success: true,
      message: "Fetched from API",
      news: response.data,
    });
  } catch (error) {
    console.error("Error:", error.message);
  if (articleCache[key]) {
    return res.json({
      success: true,
      message: "Served from expired cache due to API failure",
      news: articleCache[key],
    });
  }
  res.status(500).json({ success: false, message: error.message });
  }
};



const getTopHeadlines = async (req, res) => {
  const now = Date.now();

  try {
    if (headlinesCache && now - headlinesTimestamp < CACHE_DURATION) {
      return res.json({
        success: true,
        message: "Fetched headlines from cache",
        news: headlinesCache,
      });
    }

    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`
    );

    headlinesCache = response.data.articles;
    headlinesTimestamp = now;

    res.json({
      success: true,
      message: "Fetched headlines from API",
      news: headlinesCache,
    });
  } catch (error) {
    console.error("Error:", error.message);

    // Serve expired cache if available
    if (headlinesCache) {
      return res.json({
        success: true,
        message: "Served from expired cache due to API failure",
        news: headlinesCache,
      });
    }

    // If no cache, send error
    res.status(500).json({ success: false, message: error.message });
  }
};


const loadContent = async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ message: "URL is required" });

  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    res.json({ article }); // includes content, title, etc.
  } catch (error) {
    console.error("Failed to fetch article:", error.message);
    res.status(500).json({ message: "Failed to fetch article content" });
  }
}


const saveArticle = async (req, res) => {
    try {
        const { userId, article } = req.body;

        if (!userId) {
            return res.json({ success: false, message: "Not Logged In" });
        }

        const user = await userModel.findOne({ _id: userId });

        if (!user) {
            return res.json({ success: false, message: "User Not Found" });
        }

        const newArticle = new savedArticleModel({
            userId,
            articleId: article.id,
            title: article.title,
            url: article.url,
            source: article.source,
            author: article.author,
            description: article.description,
            publishedAt: article.publishedAt,
            imageUrl: article.image,
            content: article.content,
            summary: article.summary || "",
            savedAt: new Date()
        })

        const savedArticle = await newArticle.save();

        await userModel.findByIdAndUpdate(userId, {
            $push: { savedArticles: savedArticle._id }
        });

        res.json({ success: true, message: "News Saved Successfully", savedArticle });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const unsaveArticle = async (req, res) => {
    try {
        const { userId, articleId } = req.body;
        if (!userId) {
            return res.json({ success: false, message: "Not Logged In" });
        }

        const user = await userModel.findOne({ _id: userId });
        if (!user) {
            return res.json({ success: false, message: "User Not Found" });
        }

        const deletedArticle = await savedArticleModel.findOneAndDelete({articleId});
        if (!deletedArticle) {
            return res.json({ success: false, message: "Article not found" });
        }

        await userModel.findByIdAndUpdate(userId, {
            $pull:{savedArticles: deletedArticle._id}
        })

        res.json({ success: true, message: "News Unsaved Successfully", deletedArticle });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export { getLatestArticles, saveArticle, unsaveArticle, loadContent, getTopHeadlines }