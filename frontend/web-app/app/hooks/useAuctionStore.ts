import { AuctionConnection, AuctionEdge } from "@/app/types";
import { create } from "zustand";

type State = {
  data: AuctionConnection;
};

type Actions = {
  setData: (data: AuctionConnection) => void;
  setCurrentPrice: (auctionId: string, amount: number) => void;
};

const initialState: State = {
  data: {},
};

export const useAuctionStore = create<State & Actions>((set) => ({
  ...initialState,

  setData: (data: AuctionConnection) => {
    set(() => ({
      data,
    }));
  },

  setCurrentPrice: (auctionId: string, amount: number) => {
    set((state) => {
      const { next, prev } = state.data;

      if (next) {
        return {
          data: {
            next: {
              ...next,
              edges: updateEdges(next.edges, auctionId, amount),
            },
            prev: null,
          },
        };
      }

      if (prev) {
        return {
          data: {
            prev: {
              ...prev,
              edges: updateEdges(prev.edges, auctionId, amount),
            },
            next: null,
          },
        };
      }

      return state;
    });
  },
}));

function updateEdges(edges: AuctionEdge[], auctionId: string, amount: number) {
  return edges.map((edge) => {
    const node = edge.node;
    if (+node.id === +auctionId) {
      node.currentHighBid = amount;
    }

    return {
      ...edge,
      node,
    };
  });
}
