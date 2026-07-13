import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { GlobalRequestIndicator } from "@/components/ui/GlobalRequestIndicator";
import { AccessibilityPanel } from "./AccessibilityPanel";
import { AccessibilityDrawerProvider } from "@/features/accessibility/AccessibilityDrawerProvider";

export const PublicLayout = () => (
  <AccessibilityDrawerProvider>
    <div className="flex min-h-screen flex-col bg-fundo-pagina text-texto-principal">
      <GlobalRequestIndicator />
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <AccessibilityPanel />
    </div>
  </AccessibilityDrawerProvider>
);
