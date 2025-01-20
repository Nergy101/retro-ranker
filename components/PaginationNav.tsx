import { PiCaretDoubleLeftBold, PiCaretDoubleRightBold, PiCaretLeftBold, PiCaretRightBold } from "@preact-icons/pi";

interface PaginationNavProps {
  pageNumber: number;
  pageSize: number;
  totalResults: number;
  searchQuery: string;
  searchCategory: string;
  sortBy: string;
  filter: string;
}

export function PaginationNav({
  pageNumber,
  pageSize,
  totalResults,
  searchQuery,
  searchCategory,
  sortBy,
  filter,
}: PaginationNavProps) {
  return (
    <div style="display: flex; justify-content: center; margin-top: 1rem; margin-bottom: 1rem;">
      <div style="display: flex; flex-direction: row; gap: 0.5rem; align-items: center;">
        {pageNumber > 1 && (
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <a
              name="first-page"
              class="pagination-link"
              href={`/devices?page=1&search=${searchQuery}&category=${searchCategory}&sort=${sortBy}&filter=${filter}`}
              data-tooltip="First page"
            >
              <PiCaretDoubleLeftBold />
            </a>

            <a
              name="previous-page"
              class="pagination-link"
              href={`/devices?page=${
                pageNumber - 1
              }&search=${searchQuery}&category=${searchCategory}&sort=${sortBy}&filter=${filter}`}
              data-tooltip="Previous page"
            >
              <PiCaretLeftBold />
            </a>
          </div>
        )}
        <span>
          Page: {pageNumber}
        </span>
        <span>
          (
          {(pageNumber - 1 == 0) ? 1 : ((pageNumber - 1) * pageSize) + 1}-
          {totalResults < pageNumber * pageSize
            ? totalResults
            : pageNumber * pageSize}
          &nbsp;of {totalResults}
          )
        </span>

        {pageNumber < Math.ceil(totalResults / pageSize) && (
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <a
              name="next-page"
              class="pagination-link"
              href={`/devices?page=${
                pageNumber + 1
              }&search=${searchQuery}&category=${searchCategory}&sort=${sortBy}&filter=${filter}`}
              data-tooltip="Next page"
            >
              <PiCaretRightBold />
            </a>

            <a
              name="last-page"
              class="pagination-link"
              href={`/devices?page=${
                Math.ceil(totalResults / pageSize)
              }&search=${searchQuery}&category=${searchCategory}&sort=${sortBy}&filter=${filter}`}
              data-tooltip="Last page"
            >
              <PiCaretDoubleRightBold />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
