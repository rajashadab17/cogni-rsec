"use client";

import { toast as sonnerToast } from "sonner";
import { CheckCircle, AlertCircle, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type ToastVariant = "success" | "error" | "warning";

interface CustomToastProps {
  title: string;
  description?: string;
  variant?: ToastVariant;
  onDismiss: () => void;
}

const variantStyles = {
  success: {
    container:
      "bg-green-200 border-green-500 dark:bg-green-800 dark:border-green-600",
    icon: (
      <CheckCircle className="h-5 w-5 text-green-700 dark:text-green-300" />
    ),
    title: "text-green-900 dark:text-green-100",
    description: "text-green-800 dark:text-green-200",
    closeButton:
      "text-green-700 hover:bg-green-300 dark:text-green-300 dark:hover:bg-green-700",
  },
  error: {
    container: "bg-red-200 border-red-500 dark:bg-red-800 dark:border-red-600",
    icon: <AlertCircle className="h-5 w-5 text-red-700 dark:text-red-300" />,
    title: "text-red-900 dark:text-red-100",
    description: "text-red-800 dark:text-red-200",
    closeButton:
      "text-red-700 hover:bg-red-300 dark:text-red-300 dark:hover:bg-red-700",
  },
  warning: {
    container:
      "bg-amber-200 border-amber-500 dark:bg-amber-800 dark:border-amber-600",
    icon: (
      <AlertTriangle className="h-5 w-5 text-amber-700 dark:text-amber-300" />
    ),
    title: "text-amber-900 dark:text-amber-100",
    description: "text-amber-800 dark:text-amber-200",
    closeButton:
      "text-amber-700 hover:bg-amber-300 dark:text-amber-300 dark:hover:bg-amber-700",
  },
} as const;

const CustomToastContent = ({
  title,
  description,
  variant = "success",
  onDismiss,
}: CustomToastProps): ReactNode => {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "flex w-full max-w-md items-start gap-3 rounded-lg border p-4 shadow-lg",
        "animate-in slide-in-from-right-5 duration-300",
        styles.container
      )}
    >
      <div className="flex-shrink-0">{styles.icon}</div>
      <div className="flex-1">
        <h3 className={cn("font-medium text-sm", styles.title)}>{title}</h3>
        {description && (
          <p className={cn("mt-1 text-xs", styles.description)}>
            {description}
          </p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className={cn(
          "flex-shrink-0 rounded-full p-1 transition-colors",
          styles.closeButton
        )}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

interface ToastProps {
  title: string;
  description?: string;
  duration?: number;
}

export const toast = {
  success: (props: ToastProps) => {
    sonnerToast.custom(
      (id) => (
        <CustomToastContent
          {...props}
          variant="success"
          onDismiss={() => sonnerToast.dismiss(id)}
        />
      ),
      {
        duration: props.duration || 5000,
      }
    );
  },

  error: (props: ToastProps) => {
    sonnerToast.custom(
      (id) => (
        <CustomToastContent
          {...props}
          variant="error"
          onDismiss={() => sonnerToast.dismiss(id)}
        />
      ),
      {
        duration: props.duration || 5000,
      }
    );
  },

  warning: (props: ToastProps) => {
    sonnerToast.custom(
      (id) => (
        <CustomToastContent
          {...props}
          variant="warning"
          onDismiss={() => sonnerToast.dismiss(id)}
        />
      ),
      {
        duration: props.duration || 5000,
      }
    );
  },
};
