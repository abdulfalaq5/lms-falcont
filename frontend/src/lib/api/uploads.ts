import { API_URL, ApiError } from "@/lib/api";

export interface UploadResult {
  url: string;
  originalName: string;
}

export async function uploadFile(file: File): Promise<UploadResult> {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("lms_access_token") : null;
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/uploads`, {
    method: "POST",
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    body: formData,
  });

  if (!res.ok) {
    throw new ApiError(res.status, "Gagal mengunggah berkas.");
  }
  return res.json();
}
