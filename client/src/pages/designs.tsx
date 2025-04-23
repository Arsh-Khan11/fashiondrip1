import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth";
import DesignList from "@/components/designs/design-list";

const Designs = () => {
  const { checkAuthStatus } = useAuthStore();
  
  // Check authentication status when the page loads
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);
  
  return (
    <main className="container mx-auto px-4 py-10">
      <DesignList />
    </main>
  );
};

export default Designs;
