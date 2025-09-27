import React from "react";

const logs = [
  {
    time: "2025-09-27 11:15",
    productid: "p-001",
    action: "update",
    user: "admin",
    details: "shortDesc changed",
  },
  {
    time: "2025-09-27 10:42",
    productid: "p-002",
    action: "create",
    user: "admin",
    details: "new product added",
  },
  {
    time: "2025-09-26 18:20",
    productid: "p-001",
    action: "delete image",
    user: "admin",
    details: "removed old diagram",
  },
];

export default function LogsSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Product Update Logs (Dummy)</h2>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2">Time</th>
              <th className="text-left p-2">Product ID</th>
              <th className="text-left p-2">Action</th>
              <th className="text-left p-2">User</th>
              <th className="text-left p-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} className="border-b last:border-none">
                <td className="p-2">{log.time}</td>
                <td className="p-2">{log.productid}</td>
                <td className="p-2 capitalize">{log.action}</td>
                <td className="p-2">{log.user}</td>
                <td className="p-2">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
