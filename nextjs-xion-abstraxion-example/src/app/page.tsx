"use client";
import React, { use, useEffect, useState } from "react";
import {
  Abstraxion,
  useAbstraxionAccount,
  useModal,
  useAbstraxionSigningClient,
} from "@burnt-labs/abstraxion";
import { Button } from "@burnt-labs/ui";
import Navbar from "@/app/component/Navbar/Navbar";
import "./App.css";
import address from "./contract/info.json";
import jws from "./contract/key.json";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PinataSDK } from 'pinata-web3';
import Home from "./component/Home/Home";
import Mint from "./component/Mint/Mint";
import Explore from "./component/Explore/Explore";
const pinata = new PinataSDK({
  pinataJwt: jws.jws,
  pinataGateway: "beige-sophisticated-baboon-74.mypinata.cloud",
});

const contractAddress = address.address;

export default function Page() {
  const [route, setRoute] = useState("home");
  const [isMinting, setIsMinting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nfts, setNfts]: any[] = useState(null);
  const [shouldFetchNfts, setShouldFetchNfts] = useState(true);
  const [canPlay, setCanPlay] = useState(false);
  const [url, setUrl] = useState("");
  const [isPaying, setIspaying] = useState(false);

  const {
    isConnected,
    isConnecting,
  } = useAbstraxionAccount();
  const {data: account} = useAbstraxionAccount();
  
  const [, setShow] = useModal();
  const {client} = useAbstraxionSigningClient();

  useEffect(() => {
    async function getAllNfts() {
      if (isConnected && account?.bech32Address && shouldFetchNfts && client) {
        try {
          setIsLoading(true);
          const totalCount = Number(
            await client?.queryContractSmart(contractAddress, {
              get_nft_counter: {},
            })
          );
          const nftDataArray: any[] = [];
          for (let i = 0; i < totalCount; i++) {
            const nftRes = await client?.queryContractSmart(contractAddress, {
              get_nft: { id: i },
            });
            const nftResFil = nftRes.Ok;
            const response = await pinata.gateways.get(
              `https://beige-sophisticated-baboon-74.mypinata.cloud/ipfs/${nftResFil.uri}`
            );
            const data: any = response.data;
  
            const nftData = {
              id: nftResFil.nft_id,
              owner: nftResFil.owner,
              name: data.name,
              description: data.description,
              price: data.price,
              video: data.video,
              timeswatched: nftResFil.times_watched,
            };
            nftDataArray.push(nftData);
          }
          console.log(nftDataArray)
          setNfts(nftDataArray);
        } catch (e) {
          toast.error("Error fetching NFTs", {
            pauseOnHover: false,
            position: "top-center",
          });
          console.error(e);
        } finally {
          setIsLoading(false);
          setShouldFetchNfts(false);
        }
      }
    }
  
    getAllNfts();
  }, [isConnected, account?.bech32Address, shouldFetchNfts, client, contractAddress]);
  

  const onRouteChange = (route: string) => {
    setRoute(route);
  };

  const uploadToPinata = async (file: File, name: string, description: string, price: string): Promise<string> => {
    if (!file) {
      throw new Error("File is required");
    }

    try {
      toast.info("Uploading video to IPFS", {
        position:"top-center"
      })
      const uploadImage = await pinata.upload.file(file);
      const metadata = await pinata.upload.json({
        name: name,
        description: description,
        video: `https://beige-sophisticated-baboon-74.mypinata.cloud/ipfs/${uploadImage.IpfsHash}`,
        price: price
      });

      return metadata.IpfsHash;
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      toast.error("Minting NFT failed.", {
        position: "top-center"
      });
      throw new Error("Upload to Pinata failed.");
    }
  };

  const mintNFT = async (_uri:string, _price: string) => {
    if(!account || !isConnected) return;

    try {
      setIsMinting(true); 

      const priceInUxion = Number(_price) * 1000000;
      
      const msg = {
          mint_nft: {
          uri: _uri,
          price: priceInUxion,
        },
      };

      const mintResult = await client?.execute(
        account.bech32Address,
        contractAddress,
        msg,
        {
          amount: [{amount: "1", denom: "uxion"}],
          gas: "500000",
          granter: "xion1nnptdsujk8v5uu79mug6h60mtvcfy4qj3ngf7q3pcxrpakdze5aq6v44p9",
        },
        "",
        []
      );

      console.log(mintResult?.transactionHash)
      
      // const result = await client?.queryContractSmart(contractAddress, {
      //   get_nft: {id: 0},
      // });
      // console.log(result)
      toast.success(`NFT minted successfully ${mintResult?.transactionHash}`, {
        position: "top-center"
      });
      setShouldFetchNfts(true);
      onRouteChange("home");
    } catch (e) {
      console.log("error", e);
      toast.error(`Error minting NFT: ${e}`, {
        position: "top-center"
      });
    } finally {
      setIsMinting(false);
    }
  }

  const handlePay = async (id: number, uri: string, price: string) => {
    if (!address) return;
    try {
      setIspaying(true);
      const priceInUxion = Number(price) * 1000000;
      console.log("id", id, priceInUxion)

      const msg = {
        rent: {
          nft_id: id,
        },
      };

      const rentResult = await client?.execute(
        account.bech32Address,
        contractAddress,
        msg,
        {
          amount: [{amount: "1", denom: "uxion"}],
          gas: "500000",
        },
        "",
        [
          {
            amount: priceInUxion.toString(),
            denom: "uxion"
          }
        ]
      );

      setCanPlay(true);
      setUrl(uri);

      toast.info(`hash: ${rentResult?.transactionHash}`, {
        position: "top-center"
      });
      toast.success("Please enjoy!! ", {
        position: "top-center"
      });
      
    } catch (e) {
      console.log(e);
      toast.error('Error paying NFT:', {
        position: "top-center"
      });
    } finally {
      setIspaying(false);
    }
  }

  const handleCloseVideo = () => {
    setCanPlay(false);
    setUrl("");
  }

  return (
    <div>
      <ToastContainer />
      <div className="App min-h-screen">
        <div className="gradient-bg-welcome h-screen w-screen">
          <Navbar
            onRouteChange={onRouteChange}
            setShow={setShow}
            address={account.bech32Address}
            isConnected={isConnected}
            isConnecting={isConnecting}
            Abstraxion={Abstraxion}
            />
          {
            route == "home" ? (
              <Home onRouteChange={onRouteChange}/>
            ) : route == "explore" ? (
              <Explore nfts={nfts} isConnected={isConnected} isLoading={isLoading} canPlay={canPlay} handlePay={handlePay} url={url} handleCloseVideo={handleCloseVideo} isPaying={isPaying}/>
            ) : route == "mint" ? (
              <Mint uploadToPinata={uploadToPinata} mintNFT={mintNFT} isMinting={isMinting}/>
            ) : (
              <>Cannot find page</>
            )
          }
        </div>
      </div>
    </div>
  );
}
