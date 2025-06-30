import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function LOS5ReturnLayers() {
  const [inflation, setInflation] = useState(2.1);
  const [taxRate, setTaxRate] = useState(20);
  const [borrowingCost, setBorrowingCost] = useState(4);
  const [percentDebt, setPercentDebt] = useState(20);

  const [assets, setAssets] = useState([
    { name: "Equities", grossReturn: 8.0, expenses: 0.5 },
    { name: "Corporate Bonds", grossReturn: 6.5, expenses: 0.3 },
    { name: "Treasury Bills", grossReturn: 2.5, expenses: 0.0 },
  ]);

  const handleAssetChange = (index, field, value) => {
    const updated = [...assets];
    updated[index][field] = +value;
    setAssets(updated);
  };

  const calculateReturns = (asset) => {
    const e = asset.expenses / 100;
    const g = asset.grossReturn / 100;
    const d = percentDebt / 100;
    const bc = borrowingCost / 100;
    const t = taxRate / 100;
    const inf = inflation / 100;

    const leveragedGross = g + d * (g - bc);
    const leveragedNet = leveragedGross - e;
    const afterTax = leveragedNet * (1 - t);
    const afterTaxReal = afterTax - inf;
    const unleveragedNet = (g - e) * (1 - t);
    const riskFree = assets[2].grossReturn / 100;
    const riskPremium = unleveragedNet - riskFree * (1 - t);

    return {
      leveragedGross: leveragedGross * 100,
      leveragedNet: leveragedNet * 100,
      afterTax: afterTax * 100,
      afterTaxReal: afterTaxReal * 100,
      unleveragedNet: unleveragedNet * 100,
      riskPremium: riskPremium * 100,
      expensesImpact: e * 100,
      taxImpact: (leveragedNet - afterTax) * 100,
      inflationImpact: inf * 100,
    };
  };

  const chartData = assets.map((asset) => {
    const r = calculateReturns(asset);
    return {
      name: asset.name,
      "Leveraged Gross": r.leveragedGross,
      "Leveraged Net": r.leveragedNet,
      "After-Tax": r.afterTax,
      "After-Tax Real": r.afterTaxReal,
      "Unleveraged Net": r.unleveragedNet,
      "Risk Premium": r.riskPremium,
      "Expenses": r.expensesImpact,
    };
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-serif text-[#06005A] mb-4">Return Layer Breakdown (LOS 5)</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Asset Class Inputs</h2>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-2">Asset</th>
              <th className="text-left p-2">Gross Return (%)</th>
              <th className="text-left p-2">Expenses (%)</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, i) => (
              <tr key={asset.name} className="border-t">
                <td className="p-2">{asset.name}</td>
                <td className="p-2">
                  <input type="number" value={asset.grossReturn} onChange={e => handleAssetChange(i, 'grossReturn', e.target.value)} className="w-full border rounded p-1" />
                </td>
                <td className="p-2">
                  <input type="number" value={asset.expenses} onChange={e => handleAssetChange(i, 'expenses', e.target.value)} className="w-full border rounded p-1" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label>Inflation (%)</label>
          <input type="number" value={inflation} onChange={e => setInflation(+e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label>Tax Rate (%)</label>
          <input type="number" value={taxRate} onChange={e => setTaxRate(+e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label>Borrowing Cost (%)</label>
          <input type="number" value={borrowingCost} onChange={e => setBorrowingCost(+e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label>Percent Debt (%)</label>
          <input type="number" value={percentDebt} onChange={e => setPercentDebt(+e.target.value)} className="w-full border p-2 rounded" />
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-2">Return Breakdown Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
            <Legend />
            <Bar dataKey="Leveraged Gross" fill="#C7D2FE" />
            <Bar dataKey="Leveraged Net" fill="#A5B4FC" />
            <Bar dataKey="After-Tax" fill="#93C5FD" />
            <Bar dataKey="After-Tax Real" fill="#60A5FA" />
            <Bar dataKey="Unleveraged Net" fill="#3B82F6" />
            <Bar dataKey="Risk Premium" fill="#2563EB" />
            <Bar dataKey="Expenses" fill="#1D4ED8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-2">Return Calculations</h2>
        <table className="w-full table-auto border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Asset</th>
              <th className="p-2">Leveraged Gross</th>
              <th className="p-2">Leveraged Net</th>
              <th className="p-2">After-Tax</th>
              <th className="p-2">After-Tax Real</th>
              <th className="p-2">Unleveraged Net</th>
              <th className="p-2">Risk Premium</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => {
              const r = calculateReturns(asset);
              return (
                <tr key={asset.name} className="border-t">
                  <td className="p-2 font-medium">{asset.name}</td>
                  <td className="p-2">{r.leveragedGross.toFixed(2)}%</td>
                  <td className="p-2">{r.leveragedNet.toFixed(2)}%</td>
                  <td className="p-2">{r.afterTax.toFixed(2)}%</td>
                  <td className="p-2">{r.afterTaxReal.toFixed(2)}%</td>
                  <td className="p-2">{r.unleveragedNet.toFixed(2)}%</td>
                  <td className="p-2">{r.riskPremium.toFixed(2)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
