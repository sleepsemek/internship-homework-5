export function debounceVoid<DebouncedFunction extends () => void>(func: DebouncedFunction, delay = 500): () => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return () => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func();
    }, delay);
  };
}
