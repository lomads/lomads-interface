import { SupportedLocale } from 'constants/locales'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { stringify } from 'qs'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export function useLocationLinkProps(locale: SupportedLocale | null): {
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