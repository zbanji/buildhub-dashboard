import * as React from "react"
import type { ToastActionElement, ToastProps } from "@/components/ui/toast"
import { 
  listeners, 
  memoryState, 
  dispatch 
} from "./use-toast-state"

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

type Toast = Partial<ToasterToast> & {
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: "default" | "destructive"
}

const TOAST_TIMEOUT = 60000; // 1 minute in milliseconds

export function useToast() {
  const [state, setState] = React.useState(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  const toast = React.useCallback(
    ({ ...props }: Toast) => {
      const id = Math.random().toString(36).substring(2, 9);
      dispatch({
        type: "ADD_TOAST",
        toast: {
          ...props,
          id,
          open: true,
        },
      });

      // Auto dismiss after TOAST_TIMEOUT
      setTimeout(() => {
        dispatch({ type: "DISMISS_TOAST", toastId: id });
      }, TOAST_TIMEOUT);

      return {
        id,
        dismiss: () => dispatch({ type: "DISMISS_TOAST", toastId: id }),
        update: (props: ToasterToast) =>
          dispatch({
            type: "UPDATE_TOAST",
            toast: { ...props, id },
          }),
      };
    },
    []
  );

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { toast }
export type { Toast }