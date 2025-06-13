import {
  PiCaretDoubleLeftBold,
  PiCaretDoubleRightBold,
  PiCaretLeftBold,
  PiCaretRightBold,
} from "@preact-icons/pi";
import { TagModel } from "@data/frontend/models/tag.model.ts";

interface PaginationNavProps {
  pageNumber: number;
  pageSize: number;
  totalResults: number;
  searchQuery: string;
  searchCategory: string;
  sortBy: string;
  filter: string;
  activeLayout: string;
  tags: TagModel[];
}

export function PaginationNav({
  pageNumber,
  pageSize,
  totalResults,
  searchQuery,
  searchCategory,
  sortBy,
  filter,
  activeLayout,
  tags,
}: PaginationNavProps) {
  const tagSlugs = tags.map((tag) => tag.slug).join(",");
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "1rem",
        marginBottom: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "0.5rem",
          alignItems: "center",
        }}
      >
        {pageNumber > 1 && (
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <a
              aria-label="First page"
              id="first-page"
              class="pagination-link"
              href={`/devices?page=1&search=${searchQuery}&category=${searchCategory}&sort=${sortBy}&filter=${filter}&tags=${tagSlugs}&layout=${activeLayout}`}
              data-tooltip="First page"
              aria-describedby="first-page-tooltip"
            >
              <PiCaretDoubleLeftBold aria-hidden="true" focusable="false" />
            </a>
            <span id="first-page-tooltip" class="sr-only">
              Go to the first page
            </span>

            <a
              aria-label="Previous page"
              id="previous-page"
              class="pagination-link"
              href={`/devices?page=${
                pageNumber - 1
              }&search=${searchQuery}&category=${searchCategory}&sort=${sortBy}&filter=${filter}&tags=${tagSlugs}&layout=${activeLayout}`}
              data-tooltip="Previous page"
              aria-describedby="previous-page-tooltip"
            >
              <PiCaretLeftBold aria-hidden="true" focusable="false" />
            </a>
            <span id="previous-page-tooltip" class="sr-only">
              Go to the previous page
            </span>
          </div>
        )}
        <span>
          Page: {pageNumber}
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          (
          {(pageNumber - 1 == 0) ? 1 : ((pageNumber - 1) * pageSize) + 1}-
          {totalResults < pageNumber * pageSize
            ? totalResults
            : pageNumber * pageSize} of {totalResults}
          )
        </span>

        {pageNumber < Math.ceil(totalResults / pageSize) && (
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <a
              aria-label="Next page"
              id="next-page"
              class="pagination-link"
              href={`/devices?page=${
                pageNumber + 1
              }&search=${searchQuery}&category=${searchCategory}&sort=${sortBy}&filter=${filter}&tags=${tagSlugs}&layout=${activeLayout}`}
              data-tooltip="Next page"
              aria-describedby="next-page-tooltip"
            >
              <PiCaretRightBold aria-hidden="true" focusable="false" />
            </a>
            <span id="next-page-tooltip" class="sr-only">
              Go to the next page
            </span>

            <a
              aria-label="Last page"
              id="last-page"
              class="pagination-link"
              href={`/devices?page=${
                Math.ceil(totalResults / pageSize)
              }&search=${searchQuery}&category=${searchCategory}&sort=${sortBy}&filter=${filter}&tags=${tagSlugs}&layout=${activeLayout}`}
              data-tooltip="Last page"
              aria-describedby="last-page-tooltip"
            >
              <PiCaretDoubleRightBold aria-hidden="true" focusable="false" />
            </a>
            <span id="last-page-tooltip" class="sr-only">
              Go to the last page
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
