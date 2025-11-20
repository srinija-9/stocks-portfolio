"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Sparkle,
  FileWarning,
  TriangleAlert,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  PieLabelRenderProps,
  Legend,
} from "recharts";
import {
  useTable,
  useSortBy,
  usePagination,
  Column,
  TableInstance,
  UseSortByColumnProps,
  UsePaginationInstanceProps,
  UsePaginationState,
} from "react-table";
import {
  SummaryCardsSkeleton,
  TableSkeleton,
  PieChartsSkeleton,
} from "./components/SkeletonLoader";

interface Stock {
  sector: string;
  particular: string;
  purchasePrice: number;
  qty: number;
  exchange: string;
  cmp: number;
  epsTrailingTwelveMonths: number;
  trailingPE: number;
  investment: number;
  presentValue: number;
  gain: number;
  gainPercent: number;
  totalGain: number;
  totalGainPercent: number;
  portfolioPercent: number;
  [key: string]: string | number | boolean | null | undefined;
}
interface PieChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

type TableColumn = Column<Stock> & UseSortByColumnProps<Stock>;
type TableInstanceWithSort = TableInstance<Stock> &
  UsePaginationInstanceProps<Stock> & {
    state: UsePaginationState<Stock>;
  };

const formatLabelName = (name?: string | number) => {
  if (typeof name === "string") {
    return name.split(" ")[0];
  }
  if (typeof name === "number") {
    return name.toString();
  }
  return "N/A";
};

