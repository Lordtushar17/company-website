const API_BASE = process.env.REACT_APP_API_BASE || "";

export type ProductLog = {
  logId: string;
  ts: string;
  productId: string;
  action: string;
  user: string;
  details: string;
  extra?: any;
};

async function handle(resp: Response) {
  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(text || `Request failed with ${resp.status}`);
  }
  return resp.json();
}

export const LogsAPI = {
  // Use the products_info namespace because API Gateway already routes it to your Lambda
  async list(): Promise<ProductLog[]> {
    const r = await fetch(`${API_BASE}/products_info/logs`, { method: "GET" });
    return handle(r);
  },
};
