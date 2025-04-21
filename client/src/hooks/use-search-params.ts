import { useLocation } from "wouter";
import { useMemo } from "react";

/**
 * Custom hook to work with search parameters in wouter
 * Provides similar functionality to React Router's useSearchParams
 */
export function useSearchParams(): [URLSearchParams, (params: URLSearchParams) => void] {
  const [location, setLocation] = useLocation();
  
  // Parse current search params
  const searchParams = useMemo(() => {
    const url = new URL(window.location.href);
    return url.searchParams;
  }, [location]);
  
  // Function to update search params
  const setSearchParams = (params: URLSearchParams) => {
    const url = new URL(window.location.href);
    url.search = params.toString();
    setLocation(url.pathname + url.search);
  };
  
  return [searchParams, setSearchParams];
}