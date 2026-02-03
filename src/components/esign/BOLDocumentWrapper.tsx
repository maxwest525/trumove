import { BillOfLadingForm } from "@/components/agent/BillOfLadingForm";

interface BOLDocumentWrapperProps {
  typedName: string;
  onTypedNameChange: (name: string) => void;
}

export function BOLDocumentWrapper({ typedName, onTypedNameChange }: BOLDocumentWrapperProps) {
  return (
    <div className="bg-white rounded-lg border border-border shadow-xl">
      <div className="p-6">
        <BillOfLadingForm />
      </div>
    </div>
  );
}
