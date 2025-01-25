import { useState } from "react";

export const usePagination = (itemsPerPage: number, items: any[]) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(itemsPerPage);

  const pageCount = Math.ceil(items.length / perPage);
  const currentItems = items.slice(
    currentPage * perPage,
    (currentPage + 1) * perPage
  );

  const nextPage = () => {
    if (currentPage < pageCount - 1) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const setPage = (page: number) => {
    if (page >= 0 && page < pageCount) setCurrentPage(page);
  };

  const setNumberPerPage = (num: number) => {
    setPerPage(num);
    setCurrentPage(0); // Reset to the first page
  };

  const options = [5, 10, 20, 50].map((num) => ({
    value: num,
    label: `${num} items`,
  }));

  return {
    currentItems,
    pageCount,
    currentPage,
    nextPage,
    prevPage,
    setPage,
    options,
    setNumberPerPage,
  };
};
