import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import NewsCard from "../components/NewsCard";
import { GiCricketBat } from "react-icons/gi";
import { FaMicrochip, FaBriefcase, FaFlask, FaGlobe } from "react-icons/fa";
import { MdSportsSoccer, MdOutlineMovie } from "react-icons/md";
import { UserContext } from "../contexts/UserContext";
import Title from "../components/Title";

const News = () => {
  const { searchQuery } = useContext(UserContext);
  const backendUrl = import.meta.env.VITE_backendUrl;

  const categories = [
    { name: "all", icon: <FaGlobe /> },
    { name: "cricket", icon: <GiCricketBat /> },
    { name: "technology", icon: <FaMicrochip /> },
    { name: "science", icon: <FaFlask /> },
    { name: "sport", icon: <MdSportsSoccer /> },
    { name: "business", icon: <FaBriefcase /> },
    { name: "entertainment", icon: <MdOutlineMovie /> },
  ];

  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const fetchNews = async (query) => {
    try {
      const res = await axios.post(backendUrl + "/api/article/allarticles", {
        query,
      });
      setArticles(res.data.news.articles);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSelectedCategory("all");
    }
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery.trim()) {
      fetchNews(searchQuery);
      setSelectedCategory("");
    } else if (selectedCategory === "all") {
      fetchNews("news");
    } else {
      fetchNews(selectedCategory);
    }
  }, [selectedCategory, searchQuery]);

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-16 py-6 text-white mt-16">
      {/* Header */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
        Browse by Category
      </h2>

      {/* Categories */}
      <div className="relative mb-10">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 sm:gap-4 w-max md:w-full px-1 sm:px-0 ml-0 sm:ml-2 my-0 sm:my-2">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-2 px-4 py-2 whitespace-nowrap rounded-full text-sm sm:text-base font-medium transition-all duration-300 shadow-md
            ${
              selectedCategory === cat.name
                ? "bg-gradient-to-r from-red-500 to-pink-500 text-white scale-105"
                : "bg-white text-gray-800 hover:bg-red-400 hover:text-white"
            }`}
              >
                <span className="text-lg">{cat.icon}</span>
                {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Title */}
      <Title
        text1={
          searchQuery.trim()
            ? "Search Results for"
            : selectedCategory === "all"
            ? "All"
            : "News about"
        }
        text2={
          searchQuery.trim()
            ? `"${searchQuery}"`
            : selectedCategory === "all"
            ? "News"
            : selectedCategory.charAt(0).toUpperCase() +
              selectedCategory.slice(1)
        }
      />

      {/* Articles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {articles.length === 0 ? (
          <p className="text-lg col-span-full text-center">
            No articles found.
          </p>
        ) : (
          articles.map((article, index) => (
            <NewsCard
              key={index}
              image={article.urlToImage || "https://via.placeholder.com/150"}
              title={article.title || ""}
              author={article.author || "Anonymous"}
              description={article.description || ""}
              url={article.url || ""}
              source={article.source.name || ""}
              content={article.content || ""}
              publishedAt={article.publishedAt || ""}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default News;
