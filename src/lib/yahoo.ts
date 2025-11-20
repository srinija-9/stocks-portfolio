export async function getYahooCMP() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_APP_RAPID_API_KEY;
    const apiHost = "yahoo-finance15.p.rapidapi.com";

    if (!apiKey) {
      throw new Error(
        "NEXT_PUBLIC_APP_RAPID_API_KEY is not set in environment variables."
      );
    }

    const url = `https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/quotes?ticker=HDB%2CBAJFINANCE.NS%2CIBN.BA%2CBAJAJHFL.NS%2CSAVFI.BO%2CAFFLE.NS%2CLTIM.BO%2CKPITTECH.BO%2CTATATECH.NS%2CBLSE.NS%2CTANLA.NS%2CDMART.NS%2CTATACONSUM.NS%2CPIDILITIND.NS%2CTATAPOWER.NS%2CKPIGREEN.NS%2CSUZLON.NS%2CGENSOL.NS%2CHARIOMPIPE.NS%2CASTRAL.NS%2CPOLYCAB.NS%2CCLEAN.NS%2CDEEPAKNTR.NS%2CFINEORG.NS%2CGRAVITA.NS%2CSBILIFE.NS`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": apiHost,
      },
    });
    const json = await res.json();
    const data = json.body;
    return data.map((stockData) => ({
      exchange: stockData.exchange || "",
      trailingPE: stockData.trailingPE || 0,
      epsTrailingTwelveMonths: stockData.epsTrailingTwelveMonths || 0,
      cmp: stockData.regularMarketPrice || 0,
      change: stockData.regularMarketChange || 0,
      changePercent: stockData.regularMarketChangePercent || 0,
      ticker: stockData.symbol || "",
    }));
  } catch (err) {
    console.log(err);
    return { cmp: 0, change: 0, changePercent: 0 };
  }
}
