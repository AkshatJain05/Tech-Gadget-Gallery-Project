import { useState } from "react";
import { useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function Search() {
  const [query, setQuery] = useState("");
 
  const navigate = useNavigate();

    useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        fetchProducts(query);
      } 
    }, 500); // debounce 500ms

    return () => clearTimeout(delayDebounce);
  }, [query]);
    
  const fetchProducts = () => {
    // e.preventDefault();
    if (query.trim()) {
        navigate(`/search?q=${query}`);
        setQuery("");
    }
  };
  return (
    <>
      <div className="my-5 mx-1 md:my-0 md:mx-0 flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full cursor-pointer">
        <input
          className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
          type="search"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products"
        />
        <IoSearch className="text-xl" />
      </div>
    </>
  );
}

export default Search;
