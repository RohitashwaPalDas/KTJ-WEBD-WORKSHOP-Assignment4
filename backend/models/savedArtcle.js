import mongoose from "mongoose";

const savedArticleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  articleId: { type: String },  // You can store source ID or url
  title: { type: String },
  url: { type: String },
  source: { type: String },
  author: {type:String},
  description: { type: String },
  publishedAt: {type:Date},
  imageUrl: {type:String},
  content: {type: String},
  summary: { type: String },
  savedAt: { type: Date }
});


const savedArticleModel = mongoose.models.SavedArticle || mongoose.model("SavedArticle",savedArticleSchema);
export default savedArticleModel;