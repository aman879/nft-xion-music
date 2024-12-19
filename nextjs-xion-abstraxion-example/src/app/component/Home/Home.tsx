import React from 'react';
import Ar from "../../../assets/Ar.svg";

interface HomeProps {
  onRouteChange: (route: string) => void;
}

const Home: React.FC<HomeProps> = ({ onRouteChange }) => {
  return (
    <div className="text-white flex justify-around items-center pt-32 max-h-screen">
      <div className="mb-16">
        <h1 className="font-semibold text-6xl">
          Create and view<br />
          <span className="font-thin text-sky-400">XION <br />Video NFTs</span>
        </h1>
        <button
          onClick={() => onRouteChange("explore")}
          className="text-white mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Explore All
        </button>
      </div>
      <div>
        <img src={Ar} alt="Augmented Reality Illustration" className="h-[490px]" />
      </div>
    </div>
  );
};

export default Home;
