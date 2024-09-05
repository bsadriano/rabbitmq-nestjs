"use client";

import React from "react";
import { useParamsStore } from "../hooks/useParamsStore";
import { AiOutlineCar } from "react-icons/ai";

interface Props {}

const Logo = (props: Props) => {
  const reset = useParamsStore((state) => state.reset);

  return (
    <div
      onClick={reset}
      className="flex items-center gap-2 text-3xl font-semibold text-red-500 cursor-pointer"
    >
      <AiOutlineCar size={34} />
      <div>Carsties Auctions</div>
    </div>
  );
};

export default Logo;
