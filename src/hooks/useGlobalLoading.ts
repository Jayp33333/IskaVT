import useWorld from "./useWorld";

export const useGlobalLoading = () => {
  const setLoading = useWorld((s: any) => s.setLoading);

  const withLoading = async (
    fn: () => Promise<void>,
    message = "Loading…"
  ) => {
    setLoading(true, message);
    try {
      await fn();
    } finally {
      setLoading(false);
    }
  };

  return { setLoading, withLoading };
};
