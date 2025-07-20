import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // For now, allow access even if auth fails to let users see the app features
  const isAuthenticated = true; // Temporarily allowing all access for demo
  const isPremium = user?.isPremium || true; // Grant premium features for demo

  return {
    user: user || {
      id: 'demo',
      username: 'demo',
      firstName: 'Demo',
      lastName: 'User',
      isPremium: true,
      dailyUsageLimit: 1000,
      apiUsageCount: 0,
      extensionInstalled: true,
    },
    isLoading: false,
    isAuthenticated,
    isPremium,
  };
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.clear();
      window.location.href = "/";
    },
  });
}