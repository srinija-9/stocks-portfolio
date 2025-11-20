import { NextResponse } from "next/server";
import holdings from "@/data/holdings.json";

import { getYahooCMP } from "../../../lib/yahoo";
// import { getGooglePE } from "../../../lib/google";

type Holding = (typeof holdings)[number];

export async function buildPortfolio(holdingsData: Holding[]) {
  const yahoo = await getYahooCMP();

  const enriched = await Promise.all(
    holdingsData.map(async (item) => {
      const yahooItem = yahoo.find(
        (stockData) => stockData.ticker === item.ticker
      );

      const investment = item.purchasePrice * item.qty;
      const cmp = yahooItem?.cmp ?? 0;
      const presentValue = cmp * item.qty;
      const gain = cmp - item.purchasePrice;
      const totalGain = presentValue - investment;
      const gainPercent = investment ? (gain / investment) * 100 : 0;
      const totalGainPercent = investment ? (totalGain / investment) * 100 : 0;

      const enrichedHolding = {
        ...item,
        ...(yahooItem ?? {}),
        investment,
        presentValue,
        gain,
        totalGain,
        gainPercent,
        totalGainPercent,
      };

      console.log(enrichedHolding, "holding");
      return enrichedHolding;
    })
  );

  console.log(enriched, "portfolio");
  return enriched;
}

export async function GET() {
  const portfolio = await buildPortfolio(holdings);
  return NextResponse.json(portfolio);
}
