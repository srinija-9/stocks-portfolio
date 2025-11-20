export async function getGooglePE(symbol: string) {
  try {
    const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=NCFMEAGBTP4U8VY2`;
    const res = await fetch(url);
    console.log(res.body, "ppopopopo");
    const json = await res.json();
    console.log(json, "pppopopopo");
    const response = json.body;
    console.log(response, "popopopo");
    return {
      pe: response.PERatio,
      earnings: response.EPS,
    };
  } catch (err) {
    console.log(err);
    return { pe: null, earnings: null };
  }
}
