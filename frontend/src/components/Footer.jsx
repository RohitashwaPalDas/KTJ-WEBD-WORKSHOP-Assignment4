import React from "react";

const Footer = () => {
  return (
    <div>
      <p className="text-center text-white/40 text-sm my-5">
        &copy; {new Date().getFullYear()} NewsNectar. Built with ❤️ by Rohitashwa.
      </p>
    </div>
  );
};

export default Footer;
