import { useEffect, useState } from 'react'
import { breakpointMap } from '../theme/base'

interface State {
  [key: string]: boolean
}

interface MediaQueries {
  [key: string]: string
}

/**
 * Can't use the media queries from "base.mediaQueries" because of how matchMedia works
 * In order for the listener to trigger we need have have the media query with a range, e.g.
 * (min-width: 370px) and (max-width: 576px)
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList
 */
const mediaQueries: MediaQueries = (() => {
  let prevMinWidth = 0

  return Object.keys(breakpointMap).reduce((accum, size, index) => {
    // Largest size is just a min-width of second highest max-width
    if (index === Object.keys(breakpointMap).length - 1) {
      return { ...accum, [size]: `(min-width: ${prevMinWidth}px)` }
    }

    const minWidth = prevMinWidth
    const breakpoint = breakpointMap[size]

    // Min width for next iteration
    prevMinWidth = breakpoint + 1

    return { ...accum, [size]: `(min-width: ${minWidth}px) and (max-width: ${breakpoint}px)` }
  }, {})
})()

const getKey = (size: string): string => {
  return `is${size.charAt(0).toUpperCase()}${size.slice(1)}`
}

const useMatchBreakpoints = (): State => {
  const [state, setState] = useState<State>(() => {
    return Object.keys(mediaQueries).reduce((accum, size) => {
      const key = getKey(size)
      const mql = window.matchMedia(mediaQueries[size])
      return { ...accum, [key]: mql.matches }
    }, {})
  })

  useEffect(() => {
    // Create listeners for each media query returning a function to unsubscribe
    const handlers = Object.keys(mediaQueries).map((size) => {
      const mql = window.matchMedia(mediaQueries[size])

      const handler = (matchMediaQuery: MediaQueryListEvent): void => {
        const key = getKey(size)
        setState((prevState: any) => ({
          ...prevState,
          [key]: matchMediaQuery.matches
        }))
      }

      // Safari < 14 fix
      if (mql.addEventListener != null) {
        mql.addEventListener('change', handler)
      }

      return () => {
        // Safari < 14 fix
        if (mql.removeEventListener != null) {
          mql.removeEventListener('change', handler)
        }
      }
    })

    return () => {
      handlers.forEach((unsubscribe) => {
        unsubscribe()
      })
    }
  }, [setState])

  return state
}

export default useMatchBreakpoints
