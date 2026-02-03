import { CCACHAuthorizationForm } from "@/components/agent/CCACHAuthorizationForm";

interface CCACHDocumentWrapperProps {
  typedName: string;
  onTypedNameChange: (name: string) => void;
}

export function CCACHDocumentWrapper({ typedName, onTypedNameChange }: CCACHDocumentWrapperProps) {
  // The CCACHAuthorizationForm manages its own state, but we pass in name sync
  return (
    <div className="bg-white rounded-lg border border-border shadow-xl">
      <CCACHAuthorizationForm 
        externalTypedName={typedName}
        onExternalTypedNameChange={onTypedNameChange}
      />
    </div>
  );
}
