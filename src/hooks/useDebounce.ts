import { useState, useEffect } from "react";

interface UseDebounceProps<T> {
    value: T;
    delay: number;
}

const useDebounce = <T>({ value, delay }: UseDebounceProps<T>): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export default useDebounce;