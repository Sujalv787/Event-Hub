type AlertVariant = "error" | "success" | "warning";

interface AlertProps {
  variant?: AlertVariant;
  message: string;
}

const variantClasses: Record<AlertVariant, string> = {
  error: "bg-red-50 text-red-700 border-red-200",
  success: "bg-green-50 text-green-700 border-green-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
};

export function Alert({ variant = "error", message }: AlertProps) {
  return (
    <div className={`rounded-md border px-4 py-3 text-sm ${variantClasses[variant]}`}>
      {message}
    </div>
  );
}
