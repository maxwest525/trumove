import { FileText, CreditCard, Receipt, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type DocumentType = "estimate" | "ccach" | "bol";

interface DocumentTabsProps {
  activeDocument: DocumentType;
  onDocumentChange: (doc: DocumentType) => void;
  completedDocuments: Record<DocumentType, boolean>;
}

const documents: { type: DocumentType; label: string; icon: typeof FileText }[] = [
  { type: "estimate", label: "Estimate Authorization", icon: FileText },
  { type: "ccach", label: "CC/ACH Authorization", icon: CreditCard },
  { type: "bol", label: "Bill of Lading", icon: Receipt },
];

export function DocumentTabs({ activeDocument, onDocumentChange, completedDocuments }: DocumentTabsProps) {
  return (
    <div className="space-y-2">
      {documents.map(({ type, label, icon: Icon }) => {
        const isActive = activeDocument === type;
        const isCompleted = completedDocuments[type];

        return (
          <button
            key={type}
            onClick={() => onDocumentChange(type)}
            className={cn(
              "flex items-center gap-3 p-2 rounded border w-full text-left transition-colors",
              isActive
                ? "border-foreground/20 bg-foreground/5"
                : "border-border hover:bg-muted/50"
            )}
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0",
                isActive || isCompleted
                  ? "bg-foreground text-background"
                  : "border border-muted-foreground/40"
              )}
            >
              {isCompleted ? (
                <Check className="h-3 w-3" />
              ) : (
                <span>{documents.findIndex((d) => d.type === type) + 1}</span>
              )}
            </div>
            <div className="flex-1 flex items-center gap-2">
              <Icon
                className={cn(
                  "h-3.5 w-3.5",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
            {isCompleted && <Check className="h-3.5 w-3.5 text-foreground flex-shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}
