import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ImageSlider = () => {
  const backendUrl = import.meta.env.VITE_backendUrl;
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(0);
  const slideRef = useRef(null);
  const delay = 3000;
  const totalSlides = images.length;
  const navigate = useNavigate();

  const fetchNews = async () => {
    try {
      const res = await axios.post(backendUrl + "/api/article/headlines");
      console.log(res.data);
      setImages(res.data.news.slice(0, 4));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, delay);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const slide = slideRef.current;
    if (slide) {
      slide.style.transition = "transform 0.5s ease-in-out";
      slide.style.transform = `translateX(-${index * 100}%)`;
    }
  }, [index]);

  const handleTransitionEnd = () => {
    if (index === totalSlides) {
      const slide = slideRef.current;
      if (slide) {
        slide.style.transition = "none";
        slide.style.transform = `translateX(0%)`;
        setIndex(0);
      }
    }
  };

  return (
    <div className="relative w-full aspect-[16/9] sm:aspect-[16/6] overflow-hidden my-0 sm:my-10 mx-auto rounded-xl shadow-xl mt-24 sm:mt-16">
      {/* Subtle left gradient overlay */}
      <div className="absolute top-0 left-0 h-full w-full z-10 pointer-events-none bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>

      <div
        ref={slideRef}
        className="flex w-full h-full"
        onTransitionEnd={handleTransitionEnd}
      >
        {[...images, images[0]].map((item, i) => (
          <div
            key={i}
            className="w-full h-full flex-shrink-0 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${item?.urlToImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuQ47TIibvopJASv2XW9vYdGhNy4BVj8o6MA&s"})` }}
            onClick={() => {
              navigate("/article", {
                state: {
                  image: item?.urlToImage,
                  title: item?.title,
                  author: item?.author,
                  description: item?.description,
                  url: item?.url,
                  source: item?.source.name,
                  content: item?.content,
                  publishedAt: item?.publishedAt,
                },
              });
            }}
          >
            <div className="absolute inset-0 flex items-end justify-start p-4 sm:p-6 md:p-10 bg-black/20 px-4 py-2 rounded">
              <h2 className="text-white text-lg sm:text-xl md:text-3xl font-semibold drop-shadow-xl ">
                {item?.title.length > 100
                  ? `${item?.title.slice(0, 100)}...`
                  : item?.title}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
