import { useState } from "react";
import CollectionPhotos from "./CollectionPhotos";
import heroRight from "../assets/hero-right.png";
import heroLeft from "../assets/hero-left.png";
import bgGradient from "../assets/gradiend-bg.svg";

function SearchPage() {
  const [isSearching, setIsSearching] = useState(false);

  const [inputValue, setInputValue] = useState("");

  const showImages = inputValue.length > 2 && isSearching;

  const handleInputChange = (e) => {
    const value = e.target.value;

    setInputValue(value);


    if (value === "") {
      setIsSearching(false);
    } else if (value !== "" && value.length > 2) {
      setIsSearching(true);
    }
  };

  return (
    <section className="relative flex min-h-[calc(100vh-66px)] w-full flex-col overflow-hidden">
      {!isSearching ? (
        <div className="flex flex-1 items-center">
          <div className="flex flex-1 justify-start">
            <img
              src={heroLeft}
              className="h-full max-w-[90%] object-cover"
              alt="hero left"
            />
          </div>
          <div className="flex flex-1 justify-end">
            <img
              src={heroRight}
              className="h-full max-w-[90%] object-cover"
              alt="hero right"
            />
          </div>
        </div>
      ) : (
        <>
          <div>
            <img
              src={bgGradient}
              alt="bg-gradient"
              className="h-[90px] w-full object-cover"
            />
          </div>
        </>
      )}

      <div
        className={`flex transform flex-col space-y-4 transition-all duration-500 ease-in-out ${
          isSearching
            ? "absolute top-4 left-1/2 z-10 -translate-x-1/2 translate-y-0"
            : "absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
        }`}
      >
        {!isSearching && (
          <>
            <h3 className="text-4xl font-bold">Search</h3>
            <p>Search high resolution images from Unsplash</p>
          </>
        )}
        <input
          className={`border-secondary w-[530px] rounded-lg border bg-white p-3 shadow-2xl focus:outline-none ${isSearching && "text-2xl"}`}
          type="search"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter your keywords..."
        />
      </div>
      {showImages && <CollectionPhotos />}
    </section>
  );
}
export default SearchPage;
