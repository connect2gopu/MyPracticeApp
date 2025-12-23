import { useCallback, useEffect, useRef } from "react";

export const useDebounce = (fn, delay) => {
    let timerRef = useRef();

    useEffect(() => {
        return () => {
            if(timerRef.current) {
                clearTimeout(timerRef.current)
            }
        }
    }, [])

    const debouncedfn = useCallback((...args) => {
        if(timerRef.current) {
            clearTimeout(timerRef.current)
        }

        timerRef.current = setTimeout(() => {
            fn(...args)
        }, delay);
    }, [fn, delay])

    return debouncedfn
}