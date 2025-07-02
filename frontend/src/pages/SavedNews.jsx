import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import NewsCard from "../components/NewsCard";
import Title from "../components/Title";

const SavedNews = () => {
  const { token } = useContext(UserContext);
  const [savedNews, setSavedNews] = useState([]);
  const backendUrl = import.meta.env.VITE_backendUrl;

  const fetchSavedNews = async () => {
    try {
      const response = await axios.post(
        backendUrl + "/api/user/getuser",
        {}, // No body needed if token middleware is used
        {
          headers: { token },
        }
      );

      console.log(response);

      if (response.data.success && response.data.user?.savedArticles) {
        setSavedNews(response.data.user.savedArticles);
      } else {
        console.log("No saved articles found.");
      }
    } catch (error) {
      console.error("Error fetching saved news:", error);
    }
  };

  useEffect(() => {
    fetchSavedNews();
  }, []);

  return (
    <div className="p-6 mt-10">
      <Title text1="Saved" text2="News"/>
      {savedNews.length === 0 ? (
        <p className="text-white/60">No articles saved yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedNews.map((article) => (
            <NewsCard
              key={article._id}
              image={article.imageUrl || "https://via.placeholder.com/150"}
              title={article.title}
              author={article.author || "Unknown"}
              description={article.description}
              url={article.url}
              source={article.source}
              content={article.content}
              publishedAt={article.publishedAt}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedNews;
