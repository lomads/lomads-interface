import { ParsedQs } from 'qs'
import { useMemo } from 'react'

export function parsedQueryString(search?: string): ParsedQs {
  return {}
}

export default function useParsedQueryString(): ParsedQs {
  return useMemo(() => parsedQueryString(), [])
}