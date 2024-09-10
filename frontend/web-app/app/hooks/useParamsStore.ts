import { create } from "zustand";

type State = {
  first: number;
  after: string;
  before: string;
  last: number;
  pageCount: number;
  searchTerm: string;
  searchValue: string;
  orderBy: string;
  filterBy: string;
  seller?: string;
  winner?: string;
  next: boolean;
  prev: boolean;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type Actions = {
  setSearchValue: (value: string) => void;
  setParams: (params: Partial<State>) => void;
  reset: () => void;
};

const initialState: State = {
  first: 4,
  after: "",
  before: "",
  last: 4,
  pageCount: 1,
  searchTerm: "",
  searchValue: "",
  orderBy: "make",
  filterBy: "live",
  seller: undefined,
  winner: undefined,
  next: true,
  prev: false,
  hasNextPage: false,
  hasPreviousPage: false,
};

export const useParamsStore = create<State & Actions>((set) => ({
  ...initialState,
  setParams: (newParams: Partial<State>) => {
    set((state) => {
      if (newParams.after) {
        return {
          ...state,
          after: newParams.after,
          next: newParams.next,
          prev: newParams.prev,
        };
      } else if (newParams.before) {
        return {
          ...state,
          before: newParams.before,
          next: newParams.next,
          prev: newParams.prev,
        };
      } else if (
        Object.keys(newParams).some((key) =>
          ["hasNextPage", "hasPreviousPage"].includes(key)
        )
      ) {
        return {
          ...state,
          ...newParams,
        };
      } else {
        return {
          ...state,
          ...newParams,
          after: "",
          before: "",
          next: true,
          prev: false,
          hasNextPage: false,
          hasPreviousPage: false,
        };
      }
    });
  },
  reset: () => {
    set(initialState);
  },
  setSearchValue: (value: string) => {
    set({ searchValue: value });
  },
}));
