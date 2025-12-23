import { useCallback, useEffect, useRef } from 'react';

type DebouncedFunction<T extends (...args: any[]) => void> = (
    ...args: Parameters<T>
) => void;

/**
 * Custom hook that returns a debounced version of the provided callback function.
 * 
 * @param fn - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns A debounced version of the function
 */
export function useDebounce<T extends (...args: any[]) => void>(
    fn: T,
    delay: number
): DebouncedFunction<T> {
    const timerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerIdRef.current) {
                clearTimeout(timerIdRef.current);
            }
        };
    }, []);

    const debouncedFn = useCallback(
        (...args: Parameters<T>) => {
            if (timerIdRef.current) {
                clearTimeout(timerIdRef.current);
            }

            timerIdRef.current = setTimeout(() => {
                fn(...args);
            }, delay);
        },
        [fn, delay]
    );

    return debouncedFn;
}
