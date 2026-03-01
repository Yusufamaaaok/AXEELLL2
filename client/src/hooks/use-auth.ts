import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, error, refetch } = useQuery<User | null>({
    queryKey: [api.auth.user.path],
    queryFn: async () => {
      const res = await fetch(api.auth.user.path, { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      return api.auth.user.responses[200].parse(await res.json());
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 mins
  });

  const logout = () => {
    window.location.href = "/api/logout";
  };

  const login = () => {
    window.location.href = "/api/login";
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    logout,
    login,
    refetch,
  };
}
