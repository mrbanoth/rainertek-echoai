import { Shield, UserRound } from 'lucide-react';

export function AdminAvatar({ size = 36 }: { size?: number }) {
  const icon = Math.max(14, Math.round(size * 0.52));
  const badge = Math.max(14, Math.round(size * 0.46));

  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <UserRound size={icon} strokeWidth={2.25} />
      <span
        className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full bg-white text-blue-700"
        style={{ width: badge, height: badge }}
      >
        <Shield size={Math.max(8, badge - 6)} strokeWidth={2.5} />
      </span>
    </span>
  );
}
