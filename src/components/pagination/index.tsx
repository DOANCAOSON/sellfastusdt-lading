import { updateQs, updateURLState } from "@/utils/query-string";
import { useMemo, useState } from "preact/compat";

type Props = {
  totalRecords: number;
  pageSize: number;
  defaultValue: number;
  onChange?: (page: number) => void;
};

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};
export const Pagination = (props: Props) => {
  const { onChange, totalRecords, defaultValue, pageSize } = props;
  const [currentPage, setCurrentPage] = useState<number>(defaultValue);
  const totalPageCount = Math.ceil(totalRecords / pageSize);

  const onChangePage = (page: number) => {
    onChange && onChange(page);
    location.replace(location.pathname + "?page=" + page);
  };

  const paginationRange = useMemo(() => {
    const fixedNumPages = 6;
    if (totalPageCount <= fixedNumPages) return [...range(1, totalPageCount)];
    const middle = Math.ceil(fixedNumPages / 2);
    if (currentPage <= middle + 1)
      return [...range(1, middle + 2), "DOTS", totalPageCount];
    if (currentPage > totalPageCount - middle - 1)
      return [
        1,
        "DOTS",
        ...range(totalPageCount - (middle + 1), totalPageCount),
      ];
    return [
      1,
      "DOTS",
      ...range(currentPage - middle + 1, currentPage + middle - 1),
      "DOTS",
      totalPageCount,
    ];
  }, [currentPage, totalPageCount]);

  if (!currentPage || paginationRange.length < 1) return null;
  return (
    <nav aria-label="Page navigation example">
      <ul className="inline-flex -space-x-px text-sm">
        {Number(currentPage) > 1 && (
          <li>
            <a
              onClick={() => onChangePage(Number(currentPage) - 1)}
              class="flex cursor-pointer items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700  dark:text-gray-400  dark:hover:text-white"
            >
              Prev
            </a>
          </li>
        )}
        {paginationRange.map((pageNum, idx) => {
          if (pageNum === "DOTS") {
            return (
              <li>
                <span className="no-index" key={idx}>
                  &#8230;
                </span>
              </li>
            );
          }
          return (
            <li>
              <a
                onClick={() => {
                  onChangePage(pageNum as number);
                }}
                key={idx}
                className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 cursor-pointer dark:text-gray-400  dark:hover:text-dark ${
                  pageNum === defaultValue && "bg-blue-50 hover:bg-blue-100"
                }`}
              >
                {pageNum}
              </a>
            </li>
          );
        })}
        {Number(currentPage) * Number(pageSize) < Number(totalRecords) && (
          <li>
            <a
              onClick={() => onChangePage(Number(currentPage) + 1)}
              class={`flex items-center cursor-pointer justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700  dark:text-gray-400  dark:hover:text-white}`}
            >
              Next
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
};
