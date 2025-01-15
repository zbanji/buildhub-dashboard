import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";

interface AuthMessageProps {
  message: string | null;
  variant?: "default" | "destructive";
}

export function AuthMessage({ message, variant = "default" }: AuthMessageProps) {
  if (!message) return null;
  
  return (
    <Alert variant={variant} className="mb-4 animate-fade-in">
      <div className="flex items-center gap-2">
        {variant === "destructive" ? (
          <XCircle className="h-4 w-4" />
        ) : (
          <CheckCircle2 className="h-4 w-4" />
        )}
        <AlertDescription>{message}</AlertDescription>
      </div>
    </Alert>
  );
}