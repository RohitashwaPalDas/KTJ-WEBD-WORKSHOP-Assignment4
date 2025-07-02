import express from 'express'
import { getLatestArticles, getTopHeadlines, loadContent, saveArticle, unsaveArticle } from '../controllers/ArticleController.js';
import authUser from '../middlewares/authUser.js';

const articleRouter = express.Router();

articleRouter.post("/allarticles", getLatestArticles);
articleRouter.post("/headlines", getTopHeadlines);
articleRouter.post("/savearticle", authUser, saveArticle);
articleRouter.post("/unsavearticle", authUser, unsaveArticle);
articleRouter.post("/load-content", loadContent);

export default articleRouter