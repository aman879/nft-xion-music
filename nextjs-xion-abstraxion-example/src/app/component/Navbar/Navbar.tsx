import React from "react";

interface NavbarProps {
  onRouteChange: (route: string) => void;
  setShow: (show: boolean) => void;
  address: string | null;
  Abstraxion: React.ComponentType<{ onClose: () => void }>;
}

const Navbar: React.FC<NavbarProps> = ({
  onRouteChange,
  setShow,
  address,
  Abstraxion,
}) => {
  return (
    <div className="fixed z-10 backdrop-blur-sm mt-5">
      <section className="relative mx-auto">
        <nav className="flex justify-between items-center text-white w-screen px-24">
          <div className="flex items-center">
            <a
              className="text-3xl font-bold font-heading cursor-pointer"
              onClick={() => onRouteChange("home")}
            >
              Ignitus Networks
            </a>
          </div>

          <ul className="flex space-x-12 font-semibold font-heading">
            <li>
              <a
                className="no-underline text-gray-200 cursor-pointer"
                onClick={() => onRouteChange("explore")}
              >
                Explore Video NFTs
              </a>
            </li>
            <li>
              <a
                className="no-underline text-gray-200 cursor-pointer"
                onClick={() => onRouteChange("mint")}
              >
                Mint
              </a>
            </li>
          </ul>

          <div className="flex items-center">
            <button
              className="inline-flex items-center justify-center border-[0.5px] p-2 w-28 h-9 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 transition-all duration-150 ease-in-out"
              onClick={() => {
                setShow(true);
              }}
            >
              {address ? (
                <div className="truncate">{address}</div>
              ) : (
                "CONNECT"
              )}
            </button>
          </div>
        </nav>
      </section>
      <Abstraxion onClose={() => setShow(false)} />
    </div>
  );
};

export default Navbar;
