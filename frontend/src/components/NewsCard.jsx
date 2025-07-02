import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const NewsCard = ({
  image,
  title,
  author,
  description,
  url,
  source,
  content,
  publishedAt,
}) => {
  const navigate = useNavigate();
  

  const handleReadMore = () => {
    navigate("/article", {
      state: {
        image,
        title,
        author,
        description,
        url,
        source,
        content,
        publishedAt,
      },
    });
  };

  return (
    <div
      className="w-80 bg-cover bg-center rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_35px_rgba(255,255,255,0.15)] transition-all duration-500 transform hover:-translate-y-1 hover:scale-[1.02] mx-auto relative min-w-[300px] max-w-[300px] flex-shrink-0"
      style={{ backgroundImage: `url(${image})` }}
    >
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/30 backdrop-blur-sm"></div>

      <div className="relative p-4 text-white flex flex-col gap-2">
        <h2 className="text-lg font-bold">
          {title.length > 25 ? `${title.slice(0, 25)}...` : title}
        </h2>
        <p className="text-xs text-gray-300">
          By{" "}
          {author
            ? author.split(",").length > 2
              ? author.split(",").slice(0, 2).join(", ") + "..."
              : author.length > 40
              ? author.slice(0, 37) + "..."
              : author
            : "Unknown"}
        </p>

        <p className="text-sm text-gray-200 min-h-[72px]">
          {description.length > 100
            ? `${description.slice(0, 100)}...`
            : description}
        </p>

        <button
          onClick={handleReadMore}
          className="bg-gradient-to-r from-red-500 to-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-md hover:brightness-110 transition mt-2 self-start"
        >
          Read More
        </button>
      </div>
    </div>
  );
};

export default NewsCard;
