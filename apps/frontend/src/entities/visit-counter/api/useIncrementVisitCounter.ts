import { useMutation } from "@tanstack/react-query";
import { incrementVisitCounter } from "./incrementVisitCounter";

export function useIncrementVisitCounter() {
  return useMutation({
    mutationFn: incrementVisitCounter,
  });
}
