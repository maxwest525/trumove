import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  placeholder?: string;
  onSend: (value: string) => void;
  disabled?: boolean;
  inputType?: 'text' | 'email' | 'tel';
  autoFocus?: boolean;
}

export default function ChatInput({ 
  placeholder = "Type your answer...", 
  onSend, 
  disabled = false,
  inputType = 'text',
  autoFocus = true
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = () => {
    if (value.trim() && !disabled) {
      onSend(value.trim());
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-input-area">
      <input
        ref={inputRef}
        type={inputType}
        className="chat-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <button
        type="button"
        className={cn("chat-send-btn", value.trim() && "is-active")}
        onClick={handleSubmit}
        disabled={!value.trim() || disabled}
      >
        <Send className="chat-send-icon" />
      </button>
    </div>
  );
}
