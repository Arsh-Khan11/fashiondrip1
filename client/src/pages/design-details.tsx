import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth";
import DesignDetail from "@/components/designs/design-detail";

const DesignDetailsPage = () => {
  const { checkAuthStatus } = useAuthStore();
  
  // Check authentication status when the page loads
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);
  
  return (
    <main>
      <DesignDetail />
    </main>
  );
};

export default DesignDetailsPage;
