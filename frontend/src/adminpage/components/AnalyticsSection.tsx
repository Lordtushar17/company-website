import React from "react";

// Dummy analytics data
const analytics = {
  totalVisitors: 1245,
  productClicks: [
    { product: "Coolant Conditioning System", clicks: 420 },
    { product: "Hydraulic Power Pack", clicks: 310 },
    { product: "Other Accessories", clicks: 150 },
  ],
  dailyVisits: [
    { day: "Mon", visits: 180 },
    { day: "Tue", visits: 210 },
    { day: "Wed", visits: 165 },
    { day: "Thu", visits: 250 },
    { day: "Fri", visits: 190 },
  ],
};

export default function AnalyticsSection() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4">Site Analytics (Dummy Data)</h2>

      <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
        <span className="text-lg font-semibold">Total Visitors</span>
        <span className="text-3xl font-bold text-blue-600">
          {analytics.totalVisitors}
        </span>
      </div>

      {/* Product Clicks */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-3">Most Clicked Products</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-1">Product</th>
              <th className="text-right py-1">Clicks</th>
            </tr>
          </thead>
          <tbody>
            {analytics.productClicks.map((p, i) => (
              <tr key={i} className="border-b last:border-none">
                <td className="py-1">{p.product}</td>
                <td className="text-right py-1 font-medium">{p.clicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Daily Visits */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-3">Visits This Week</h3>
        <div className="grid grid-cols-5 gap-4 text-center">
          {analytics.dailyVisits.map((d, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="bg-blue-500 text-white rounded-md w-10 h-10 flex items-center justify-center mb-1">
                {d.visits}
              </div>
              <span className="text-sm">{d.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
