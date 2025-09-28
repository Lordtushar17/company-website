const API_BASE = process.env.REACT_APP_API_BASE || "";

type PresignResponse = {
  upload: { url: string; fields: Record<string, string> };
  key: string;
};

export async function presignUpload(params: {
  productId: string;
  filename: string;
  contentType: string;
}): Promise<PresignResponse> {
  const res = await fetch(`${API_BASE}/upload/presign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function uploadToS3Presigned(
  url: string,
  fields: Record<string, string>,
  file: File
) {
  const form = new FormData();
  Object.entries(fields).forEach(([k, v]) => form.append(k, v));
  form.append("file", file);
  const res = await fetch(url, { method: "POST", body: form });
  if (!res.ok) throw new Error(`S3 upload failed: ${res.status} ${res.statusText}`);
}
