"use client";

import React from "react";
import Countdown, { zeroPad } from "react-countdown";

interface Props {
  auctionEnd: string;
}

interface RendererProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

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

const CountdownTimer = ({ auctionEnd }: Props) => (
  <div>
    <Countdown date={new Date(parseInt(auctionEnd))} renderer={renderer} />
  </div>
);

export default CountdownTimer;
