import { useQuery } from "@tanstack/react-query";
import { getProjects } from "./getProjects";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
}
