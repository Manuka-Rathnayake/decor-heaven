import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const LogoutButton = () => {
  const { logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Success",
        description: "You have been logged out.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout} disabled={loading}>
      Logout
    </Button>
  );
};

export default LogoutButton;