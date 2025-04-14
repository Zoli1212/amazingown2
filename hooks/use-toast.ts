"use client"

import { toast as sonnerToast } from "sonner"

interface ToastProps {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
  action?: React.ReactNode
}

export function toast(props: ToastProps = {}) {
  const { title, description, variant = 'default', action } = props

  if (variant === 'destructive') {
    sonnerToast.error(description || '', {
      action
    })
  } else {
    sonnerToast(description || '', {
      action
    })
  }
}

export function useToast() {
  return {
    toast
  }
}
