import { getStatusStyle, type StatusDomain } from "@/lib/status";

export function StatusBadge({
  domain,
  value,
}: {
  domain: StatusDomain;
  value: string;
}) {
  const style = getStatusStyle(domain, value);
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {style.label}
    </span>
  );
}
