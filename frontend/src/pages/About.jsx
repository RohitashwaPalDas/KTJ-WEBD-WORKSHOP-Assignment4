import React from "react";
import { FaGlobe, FaBolt, FaCode, FaUser } from "react-icons/fa";

const techStack = [
  {
    name: "React",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "Tailwind CSS",
    image:
      "https://icon.icepanel.io/Technology/svg/Tailwind-CSS.svg",
  },
  {
    name: "JavaScript",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  {
    name: "Vite",
    image: "https://vitejs.dev/logo-with-shadow.png",
  },

  {
    name: "MongoDB",
    image:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"
  }
];

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#11111175] to-[#111111af] text-white px-4 py-10 mt-10">
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <div className="flex justify-center w-full gap-2 mb-4 flex-wrap">
          <h1 className="text-5xl font-bold text-center">
            About 
          </h1>
          <div className="flex gap-2">
            <h1 className="text-5xl font-bold text-center">News<span className="text-red-500">Nectar</span></h1>
          <img
            className="w-12 h-12"
            src="https://img.icons8.com/fluency/48/news.png"
            alt="news"
          />
          </div>
        </div>
        <div className="w-full mx-auto h-[0.5px] bg-white/20 mb-12"></div>

        {/* Introduction */}
        <section className="text-center space-y-4 mb-12">
          <p className="text-lg text-white/90">
            <span className="text-white font-semibold">
              News<span className="text-red-500">Nectar</span>
            </span>{" "}
            is your gateway to the latest and most relevant headlines across the
            globe — all at your fingertips. Designed to be fast, informative,
            and user-friendly.
          </p>
        </section>

        {/* Mission */}
        <section className="bg-white/5 rounded-2xl p-6 md:p-10 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out mb-12">
          <div className="flex items-center gap-4 mb-4">
            <FaGlobe className="text-xl text-cyan-300" />
            <h2 className="text-2xl font-semibold">Our Mission</h2>
          </div>
          <p className="text-white/90">
            To simplify the way people consume news by offering an elegant,
            organized, and personalized platform. Whether you love sports, tech,
            politics, or global affairs — we've got it covered.
          </p>
        </section>

        {/* Tech Stack (Styled like your image) */}
        <section className="bg-white/5 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out text-white mb-12">
          <h2 className="text-3xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center gap-2">
            🛠 Tech Stack
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-10">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="flex flex-col items-center transition-transform duration-300 ease-in-out hover:scale-110 hover:-translate-y-1"
              >
                <img
                  src={tech.image}
                  alt={tech.name}
                  className="w-16 h-16 md:w-20 md:h-20 object-contain"
                />
                <p className="mt-2 text-sm md:text-base text-white/90">
                  {tech.name}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="bg-white/5 rounded-2xl p-6 md:p-10 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out mb-12">
          <div className="flex items-center gap-4 mb-4">
            <FaBolt className="text-xl text-yellow-300" />
            <h2 className="text-2xl font-semibold">Core Features</h2>
          </div>
          <ul className="list-disc list-inside text-white/90 space-y-2">
            <li>Search and browse top headlines by category and source</li>
            <li>Save and unsave your favorite articles</li>
            <li>Get AI-generated summaries of lengthy news</li>
            <li>Dark-themed responsive design</li>
            <li>Fast loading, intuitive interface</li>
          </ul>
        </section>

        {/* Developer Info */}
        <section className="bg-white/5 rounded-2xl p-6 md:p-10 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out mb-12">
          <div className="flex items-center gap-4 mb-4">
            <FaUser className="text-xl text-purple-300" />
            <h2 className="text-2xl font-semibold">About the Developer</h2>
          </div>
          <p className="text-white/90">
            Hey! I'm{" "}
            <span className="font-semibold text-white">Rohitashwa Pal Das</span>
            , a passionate web developer. I enjoy turning ideas into reality
            through code. NewsNectar is one of my projects where I combined news
            APIs, user personalization, and modern web tech to build a clean,
            functional news platform.
          </p>
        </section>

        {/* Footer */}
        
      </div>
    </div>
  );
};

export default About;
