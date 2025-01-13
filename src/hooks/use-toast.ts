import * as React from "react"
import type { ToasterToast } from "@/components/ui/toast"
import { 
  listeners, 
  memoryState, 
  toast, 
  dispatch 
} from "./use-toast-state"

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

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { toast }