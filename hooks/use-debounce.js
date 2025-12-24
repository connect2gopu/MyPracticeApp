import { useCallback, useEffect, useRef } from "react";

export const useDebounce = (fn, delay) => {
    let timerRef = useRef();
    let fnRef = useRef();

    useEffect(() => {
        return () => {
            if(timerRef.current) {
                clearTimeout(timerRef.current)
            }
        }
    }, [])

    useEffect(() => {
        fnRef.current = fn
    }, [fn])

    const debouncedfn = useCallback((...args) => {
        if(timerRef.current) {
            clearTimeout(timerRef.current)
        }

        timerRef.current = setTimeout(() => {
            fnRef.current(...args)
        }, delay);
    }, [delay])

    return debouncedfn
}