import useParsedQueryString from 'hooks/useParsedQueryString'
import { stringify } from 'qs'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export function useLocationLinkProps(locale: any | null): {
  to?: any
  onClick?: () => void
} {
  const location = useLocation()
  const qs = useParsedQueryString()

  return useMemo(
    () =>
      !locale
        ? {}
        : {
            to: {
              ...location,
              search: stringify({ ...qs, lng: locale }),
            },
          },
    [location, qs, locale]
  )
}