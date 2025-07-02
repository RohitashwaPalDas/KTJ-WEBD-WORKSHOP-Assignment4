import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";
import {toast} from 'react-toastify'

const ArticlePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [summary, setSummary] = useState("");
  const { token } = useContext(UserContext);
  const backendUrl = import.meta.env.VITE_backendUrl;
  const [fullContent, setFullContent] = useState("");
  const [isSaved, setIsSaved] = useState({});

  const {
    image,
    title,
    author,
    description,
    content,
    publishedAt,
    source,
    url,
  } = state || {};

  const getSummary = async () => {
    try {
      const cachedSummary = localStorage.getItem(url);
      if (cachedSummary) {
        setSummary(cachedSummary);
        return;
      }

      const res = await axios.post(
        backendUrl + "/api/summary/get-summary",
        { url },
        { headers: { token } }
      );

      setSummary(res.data.summary);
      localStorage.setItem(url, res.data.summary);
    } catch (error) {
      console.log(error);
      toast.error("Failed to get summary! Try again later.");
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.post(
        backendUrl + "/api/user/getuser",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        const currentUser = response.data.user;
        const saved = currentUser.savedArticles?.some(
          (article) => article.articleId === url
        );
        setIsSaved(saved);
      }
    } catch (error) {
      console.error("Error fetching saved news:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [url]);

  useEffect(() => {
    const cachedSummary = localStorage.getItem(url);
    if (cachedSummary) {
      setSummary(cachedSummary);
    }
  }, [url]);

  const bullets = summary
    .split("\n")
    .filter(
      (line) =>
        line.trim().startsWith("•") ||
        line.trim().startsWith("*") ||
        line.trim().startsWith("-")
    );

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0b0b0b] px-4 text-center">
        <p>No article data available.</p>
      </div>
    );
  }

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.post(backendUrl + "/api/article/load-content", {
          url,
        });
        setFullContent(
          res.data.article?.content || "Full content not available."
        );
      } catch (err) {
        console.error("Error fetching full article content:", err);
        setFullContent("Failed to load full article content.");
      }
    };

    if (url) fetchContent();
  }, [url]);

  const saveArticle = async () => {
    try {
      const articleData = {
        id: url,
        title,
        url,
        source,
        author,
        description,
        publishedAt,
        image,
        summary,
      };

      const res = await axios.post(
        backendUrl + "/api/article/savearticle",
        { article: articleData },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Article saved successfully!");
        setIsSaved(true);
      } else {
        toast.error("❌ Failed to save article: " + res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error saving article.");
    }
  };

  const unsaveArticle = async () => {
    try {
      const res = await axios.post(
        backendUrl + "/api/article/unsavearticle",
        { articleId: url },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success("Article unsaved successfully!");
        setIsSaved(false);
      } else {
        toast.error("Failed to unsave article: " + res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error saving article.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white mt-20 sm:mt-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 space-y-8">
        {/* Title */}
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-2">
            {title}
          </h1>
          <p className="text-sm text-gray-400">
            By {author || "Unknown"} | {source || "Unknown Source"} |{" "}
            {new Date(publishedAt).toLocaleString()}
          </p>
        </div>

        {/* Image */}
        <div className="rounded-xl overflow-hidden shadow-md border border-white/10">
          <img
            src={
              image ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuQ47TIibvopJASv2XW9vYdGhNy4BVj8o6MA&s"
            }
            alt={title}
            className="w-full h-64 sm:h-[50vh] object-cover"
          />
        </div>

        {/* Description + Content */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-gray-200 space-y-4">
          <p>
            <strong>Description:</strong> {description}
          </p>
          <div className="w-full h-[1px] bg-gray-500/30" />
          <div>
            <strong>Content:</strong>
            <div
              className="mt-2 leading-relaxed text-white"
              dangerouslySetInnerHTML={{ __html: fullContent }}
            ></div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded font-semibold hover:brightness-110 transition"
          >
            View Full Article
          </a>

          <button
            onClick={getSummary}
            className={`bg-white/10 border border-white/20 px-4 py-2 rounded font-semibold hover:bg-white/20 transition ${
              bullets.length > 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={bullets.length > 0}
          >
            View Summary
          </button>

          {isSaved ? (
            <button
              onClick={unsaveArticle}
              className="bg-red-700 px-4 py-2 rounded font-semibold hover:bg-red-800 transition"
            >
              Unsave Article
            </button>
          ) : (
            <button
              onClick={saveArticle}
              className="bg-white/10 border border-white/20 px-4 py-2 rounded font-semibold hover:bg-white/20 transition"
            >
              Save Article
            </button>
          )}

          <button
            onClick={() => navigate(-1)}
            className="bg-white/10 border border-white/20 px-4 py-2 rounded font-semibold hover:bg-white/20 transition"
          >
            Go Back
          </button>
        </div>

        {/* Summary */}
        {bullets.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">
              Summary:
            </h2>
            <ul className="space-y-4">
              {bullets.map((point, index) => (
                <li key={index} className="flex items-start gap-3 text-lg">
                  <FaCheckCircle className="text-green-400 mt-1 shrink-0" />
                  <span>{point.replace(/^[-•*]\s*/, "")}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlePage;
