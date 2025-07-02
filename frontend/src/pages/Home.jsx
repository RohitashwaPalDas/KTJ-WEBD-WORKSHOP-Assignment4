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
  const [sports, setSports] = useState([]);
  const [business, setBusiness] = useState([]);
  const [tech, setTech] = useState([]);
  const [entertainment, setEntertainment] = useState([]);
  const [health, setHealth] = useState([]);
  const [science, setScience] = useState([]);
  const [world, setWorld] = useState([]);

  const fetchNewsByCategory = async (query, setStateFn) => {
    try {
      const res = await axios.post(backendUrl + "/api/article/allarticles", {
        query,
      });
      console.log(res.data);
      setStateFn(res.data.news.articles);
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
    fetchNewsByCategory("news", setArticles);
    fetchHeadlines();
    fetchNewsByCategory("sports", setSports);
    fetchNewsByCategory("business", setBusiness);
    fetchNewsByCategory("technology", setTech);
    fetchNewsByCategory("entertainment", setEntertainment);
    fetchNewsByCategory("health", setHealth);
    fetchNewsByCategory("science", setScience);
    fetchNewsByCategory("world", setWorld);
  }, []);

  const mapToCard = (article) => ({
    image:
      article.urlToImage ||
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuQ47TIibvopJASv2XW9vYdGhNy4BVj8o6MA&s",
    title: article.title || "",
    author: article.author || "Anonymous",
    description: article.description || "",
    url: article.url || "",
    source: article.source?.name || "",
    content: article.content || "",
    publishedAt: article.publishedAt || "",
  });

  return (
    <div className="flex flex-col gap-5 sm:gp-10">
      <ImageSlider />
      <ScrollableSection
        title1="TOP"
        title2="HEADLINES"
        data={headlines.map(mapToCard)}
        CardComponent={NewsCard}
      />
      <ScrollableSection
        title1="TRENDING"
        title2="NEWS"
        data={articles.map(mapToCard)}
        CardComponent={NewsCard}
      />
      <ScrollableSection
        title1="SPORTS"
        title2="BUZZ"
        data={sports.map(mapToCard)}
        CardComponent={NewsCard}
      />
      <ScrollableSection
        title1="BUSINESS"
        title2="TODAY"
        data={business.map(mapToCard)}
        CardComponent={NewsCard}
      />
      <ScrollableSection
        title1="TECH"
        title2="TRENDS"
        data={tech.map(mapToCard)}
        CardComponent={NewsCard}
      />
      <ScrollableSection
        title1="CELEBRITY"
        title2="SCOOP"
        data={entertainment.map(mapToCard)}
        CardComponent={NewsCard}
      />
      <ScrollableSection
        title1="HEALTH"
        title2="CORNER"
        data={health.map(mapToCard)}
        CardComponent={NewsCard}
      />
      <ScrollableSection
        title1="SCIENCE"
        title2="SPOTLIGHT"
        data={science.map(mapToCard)}
        CardComponent={NewsCard}
      />
      <ScrollableSection
        title1="GLOBAL"
        title2="NEWS"
        data={world.map(mapToCard)}
        CardComponent={NewsCard}
      />
    </div>
  );
};

export default Home;
