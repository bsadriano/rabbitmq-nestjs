import React from "react";
import { Auction } from "@/app/lib/definitions";
import CarImage from "./car-image";
import CountdownTimer from "./countdown-timer";
import Link from "next/link";

interface Props {
  auction: Auction;
}

const AuctionCard = ({ auction }: Props) => {
  return (
    <Link href={`/auctions/details/${auction.id}`}>
      <div className="relative w-full bg-gray-200 aspect-[16/10] rounded-lg overflow-hidden">
        <CarImage imageUrl={auction.imageUrl} />
        <div className="absolute bottom-2 left-2">
          <CountdownTimer auctionEnd={auction.auctionEnd} />
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <h3 className="text-gray-700">
          {auction.make} {auction.model}
        </h3>
        <p className="font-semibold text-sm">{auction.year}</p>
      </div>
    </Link>
  );
};

export default AuctionCard;
