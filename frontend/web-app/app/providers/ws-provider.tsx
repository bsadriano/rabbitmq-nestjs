"use client";

import { getDetailedViewData } from "@/app/actions/auction.actions";
import { useAuctionStore } from "@/app/hooks/useAuctionStore";
import { useBidStore } from "@/app/hooks/useBidStore";
import { Auction, AuctionFinished, Bid } from "@/app/types";
import AuctionCreatedToast from "@/app/ui/auctions/toast/auction-created.toast";
import AuctionFinishedToast from "@/app/ui/auctions/toast/auction-finished.toast";
import { User } from "next-auth";
import { useParams } from "next/navigation";
import { ReactNode, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ReadyState } from "react-use-websocket";
import { io } from "socket.io-client";
import { AppUser } from "../lib/definitions";

interface Props {
  children: ReactNode;
  user: (AppUser & User) | undefined;
}
export default function WSProvider({ children, user }: Props) {
  const [socket, setSocket] = useState<any>(null);
  const setCurrentPrice = useAuctionStore((state) => state.setCurrentPrice);
  const addBid = useBidStore((state) => state.addBid);
  const params = useParams<{ id: string }>();

  const handleClickSendMessage = useCallback(() => {
    socket.emit("ping", "Hello, World!");
  }, [socket]);

  const [readyState, setReadyState] = useState<ReadyState>(
    ReadyState.UNINSTANTIATED
  );

  const [messages, setMessages] = useState<any[]>([]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const handleAuctionFinished = useCallback(
    async (finishedAuction: AuctionFinished) => {
      const auction = await getDetailedViewData(finishedAuction.auctionId);

      const SuccessToast = (auction: Auction) => (
        <AuctionFinishedToast
          auction={auction}
          finishedAuction={finishedAuction}
        />
      );

      if (!("error" in auction)) {
        return toast.promise(Promise.resolve(auction), {
          loading: "Loading...",
          success: SuccessToast,
          error: "Error",
        });
      }
    },
    []
  );

  const handleAuctionCreated = useCallback(
    (auction: Auction) => {
      if (user?.username !== auction.seller) {
        return toast(<AuctionCreatedToast auction={auction} />, {
          duration: 10000,
        });
      }
    },
    [user?.username]
  );

  const handleBidPlaced = useCallback(
    (bid: Bid) => {
      if (params && +params?.id === +bid.auctionId) {
        addBid(bid);
      } else if (bid.bidStatus.includes("ACCEPTED")) {
        setCurrentPrice(bid.auctionId, bid.amount);
      }
    },
    [setCurrentPrice, addBid, params]
  );

  useEffect(() => {
    if (socket === null) {
      const newSocket = io("http://localhost:7005");

      setReadyState(ReadyState.CONNECTING);
      newSocket.connect();
      newSocket.on("connect", () => {
        setReadyState(ReadyState.OPEN);
      });
      newSocket.on("BidPlaced", (bid) => handleBidPlaced(bid));
      newSocket.on("AuctionCreated", handleAuctionCreated);
      newSocket.on("AuctionFinished", handleAuctionFinished);
      setSocket(newSocket);
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket, handleBidPlaced, handleAuctionCreated, handleAuctionFinished]);

  return <>{children}</>;
}