const StockDashboard: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState("Dashboard");

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  };

  const [firstColWidth, setFirstColWidth] = useState<number>(200);
  const [isResizing, setIsResizing] = useState<boolean>(false);

  const columns = useMemo<Column<Stock>[]>(
    () => [
      {
        Header: "Particulars",
        accessor: "particular",
        disableSortBy: true,
      },
      {
        Header: "Purchase Price",
        accessor: "purchasePrice",
        Cell: ({ value }: { value: number }) => formatCurrency(value),
      },
      {
        Header: "Qty",
        accessor: "qty",
      },
      {
        Header: "Investment",
        accessor: "investment",
        Cell: ({ value }: { value: number }) => formatCurrency(value),
      },
      {
        Header: "Portfolio %",
        accessor: "portfolioPercent",
        Cell: ({ value }: { value: number }) => `${value}%`,
      },
      {
        Header: "Exchange Code",
        accessor: "exchange",
        Cell: ({ value }: { value: string }) => (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
            {value}
          </span>
        ),
      },
      {
        Header: "CMP",
        accessor: "cmp",
        Cell: ({ value }: { value: number }) => formatCurrency(value),
      },
      {
        Header: "Present Value",
        accessor: "presentValue",
        Cell: ({ value }: { value: number }) => formatCurrency(value),
      },
      {
        Header: "Gain/Loss",
        accessor: "gain",
        Cell: ({ value, row }: { value: number; row: { original: Stock } }) => (
          <div
            className={`font-medium ${
              value >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            <p>
              {value >= 0 ? "+" : ""}
              {formatCurrency(value)}
            </p>
            <p>
              {value >= 0 ? "+" : ""}
              {row.original.gainPercent?.toFixed(2)}%
            </p>
          </div>
        ),
      },
      {
        Header: "Total Gain/Loss",
        accessor: "totalGain",
        Cell: ({ value, row }: { value: number; row: { original: Stock } }) => (
          <div
            className={`font-medium ${
              value >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            <p>
              {value >= 0 ? "+" : ""}
              {formatCurrency(value)}
            </p>
            <p>
              {value >= 0 ? "+" : ""}
              {row.original.totalGainPercent?.toFixed(2)}%
            </p>
          </div>
        ),
      },
      {
        Header: "P/E Ratio",
        accessor: "trailingPE",
        Cell: ({ value }: { value: number }) => value?.toFixed(2) || "--",
      },
      {
        Header: "Latest Earnings Per Share",
        accessor: "epsTrailingTwelveMonths",
        Cell: ({ value }: { value: number }) => formatCurrency(value),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    state: { pageIndex, pageSize },
    setPageSize,
    prepareRow,
  } = useTable<Stock>(
    {
      columns,
      data: stocks,
    },
    useSortBy,
    usePagination
  ) as TableInstanceWithSort;

  const pageNumbers = useMemo<(number | string)[]>(() => {
    const totalPages = pageOptions.length;
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index);
    }

    const start = Math.max(0, pageIndex - 2);
    const end = Math.min(totalPages - 1, pageIndex + 2);
    const numbers: (number | string)[] = [];

    if (start > 0) {
      numbers.push(0);
      if (start > 1) {
        numbers.push("left-ellipsis");
      }
    }

    for (let i = start; i <= end; i += 1) {
      numbers.push(i);
    }

    if (end < totalPages - 1) {
      if (end < totalPages - 2) {
        numbers.push("right-ellipsis");
      }
      numbers.push(totalPages - 1);
    }

    return numbers;
  }, [pageIndex, pageOptions.length]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = firstColWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(
        150,
        Math.min(400, startWidth + (e.clientX - startX))
      );
      setFirstColWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const getSortIcon = (column: TableColumn) => {
    if (!column.isSorted) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return column.isSortedDesc ? (
      <ArrowDown className="w-4 h-4 text-blue-600" />
    ) : (
      <ArrowUp className="w-4 h-4 text-blue-600" />
    );
  };

  interface SectorData {
    investment: number;
    presentValue: number;
    totalGain: number;
  }

  const sectorData: Record<string, SectorData> = stocks.reduce(
    (accumulator, currentHolding) => {
      const sector = currentHolding.sector;
      const investment = currentHolding.investment;
      const presentValue = currentHolding.presentValue;
      const totalGain = currentHolding.totalGain;

      if (!accumulator[sector]) {
        accumulator[sector] = { investment: 0, presentValue: 0, totalGain: 0 };
      }

      accumulator[sector].investment += investment;
      accumulator[sector].presentValue += presentValue;
      accumulator[sector].totalGain += totalGain;

      return accumulator;
    },
    {} as Record<string, SectorData>
  );

  const portfolioData: PieChartData[] = Object.keys(sectorData).map(
    (sector) => ({
      name: sector,
      value: sectorData[sector].presentValue,
    })
  );

  const investmentData: PieChartData[] = Object.keys(sectorData).map(
    (sector) => ({
      name: sector,
      value: sectorData[sector].investment,
    })
  );

  const gainLossData: PieChartData[] = Object.keys(sectorData).map(
    (sector) => ({
      name: sector,
      value: sectorData[sector].totalGain,
    })
  );

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
  ];

  const pieCharts = [
    {
      title: "Investment Allocation",
      data: investmentData,
      fill: "#ffc658",
      label: ({ name, percent }: PieLabelRenderProps) => {
        const pct =
          typeof percent === "number" ? (percent * 100).toFixed(0) : "0";
        return `${formatLabelName(name)} ${pct}%`;
      },
      tooltipFormatter: (value: number) => formatCurrency(value),
    },
    {
      title: "Portfolio Distribution",
      data: portfolioData,
      fill: "#8884d8",
      label: ({ name, percent }: PieLabelRenderProps) => {
        const pct =
          typeof percent === "number" ? (percent * 100).toFixed(0) : "0";
        return `${formatLabelName(name)} ${pct}%`;
      },
      tooltipFormatter: (value: number) => formatCurrency(value),
    },
    {
      title: "Gains Distribution",
      data: gainLossData,
      fill: "#82ca9d",
      label: ({ name, percent }: PieLabelRenderProps) => {
        const pct =
          typeof percent === "number" ? (percent * 100).toFixed(0) : "0";
        return pct !== "0" ? `${formatLabelName(name)} ${pct}%` : "";
      },
      tooltipFormatter: (value: number) => formatCurrency(value),
    },
  ];

  const totalInvestment = stocks.reduce((accumulator, currentHolding) => {
    return accumulator + currentHolding.investment;
  }, 0);

  const totalPresentValue = stocks.reduce((accumulator, currentHolding) => {
    return accumulator + currentHolding.presentValue;
  }, 0);

  const totalGain = totalPresentValue - totalInvestment;
  const totalGainPercent =
    totalInvestment === 0 ? 0 : (totalGain / totalInvestment) * 100;

  const summaryMetrics = [
    {
      label: "Total Investment",
      value: formatCurrency(totalInvestment),
      color: "bg-[#5F5980]",
    },
    {
      label: "Current Value",
      value: formatCurrency(totalPresentValue),
      color: "bg-[#929982]",
    },
    {
      label: "Total Gain",
      value: (
        <div className={totalGain > 0 ? "text-green-600" : "text-red-600"}>
          <p>{formatCurrency(totalGain)}</p>
          <p className={"text-sm"}>{totalGainPercent?.toFixed(2)}%</p>
        </div>
      ),
      color: "bg-black",
    },
  ];

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch("/api/portfolio");
        if (!response.ok) {
          throw new Error("Failed to load portfolio data");
        }
        const data: Stock[] = await response.json();

        setStocks(data);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();

    const intervalId = setInterval(() => {
      fetchPortfolio();
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl text-gray-900 mb-2">
        <b>Hi Priyanshu, </b>Welcome Back
      </h1>
      <p className="flex items-center gap-1">
        {/* <span className="">
          <TriangleAlert className="w-4 h-4 text-yellow-600" />
        </span> */}
        <span>Disclaimer: </span>
        <span className="text-red-600 font-medium">
          Investments are subject to market risk
        </span>
      </p>

      {/* <p className="mb-8 ml-21">Read all related documents carefully</p> */}
      <div className="flex gap-8 items-center mt-3 flex-wrap">
        {isLoading ? (
          <SummaryCardsSkeleton />
        ) : (
          summaryMetrics.map((card) => (
            <div
              key={card.label}
              className={`text-right text-white px-4 py-2 ${card.color} rounded-lg h-[120px] w-[220px] flex flex-col justify-center`}
            >
              {/* <div className="justify-self-start">
                <Sparkle className="w-4 h-4" />
              </div> */}
              <p className={`text-lg`}>{card.label}</p>
              <div className={`text-xl`}>{card.value}</div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-4 my-5">
        {["Dashboard", "Sector Analysis"]?.map((tab) => (
          <button
            key={tab}
            className={`px-6 py-2 text-lg rounded-t-lg font-semibold focus:outline-none border-b-2 cursor-pointer ${
              activeTab == tab
                ? "border-blue-700 text-blue-700"
                : "border-black text-black"
            } shadow`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab == "Dashboard" ? (
        isLoading ? (
          <TableSkeleton />
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="overflow-x-auto max-h-[500px] overflow-y">
              <table {...getTableProps()} className="w-full">
                <thead className="bg-gray-200">
                  {headerGroups.map((headerGroup) => {
                    const headerGroupProps = headerGroup.getHeaderGroupProps();
                    const { key: headerGroupKey, ...headerGroupRest } =
                      headerGroupProps as { key?: string };

                    return (
                      <tr
                        key={headerGroupKey ?? headerGroup.id}
                        {...headerGroupRest}
                      >
                        {headerGroup.headers.map((column, index) => {
                          const sortableColumn = column as TableColumn;
                          const headerProps = sortableColumn.getHeaderProps(
                            sortableColumn.getSortByToggleProps()
                          );
                          const { key: columnKey, ...columnRest } =
                            headerProps as { key?: string };
                          const isFirstColumn = index === 0;
                          const headerClassName = isFirstColumn
                            ? "px-4 py-3 text-left text-sm font-medium text-black capitalize relative select-none"
                            : sortableColumn.canSort
                            ? "px-4 py-3 text-right text-sm font-medium text-black capitalize cursor-pointer hover:bg-gray-200 select-none"
                            : "px-4 py-3 text-center text-sm font-medium text-black capitalize cursor-pointer hover:bg-gray-200 select-none";

                          return (
                            <th
                              key={columnKey ?? column.id}
                              {...columnRest}
                              className={headerClassName}
                              style={
                                isFirstColumn
                                  ? {
                                      width: `${firstColWidth}px`,
                                      minWidth: `${firstColWidth}px`,
                                    }
                                  : {}
                              }
                            >
                              <div
                                className={`flex items-center ${
                                  isFirstColumn
                                    ? "justify-between"
                                    : sortableColumn.id === "exchange"
                                    ? "justify-center"
                                    : "justify-end"
                                } space-x-2`}
                              >
                                <span>{column.render("Header")}</span>
                                {isFirstColumn && (
                                  <div
                                    onMouseDown={handleMouseDown}
                                    className="absolute right-0 top-0 h-full w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors"
                                    style={{
                                      cursor: isResizing
                                        ? "col-resize"
                                        : "col-resize",
                                    }}
                                  />
                                )}
                                {sortableColumn.canSort &&
                                  !isFirstColumn &&
                                  getSortIcon(sortableColumn)}
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    );
                  })}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  className="divide-y divide-gray-200"
                >
                  {page.map((row) => {
                    prepareRow(row);
                    const rowProps = row.getRowProps();
                    const { key: rowKey, ...rowRest } = rowProps as {
                      key?: string;
                    };
                    return (
                      <tr
                        key={rowKey ?? row.id}
                        {...rowRest}
                        className="hover:bg-gray-50"
                      >
                        {row.cells.map((cell, index) => {
                          const cellProps = cell.getCellProps();
                          const { key: cellKey, ...cellRest } = cellProps as {
                            key?: string;
                          };
                          const isFirstColumn = index === 0;
                          const cellClassName = isFirstColumn
                            ? "px-4 py-4 text-sm font-medium text-gray-900"
                            : cell.column.id === "exchange"
                            ? "px-4 py-4 text-sm text-center"
                            : cell.column.id === "gain"
                            ? "px-4 py-4 text-sm text-right"
                            : "px-4 py-4 text-sm text-right text-gray-700";

                          return (
                            <td
                              key={cellKey ?? cell.column.id}
                              {...cellRest}
                              className={cellClassName}
                              style={
                                isFirstColumn
                                  ? {
                                      width: `${firstColWidth}px`,
                                      minWidth: `${firstColWidth}px`,
                                    }
                                  : {}
                              }
                            >
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-3 px-4 py-3 border-t bg-gray-50 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>
                  Page <span className="font-medium">{pageIndex + 1}</span> of{" "}
                  <span className="font-medium">{pageOptions.length || 1}</span>
                </span>
                <span className="hidden sm:inline">
                  ({stocks.length} total records)
                </span>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <select
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                >
                  {[10, 25, 50].map((size) => (
                    <option key={size} value={size} className="cursor-pointer">
                      Show {size}
                    </option>
                  ))}
                </select>
                <div className="flex items-center justify-center gap-1">
                  <button
                    className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-2 py-1 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-1">
                    {pageNumbers.map((item, index) =>
                      typeof item === "number" ? (
                        <button
                          key={`page-${item}`}
                          onClick={() => gotoPage(item)}
                          className={`min-w-[2.25rem] rounded-md px-2 py-1 text-sm font-medium transition cursor-pointer cursor-pointer ${
                            pageIndex === item
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {item + 1}
                        </button>
                      ) : (
                        <span
                          key={`${item}-${index}`}
                          className="px-2 text-sm text-gray-400"
                        >
                          &hellip;
                        </span>
                      )
                    )}
                  </div>
                  <button
                    className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-2 py-1 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      ) : isLoading ? (
        <PieChartsSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pieCharts.map((chart) => (
            <div
              key={chart.title}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                {chart.title}
              </h3>
              <PieChart
                style={{
                  width: "100%",
                  height: "100%",
                  maxWidth: "500px",
                  maxHeight: "80vh",
                  aspectRatio: 1,
                  bottom: "50px",
                }}
                responsive
              >
                <Pie
                  data={chart.data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius={100}
                  outerRadius={150}
                  fill={chart.fill}
                  dataKey="value"
                  //   label={chart.label}
                >
                  {chart.data?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={chart.tooltipFormatter} />
                <Legend
                  wrapperStyle={{ width: "100%", marginBottom: 30 }}
                  iconType="circle"
                />
              </PieChart>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockDashboard;
