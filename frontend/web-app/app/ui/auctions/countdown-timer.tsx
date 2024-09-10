"use client";

import React, { useEffect, useState } from "react";
import Countdown, { zeroPad } from "react-countdown";

interface Props {
  auctionEnd: string | number;
}

interface RendererProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

const Skeleteon = () => {
  return (
    <div className="border-2 border-white text-white py-1 px-2 rounded-lg flex justify-center bg-gray-300">
      <span>00:00:00:00</span>
    </div>
  );
};

const renderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}: RendererProps) => (
  <div
    className={`border-2 border-white text-white py-1 px-2 rounded-lg flex justify-center ${
      completed
        ? "bg-red-600"
        : days === 0 && hours < 10
        ? "bg-amber-600"
        : "bg-green-600"
    }`}
  >
    {completed ? (
      <span>Auction Finished</span>
    ) : (
      <span>
        {days}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
      </span>
    )}
  </div>
);

const CountdownTimer = ({ auctionEnd }: Props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isClient === false) return <Skeleteon />;

  return (
    <div>
      <Countdown date={new Date(+auctionEnd)} renderer={renderer} />
    </div>
  );
};

export default CountdownTimer;
