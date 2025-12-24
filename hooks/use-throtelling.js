import { useCallback, useEffect, useRef } from "react";

/**
 * Custom hook that returns a throttled version of the provided callback function.
 * 
 * @param {Function} fn - The function to throttle
 * @param {number} delay - The delay in milliseconds
 * @param {Object} options - Throttle options
 * @param {boolean} options.leading - Execute on the leading edge (default: true)
 * @param {boolean} options.trailing - Execute on the trailing edge (default: true)
 * @returns {Function} A throttled version of the function
 */
export const useThrottle = (fn, delay, options = { leading: true, trailing: true }) => {
    const shouldWaitRef = useRef(false);
    const waitingArgsRef = useRef(null);
    const timerRef = useRef(null);
    const fnRef = useRef(fn);
    const optionsRef = useRef(options);

    // Keep refs up to date
    useEffect(() => {
        fnRef.current = fn;
        optionsRef.current = options;
    }, [fn, options]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const throttledFn = useCallback(
        (...args) => {
            if (shouldWaitRef.current) {
                waitingArgsRef.current = args;
                return;
            }

            if (optionsRef.current.leading !== false) {
                fnRef.current(...args);
            } else {
                waitingArgsRef.current = args;
            }

            shouldWaitRef.current = true;

            const timerFunc = () => {
                if (waitingArgsRef.current == null) {
                    shouldWaitRef.current = false;
                } else {
                    if (optionsRef.current.trailing !== false) {
                        fnRef.current(...waitingArgsRef.current);
                    }
                    waitingArgsRef.current = null;
                    timerRef.current = setTimeout(timerFunc, delay);
                }
            };

            timerRef.current = setTimeout(timerFunc, delay);
        },
        [delay]
    );

    return throttledFn;
};
