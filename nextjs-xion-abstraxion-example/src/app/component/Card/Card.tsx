import React from "react";

interface CardProps {
  id: string;
  owner: string;
  name: string;
  video: string;
  description: string;
  seen: number;
  price: string;
  handlePay: (id: number, video: string, price: string) => void;
  isPlaying: boolean;
  isPaying: boolean;
}

const Card: React.FC<CardProps> = ({ id, owner, name, video, description, seen, price, handlePay, isPlaying, isPaying }) => {
  const idNum = Number(id);

  return (
    <div className="flex-1 max-w-xs h-[450px] transition-all relative">
      <div className="flex flex-col w-full h-full bg-white/5 shadow-lg backdrop-blur-md rounded-lg p-4">
        <video
          className="h-[230px] w-full object-cover rounded-lg mb-4"
          src={video}
          muted
          controls={false}
          autoPlay={false}
          onClick={(e) => e.preventDefault()}
        />
        <div className="flex justify-between items-center text-white mb-2">
          <p></p>
          <span className="text-sm text-gray-400">Played {seen} times</span>
        </div>
        <div className="flex flex-col flex-1 space-y-2">
          <div>
            <span className="font-bold text-white">Name:</span>
            <p className="text-white">{name}</p>
          </div>
          <div>
            <span className="font-bold text-white">Owner:</span>
            <p className="text-white truncate">{owner}</p>
          </div>
          <div>
            <span className="font-bold text-white">Description:</span>
            <p className="text-white">{description}</p>
          </div>
          <div className="text-center mt-auto">
            {!isPlaying && (
              <button
                className={`px-4 py-2 border-2 rounded-full transition-all ${
                  isPaying
                    ? "border-gray-500 text-gray-500 cursor-not-allowed"
                    : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                }`}
                onClick={() => !isPaying && handlePay(idNum, video, price)} // Prevent action if isPaying is true
                disabled={isPaying} // Disable the button when isPaying is true
              >
                {isPaying ? (
                  <span className="text-gray-400">Processing...</span>
                ) : (
                  <>
                    <span className="text-pink-300">Play for</span> <span className="text-sky-400">{price}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
