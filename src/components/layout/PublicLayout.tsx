import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { GlobalRequestIndicator } from "@/components/ui/GlobalRequestIndicator";

export const PublicLayout = () => (
  <div className="flex min-h-screen flex-col bg-fundo-pagina text-texto-principal">
    <GlobalRequestIndicator />
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);
