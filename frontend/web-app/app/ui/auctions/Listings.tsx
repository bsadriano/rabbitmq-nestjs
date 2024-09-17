"use client";

import { useParamsStore } from "@/app/hooks/useParamsStore";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { getData } from "@/app/actions/auction.actions";
import { useAuctionStore } from "@/app/hooks/useAuctionStore";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import AuctionCard from "./auction-card";
import EmptyFilter from "./empty-filter";
import Filters from "./filters";

const Listings = () => {
  // const [data, setData] = useState<AuctionConnection>();
  const [loading, setLoading] = useState(true);

  const hasNextPage = useParamsStore((state) => state.hasNextPage);
  const hasPreviousPage = useParamsStore((state) => state.hasPreviousPage);

  const { data: session, status } = useSession();

  const params = useParamsStore(
    useShallow((state) => ({
      first: state.first,
      after: state.after,
      before: state.before,
      last: state.last,
      searchTerm: state.searchTerm,
      orderBy: state.orderBy,
      filterBy: state.filterBy,
      next: state.next,
      prev: state.prev,
      seller: state.seller,
      winner: state.winner,
    }))
  );

  const data = useAuctionStore((state) => state.data);
  const setData = useAuctionStore((state) => state.setData);

  const setParams = useParamsStore((state) => state.setParams);

  function setAfter(after: string) {
    setParams({ after, next: true, prev: false });
  }

  function setBefore(before: string) {
    setParams({ before, next: false, prev: true });
  }

  useEffect(() => {
    getData(params).then((data) => {
      setParams({
        hasNextPage: data.next ? data.next.pageInfo.hasNextPage! : hasNextPage,
        hasPreviousPage: data.prev
          ? data.prev.pageInfo.hasPreviousPage!
          : hasPreviousPage,
      });
      setData(data);
      setLoading(false);
    });
  }, [params, hasNextPage, hasPreviousPage, setParams, setData]);

  const fetchPrevious = () => {
    setParams({
      hasNextPage: true,
    });
    const pageInfo = currData ? currData.pageInfo : null;
    const cursor = pageInfo?.startCursor;
    setBefore(cursor!);
  };

  const fetchNext = () => {
    setParams({
      hasPreviousPage: true,
    });
    const pageInfo = currData ? currData.pageInfo : null;
    const cursor = pageInfo?.endCursor;
    setAfter(cursor!);
  };

  const currData = data?.next ? data?.next : data?.prev ? data?.prev : null;
  const edges = currData ? currData.edges : [];

  if (!data || status === "loading") return <h3>Loading...</h3>;

  return (
    <>
      <Filters />
      {edges.length === 0 ? (
        <EmptyFilter showReset />
      ) : (
        <>
          <div className="grid grid-cols-4 gap-6">
            {edges.map(({ node }) => (
              <AuctionCard key={node.id} auction={node} />
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <button
              className={clsx("px-4 py-2 text-white rounded my-10 mr-2", {
                "bg-blue-300": !hasPreviousPage,
                "bg-blue-500 hover:bg-blue-700": hasPreviousPage,
              })}
              disabled={!hasPreviousPage}
              onClick={fetchPrevious}
            >
              Previous
            </button>
            <button
              className={clsx("px-4 py-2 text-white rounded my-10", {
                "bg-blue-300": !hasNextPage,
                "bg-blue-500 hover:bg-blue-700": hasNextPage,
              })}
              disabled={!hasNextPage}
              onClick={fetchNext}
            >
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Listings;
