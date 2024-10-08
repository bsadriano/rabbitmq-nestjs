"use client";

import React from "react";
import { useParamsStore } from "../hooks/useParamsStore";
import { FaSearch } from "react-icons/fa";

interface Props {}

const Search = (props: Props) => {
  const setParams = useParamsStore((state) => state.setParams);
  const setSearchValue = useParamsStore((state) => state.setSearchValue);
  const searchTerm = useParamsStore((state) => state.searchTerm);
  const searchValue = useParamsStore((state) => state.searchValue);

  function onChange(event: any) {
    setSearchValue(event.target.value);
  }

  function search() {
    setParams({ searchTerm: searchValue });
  }

  return (
    <div className="flex w-[50%] items-center border-2 rounded-full py-2 shadow-sm">
      <input
        type="text"
        onChange={onChange}
        onKeyDown={(e: any) => {
          if (e.key === "Enter") search();
        }}
        value={searchValue}
        placeholder="Search for cars by make, model or color"
        className="flex-grow pl-5 bg-transparent focus:outline-none border-transparent focus:border-transparent focus:ring-0 text-sm text-gray-600"
      />
      <button>
        <FaSearch
          size={34}
          onClick={search}
          className="bg-red-400 text-white rounded-full p-2 cursor-pointer mx-2"
        />
      </button>
    </div>
  );
};

export default Search;
