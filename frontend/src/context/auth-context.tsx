"use client"

import * as React from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { authService } from "@/services/api"
import type { User } from "@/types"

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  refresh: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: authService.me,
    staleTime: 5 * 60 * 1000,
  })

  const user = data?.user ?? null

  const refresh = React.useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["session"] })
  }, [queryClient])

  const logout = React.useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      await queryClient.invalidateQueries({ queryKey: ["session"] })
    }
  }, [queryClient])

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      refresh,
      logout,
    }),
    [user, isLoading, refresh, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
