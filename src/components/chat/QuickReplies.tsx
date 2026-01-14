import { cn } from "@/lib/utils";

interface QuickReply {
  label: string;
  value: string;
}

interface QuickRepliesProps {
  options: QuickReply[];
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export default function QuickReplies({ options, onSelect, disabled = false }: QuickRepliesProps) {
  return (
    <div className="chat-quick-replies">
      {options.map((option, index) => (
        <button
          key={option.value}
          type="button"
          className={cn("chat-quick-btn", disabled && "is-disabled")}
          onClick={() => !disabled && onSelect(option.value)}
          disabled={disabled}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
