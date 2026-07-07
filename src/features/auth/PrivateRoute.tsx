import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";
import { ROUTES } from "@/utils/constants";

type Props = {
  children?: React.ReactNode;
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
};

export const PrivateRoute = ({
  children,
  requireAdmin = false,
  requireSuperAdmin = false,
}: Props) => {
  const { isAuthenticated, isAdmin, isSuperAdmin } = useAuth();

  if (!isAuthenticated) return <Navigate to={ROUTES.login} replace />;
  if (requireSuperAdmin && !isSuperAdmin)
    return <Navigate to={ROUTES.home} replace />;
  if (requireAdmin && !isAdmin) return <Navigate to={ROUTES.home} replace />;

  return children ? <>{children}</> : <Outlet />;
};
