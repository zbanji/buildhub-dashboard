import { Alert, AlertDescription } from "@/components/ui/alert";

interface AuthMessageProps {
  message: string | null;
  variant?: "default" | "destructive";
}

export function AuthMessage({ message, variant = "default" }: AuthMessageProps) {
  if (!message) return null;
  
  return (
    <Alert variant={variant}>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}