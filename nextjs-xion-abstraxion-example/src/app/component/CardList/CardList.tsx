import React from "react";
import Card from "../Card/Card";

interface NFT {
  id: number;
  owner: string;
  name: string;
  description: string;
  price: string;
  video: string;
  timeswatched: number;
}

interface CardListProps {
  userNFTs: NFT[] | null;
  handlePay: (id: number, video: string, price: string) => void;
  isPlaying: boolean;
  isPaying: boolean;
}

const CardList: React.FC<CardListProps> = ({ userNFTs, handlePay, isPlaying, isPaying }) => {
  const cardComponents = userNFTs?.map((nft) => (
    <Card
      key={nft.id}
      id={nft.id}
      owner={nft.owner}
      name={nft.name}
      description={nft.description}
      video={nft.video}
      price={nft.price}
      seen={nft.timeswatched}
      handlePay={handlePay}
      isPlaying={isPlaying}
      isPaying={isPaying}
    />
  ));

  return (
    <div>
      {userNFTs?.length === 0 ? (
        <p>No NFTs found.</p>
      ) : (
        <div className="flex flex-wrap gap-10 justify-center pb-5">{cardComponents}</div>
      )}
    </div>
  );
};

export default CardList;
