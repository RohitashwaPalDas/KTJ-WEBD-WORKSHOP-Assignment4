import React, { useEffect, useState, useRef } from "react";
import ImageSlider from "../components/ImageSlider";
import Title from "../components/Title";
import NewsCard from "../components/NewsCard";
import axios from "axios";
import ScrollableSection from "../components/ScrollableSection";

const Home = () => {
  const backendUrl = import.meta.env.VITE_backendUrl;
  const [articles, setArticles] = useState([]);
  const [headlines, setHeadlines] = useState([]);
  const fetchNews = async (query) => {
    try {
      const res = await axios.post(backendUrl + "/api/article/allarticles", {
        query,
      });
      console.log(res.data);
      setArticles(res.data.news.articles);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchHeadlines = async () => {
    try {
      const res = await axios.post(backendUrl + "/api/article/headlines");
      console.log(res.data);
      setHeadlines(res.data.news);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNews("cricket");
    fetchHeadlines();
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <ImageSlider />
      <ScrollableSection
        title1="LATEST"
        title2="UPDATES"
        data={headlines.map((article) => ({
          image: article.urlToImage || "https://via.placeholder.com/150",
          title: article.title || "",
          author: article.author || "Anonymous",
          description: article.description || "",
          url: article.url || "",
          source: article.source?.name || "",
          content: article.content || "",
          publishedAt: article.publishedAt || "",
        }))}
        CardComponent={NewsCard}
      />

      <ScrollableSection
        title1="TRENDING"
        title2="NEWS"
        data={articles.map((article) => ({
          image: article.urlToImage || "https://via.placeholder.com/150",
          title: article.title || "",
          author: article.author || "Anonymous",
          description: article.description || "",
          url: article.url || "",
          source: article.source?.name || "",
          content: article.content || "",
          publishedAt: article.publishedAt || "",
        }))}
        CardComponent={NewsCard}
      />
    </div>
  );
};

export default Home;
