"use client";

import { Pagination } from "flowbite-react";
import React from "react";

interface Props {
  currentPage: number;
  pageChanged: (page: number) => void;
  pageCount: number;
}

const AppPagination = ({ currentPage, pageChanged, pageCount }: Props) => {
  return (
    <Pagination
      currentPage={currentPage}
      onPageChange={(e) => pageChanged(e)}
      totalPages={pageCount}
      layout="pagination"
      showIcons={true}
      className="text-blue-500 mb-5"
    />
  );
};

export default AppPagination;
