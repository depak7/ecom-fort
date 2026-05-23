"use client"

import React, { createContext, useCallback, useContext, useEffect, useState } from "react"

const STORAGE_KEY = "ecom-fort:selectedCity"

type LocationContextValue = {
  selectedCity: string | null
  setSelectedCity: (city: string | null) => void
  isHydrated: boolean
}

const LocationContext = createContext<LocationContextValue | undefined>(undefined)

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [selectedCity, setSelectedCityState] = useState<string | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setSelectedCityState(stored)
      }
    } catch {
      // ignore localStorage errors
    }
    setIsHydrated(true)
  }, [])

  const setSelectedCity = useCallback((city: string | null) => {
    setSelectedCityState(city)
    try {
      if (city) {
        localStorage.setItem(STORAGE_KEY, city)
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // ignore localStorage errors
    }
  }, [])

  return (
    <LocationContext.Provider value={{ selectedCity, setSelectedCity, isHydrated }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error("useLocation must be used within LocationProvider")
  }
  return context
}
