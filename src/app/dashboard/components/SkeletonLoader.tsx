export const SummaryCardsSkeleton = () => (
  <>
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={`summary-skeleton-${index}`}
        className="flex flex-col justify-center rounded-lg bg-gray-200/80 p-4 h-[120px] w-[220px] animate-pulse"
      >
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-3" />
        <div className="h-6 bg-gray-300 rounded w-3/4" />
      </div>
    ))}
  </>
);

export const TableSkeleton = () => {
  const columns = Array.from({ length: 8 });
  const rows = Array.from({ length: 8 });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div className="bg-gray-200 h-12 animate-pulse" />
      <div className="divide-y divide-gray-100">
        {rows.map((_, rowIndex) => (
          <div
            key={`table-row-skeleton-${rowIndex}`}
            className="flex px-4 py-4 gap-4 animate-pulse"
          >
            {columns.map((_, colIndex) => (
              <div
                key={`table-cell-skeleton-${rowIndex}-${colIndex}`}
                className="h-4 bg-gray-200 rounded flex-1"
              />
            ))}
          </div>
        ))}
      </div>
      <div className="border-t bg-gray-100 h-14 animate-pulse" />
    </div>
  );
};

export const PieChartsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={`pie-card-skeleton-${index}`}
        className="bg-white rounded-lg shadow-md p-6 animate-pulse"
      >
        <div className="h-5 bg-gray-300 rounded w-1/2 mx-auto mb-6" />
        <div className="w-32 h-32 md:w-44 md:h-44 rounded-full bg-gray-200 mx-auto" />
      </div>
    ))}
  </div>
);
