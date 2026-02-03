import { BillOfLadingForm } from "@/components/agent/BillOfLadingForm";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface BOLDocumentWrapperProps {
  typedName: string;
  onTypedNameChange: (name: string) => void;
  isSubmitted?: boolean;
  onSubmit?: () => void;
}

export function BOLDocumentWrapper({ 
  typedName, 
  onTypedNameChange,
  isSubmitted = false,
  onSubmit,
}: BOLDocumentWrapperProps) {
  return (
    <div className="bg-white rounded-lg border border-border shadow-xl">
      <div className="p-6">
        <BillOfLadingForm />
      </div>
      
      {/* Footer with Submit button - no continue since BOL is last */}
      <div className="px-10 pb-6 flex items-center justify-end gap-2 border-t border-muted pt-4 mx-6">
        {!isSubmitted ? (
          <Button onClick={onSubmit} className="gap-2">
            <Check className="h-4 w-4" />
            Submit Bill of Lading
          </Button>
        ) : (
          <div className="flex items-center gap-2 text-sm text-primary font-medium">
            <Check className="h-4 w-4" />
            All Documents Submitted
          </div>
        )}
      </div>
    </div>
  );
}
