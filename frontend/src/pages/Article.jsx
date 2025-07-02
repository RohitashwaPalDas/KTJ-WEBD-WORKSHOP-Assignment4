import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";

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
  } = state;

  const getSummary = async () => {
    try {
      const cachedSummary = localStorage.getItem(url);
      if (cachedSummary) {
        console.log("✅ Loaded summary from localStorage");
        setSummary(cachedSummary);
        return;
      }

      const res = await axios.post(
        backendUrl + "/api/summary/get-summary",
        { url },
        { headers: { token } }
      );
      console.log("🧠 Gemini Summary:", res.data.summary);

      setSummary(res.data.summary);
      localStorage.setItem(url, res.data.summary); // Save it
    } catch (error) {
      console.log(error);
      alert("Failed to get summary! Try again later..");
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.post(
        backendUrl + "/api/user/getuser",
        {},
        {
          headers: { token },
        }
      );

      console.log(response);

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
    if (url) {
      const cachedSummary = localStorage.getItem(url);
      if (cachedSummary) {
        setSummary(cachedSummary);
      }
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
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0b0b0b]">
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
        console.log(res);
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

      console.log(res);

      if (res.data.success) {
        alert("✅ Article saved successfully!");
        setIsSaved(true);
      } else {
        alert("❌ Failed to save article: " + res.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Error saving article.");
    }
  };

  const unsaveArticle = async () => {
    try {
      const res = await axios.post(
        backendUrl + "/api/article/unsavearticle",
        {articleId: url},
        { headers: { token } }
      );
      console.log(res);
      if (res.data.success) {
        alert("✅ Article unsaved successfully!");
        setIsSaved(false);
      } else {
        alert("❌ Failed to unsave article: " + res.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Error saving article.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="w-full px-4 sm:px-8 md:px-14 py-10 space-y-8">
        {/* Title & Author */}
        <div className="mt-6 sm:mt-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 leading-tight">
            {title}
          </h1>
          <p className="text-sm text-gray-400">
            By {author || "Unknown"} | {source || "Unknown Source"} |{" "}
            {new Date(publishedAt).toLocaleString()}
          </p>
        </div>

        {/* Image */}
        <div className="rounded-xl overflow-hidden shadow-lg border border-white/10">
          <img
            src={
              image ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuQ47TIibvopJASv2XW9vYdGhNy4BVj8o6MA&s"
            }
            alt={title}
            className="w-full h-[80vh] object-cover"
          />
        </div>

        {/* Description */}
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 shadow-lg rounded-xl p-6 sm:p-10 text-gray-200 text-base leading-relaxed space-y-4">
          <p>
            <strong>Description:</strong> {description}
          </p>
          <p className="w-full bg-gray-400 h-[0.5px] rounded-md"></p>
          <div>
            <strong>Content:</strong>
            <div
              className="mt-2 text-white text-base leading-7 space-y-4"
              dangerouslySetInnerHTML={{ __html: fullContent }}
            ></div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-red-500 to-red-700 text-white px-5 py-2 rounded-md font-semibold shadow-md hover:brightness-110 transition"
          >
            View Full Article
          </a>

          <button
            onClick={getSummary}
            className={`bg-white/10 border border-white/20 px-5 py-2 rounded-md text-sm font-semibold hover:bg-white/20 transition ${
              bullets.length > 0 ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={bullets.length > 0}
          >
            View Summary
          </button>

          {isSaved ? (
            <button
              onClick={unsaveArticle}
              className="bg-red-700 border border-white/20 px-5 py-2 rounded-md text-sm font-semibold hover:bg-red-800 transition"
            >
              Unsave Article
            </button>
          ) : (
            <button
              onClick={saveArticle}
              className="bg-white/10 border border-white/20 px-5 py-2 rounded-md text-sm font-semibold hover:bg-white/20 transition"
            >
              Save Article
            </button>
          )}

          <button
            onClick={() => navigate(-1)}
            className="bg-white/10 border border-white/20 px-5 py-2 rounded-md text-sm font-semibold hover:bg-white/20 transition"
          >
            Go Back
          </button>
        </div>

        <div className="backdrop-blur-lg bg-white/5 border border-white/10 shadow-2xl rounded-2xl p-6 sm:p-10 text-gray-200 text-base leading-relaxed space-y-6 animate-fade-in">
          <div className="text-xl sm:text-2xl font-semibold text-white">
            Summary:
          </div>
          <ul className="space-y-4">
            {bullets.map((point, index) => (
              <li key={index} className="flex items-start gap-3 text-lg">
                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                <span>{point.replace(/^[-•*]\s*/, "")}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
