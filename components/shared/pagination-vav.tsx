import {
  PiCaretDoubleLeftBold,
  PiCaretDoubleRightBold,
  PiCaretLeftBold,
  PiCaretRightBold,
} from "@preact-icons/pi";
import { TagModel } from "../../data/frontend/models/tag.model.ts";

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

export default function PaginationNav({
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
            >
              <PiCaretDoubleLeftBold />
            </a>

            <a
              aria-label="Previous page"
              id="previous-page"
              class="pagination-link"
              href={`/devices?page=${
                pageNumber - 1
              }&search=${searchQuery}&category=${searchCategory}&sort=${sortBy}&filter=${filter}&tags=${tagSlugs}&layout=${activeLayout}`}
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
              aria-label="Next page"
              id="next-page"
              class="pagination-link"
              href={`/devices?page=${
                pageNumber + 1
              }&search=${searchQuery}&category=${searchCategory}&sort=${sortBy}&filter=${filter}&tags=${tagSlugs}&layout=${activeLayout}`}
              data-tooltip="Next page"
            >
              <PiCaretRightBold />
            </a>

            <a
              aria-label="Last page"
              id="last-page"
              class="pagination-link"
              href={`/devices?page=${
                Math.ceil(totalResults / pageSize)
              }&search=${searchQuery}&category=${searchCategory}&sort=${sortBy}&filter=${filter}&tags=${tagSlugs}&layout=${activeLayout}`}
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
