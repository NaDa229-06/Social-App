import { FiBookmark, FiFileText, FiGlobe, FiZap } from "react-icons/fi";

export type FeedTab = "feed" | "mine" | "community" | "saved";

const items = [
  { key: "feed", label: "Feed", icon: FiFileText },
  { key: "mine", label: "My Posts", icon: FiZap },
  { key: "community", label: "Community", icon: FiGlobe },
  { key: "saved", label: "Saved", icon: FiBookmark },
] as const;

interface FeedSidebarProps {
  active: FeedTab;
  onChange: (tab: FeedTab) => void;
}

export default function FeedSidebar({ active, onChange }: FeedSidebarProps) {
  return (
    <nav className="flex flex-col gap-1 rounded-2xl bg-white p-3 shadow-md">
      {items.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold ${
            active === key
              ? "bg-blue-50 text-blue-600"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Icon size={20} />
          {label}
        </button>
      ))}
    </nav>
  );
}