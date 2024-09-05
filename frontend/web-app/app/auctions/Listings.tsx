"use client";

import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useParamsStore } from "../hooks/useParamsStore";
import { Auction, PagedResult } from "../types";

import qs from "query-string";
import AppPagination from "../components/AppPagination";
import EmptyFilter from "../components/EmptyFilter";
import AuctionCard from "./AuctionCard";
import Filters from "./Filters";
import { getData } from "../actions/auctionActions";

interface Props {}

const Listings = (props: Props) => {
  const [data, setData] = useState<PagedResult<Auction>>();
  const params = useParamsStore(
    useShallow((state) => ({
      pageNumber: state.pageNumber,
      pageSize: state.pageSize,
      searchTerm: state.searchTerm,
      orderBy: state.orderBy,
      filterBy: state.filterBy,
    }))
  );
  const setParams = useParamsStore((state) => state.setParams);
  const url = qs.stringifyUrl({ url: "", query: params });

  function setPageNumber(pageNumber: number) {
    setParams({ pageNumber });
  }

  // useEffect(() => {
  //   console.log(items);
  // }, [items]);

  useEffect(() => {
    getData({ pageSize: 2, pageNumber: 1 }).then((data) => {
      console.log(data);
      setData(data);
    });
  }, []);

  if (!data) return <h3>Loading...</h3>;

  return (
    <>
      <Filters />
      {data.totalCount === 0 ? (
        <EmptyFilter showReset />
      ) : (
        <>
          <div className="grid grid-cols-4 gap-6">
            {data.results.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <AppPagination
              pageChanged={setPageNumber}
              currentPage={params.pageNumber}
              pageCount={data.pageCount}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Listings;
