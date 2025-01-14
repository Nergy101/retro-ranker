interface PaginationNavProps {
  pageNumber: number;
  pageSize: number;
  totalResults: number;
  searchQuery: string;
  searchCategory: string;
}

export function PaginationNav({
  pageNumber,
  pageSize,
  totalResults,
  searchQuery,
  searchCategory,
}: PaginationNavProps) {
  return (
    <div style="display: flex; justify-content: center;">
      <div style="display: flex; flex-direction: row; gap: 0.5rem; align-items: center;">
        {pageNumber > 1 && (
          <a
            href={`/devices?page=${
              pageNumber - 1
            }&search=${searchQuery}&category=${searchCategory}`}
          >
            <i class="ph-bold ph-caret-left"></i>
          </a>
        )}

        <span>
          {(pageNumber - 1 == 0) ? 1 : ((pageNumber - 1) * pageSize) + 1}-
          {totalResults < pageNumber * pageSize
            ? totalResults
            : pageNumber * pageSize}
        </span>
        <span>of {totalResults}</span>

        {pageNumber < Math.ceil(totalResults / pageSize) && (
          <a
            href={`/devices?page=${
              pageNumber + 1
            }&search=${searchQuery}&category=${searchCategory}`}
          >
            <i class="ph-bold ph-caret-right"></i>
          </a>
        )}
      </div>
    </div>
  );
} 