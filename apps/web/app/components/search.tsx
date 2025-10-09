'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { keywords } from "./keywords";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<{ name: string; link: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    const normalizedQuery = value.toLowerCase().replace(/\s/g, "");

    if (normalizedQuery === "") {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const suggestions = keywords.filter(item =>
      item.name.toLowerCase().replace(/\s/g, "").includes(normalizedQuery)
    );

    setFilteredSuggestions(suggestions);
    setShowSuggestions(true);
  };

  const handleSelect = (link: string) => {
    setQuery(""); // Clear input
    setFilteredSuggestions([]); // Hide suggestions
    setShowSuggestions(false);
    router.push(link); // Navigate
  };

  const handleSearch = () => {
    const normalizedQuery = query.toLowerCase().replace(/\s/g, "");

    const match = keywords.find(
      item => item.name.toLowerCase().replace(/\s/g, "") === normalizedQuery
    );

    if (match) {
      handleSelect(match.link);
    } else {
      alert("No matching show found.");
    }
  };

  // Detect click outside to hide suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto z-50" ref={containerRef}>
      <div className="relative w-full">
        <input
          className="w-full border-2 border-gray-300 bg-transparent text-white h-7 px-0.5  sm:px-4 pr-10 rounded-md text-sm focus:outline-none placeholder:text-gray-300"
          type="search"
          name="search"
          placeholder="Search"
          value={query}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Prevent page reload
              handleSearch();     // Trigger search logic
            }
          }}
          onFocus={() => {
            if (query.trim() !== "") setShowSuggestions(true);
          }}
        />
        <button
          type="button"
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          <svg
            className="text-white h-4 w-4 fill-current"
            style={{ backdropFilter: "blur(50px)" }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 56.966 56.966"
            width="16"
            height="16"
          >
            <path d="M55.146,51.887L41.588,37.786c3.486-4.144,
              5.396-9.358,5.396-14.786 c0-12.682-10.318-23-23-23
              s-23,10.318-23,23 s10.318,23,23,23c4.761,0,
              9.298-1.436,13.177-4.162 l13.661,14.208c0.571,
              0.593,1.339,0.92,2.162,0.92 c0.779,0,
              1.518-0.297,2.079-0.837 C56.255,54.982,
              56.293,53.08,55.146,51.887z M23.984,6c9.374,
              0,17,7.626,17,17s-7.626,17-17,17 s-17-7.626,
              -17-17S14.61,6,23.984,6z"
            />
          </svg>
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute w-full mt-2 bg-white text-black rounded-md shadow-lg overflow-hidden text-sm">
          {filteredSuggestions.map((item) => (
            <li
              key={item.name}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelect(item.link)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
