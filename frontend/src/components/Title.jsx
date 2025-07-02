import React from 'react';

const Title = ({ text1, text2 }) => {
  return (
    <div className="mb-5">
      <h2 className="text-xl md:text-3xl font-extrabold text-white tracking-wide relative inline-block">
        {text1}{' '}
        <span className="text-red-500 hover:text-red-400 transition-colors duration-300">
          {text2}
        </span>
      </h2>
    </div>
  );
};

export default Title;
