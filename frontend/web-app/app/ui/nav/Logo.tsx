"use client";

import React from "react";
import { useParamsStore } from "@/app/hooks/useParamsStore";
import { AiOutlineCar } from "react-icons/ai";
import { usePathname, useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();
  const pathname = usePathname();

  function doReset() {
    if (pathname !== "/") router.push("/");
    reset();
  }

  const reset = useParamsStore((state) => state.reset);

  return (
    <div
      onClick={doReset}
      className="flex items-center gap-2 text-3xl font-semibold text-red-500 cursor-pointer"
    >
      <AiOutlineCar size={34} />
      <div>Carsties Auctions</div>
    </div>
  );
};

export default Logo;
