export type StatusDomain =
  | "enrollment"
  | "course"
  | "submission"
  | "attendance"
  | "user"
  | "schedule";

export interface StatusStyle {
  bg: string;
  text: string;
  label: string;
}

export const STATUS_STYLES: Record<string, StatusStyle> = {
  "enrollment:pending": { bg: "#FEF0C7", text: "#B54708", label: "Menunggu Persetujuan" },
  "enrollment:approved": { bg: "#E7F0FE", text: "#0857D6", label: "Disetujui" },
  "enrollment:active": { bg: "#DCFCE7", text: "#15803D", label: "Aktif" },
  "enrollment:completed": { bg: "#EDE9FE", text: "#6D28D9", label: "Selesai" },
  "enrollment:dropped": { bg: "#F1F5F9", text: "#475569", label: "Berhenti" },

  "course:draft": { bg: "#F1F5F9", text: "#475569", label: "Draf" },
  "course:active": { bg: "#DCFCE7", text: "#15803D", label: "Aktif" },
  "course:archived": { bg: "#F1F5F9", text: "#475569", label: "Diarsipkan" },

  "submission:belum": { bg: "#F1F5F9", text: "#475569", label: "Belum Dikumpulkan" },
  "submission:menunggu_nilai": { bg: "#FEF0C7", text: "#B54708", label: "Menunggu Nilai" },
  "submission:dinilai": { bg: "#DCFCE7", text: "#15803D", label: "Sudah Dinilai" },

  "attendance:hadir": { bg: "#DCFCE7", text: "#15803D", label: "Hadir" },
  "attendance:izin": { bg: "#FEF0C7", text: "#B54708", label: "Izin" },
  "attendance:alpha": { bg: "#FEE4E2", text: "#B42318", label: "Alpha" },

  "user:active": { bg: "#DCFCE7", text: "#15803D", label: "Aktif" },
  "user:inactive": { bg: "#FEE4E2", text: "#B42318", label: "Nonaktif" },
  "user:suspended": { bg: "#FEE4E2", text: "#B42318", label: "Nonaktif" },

  "schedule:session": { bg: "#E7F0FE", text: "#0857D6", label: "Sesi" },
  "schedule:deadline": { bg: "#FEF0C7", text: "#B54708", label: "Tenggat" },
};

export function getStatusStyle(domain: StatusDomain, value: string): StatusStyle {
  return (
    STATUS_STYLES[`${domain}:${value}`] ?? {
      bg: "#F1F5F9",
      text: "#475569",
      label: value,
    }
  );
}
