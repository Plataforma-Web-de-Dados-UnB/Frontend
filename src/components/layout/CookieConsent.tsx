import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { Cookie } from "lucide-react";
import { ROUTES } from "@/utils/constants";

export const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("portal@cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("portal@cookie_consent", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-5xl mx-auto z-[9999] animate-fade-in">
      <div className="bg-fundo-superficie/95 border border-borda-padrao p-5 rounded shadow-lg backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          <div className="flex-shrink-0 text-destaque hidden sm:flex">
            <Cookie className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-texto-principal flex items-center gap-1.5">
              <span className="sm:hidden"><Cookie className="h-4 w-4 text-destaque inline" /></span>
              Uso de Cookies Essenciais e LGPD
            </h4>
            <p className="text-xs text-texto-secundario leading-relaxed max-w-3xl">
              Este portal utiliza cookies estritamente necessários para manter a sua autenticação ativa de forma segura (renovação do token de segurança). Para mais informações, acesse a nossa Política de Privacidade.
            </p>
          </div>
        </div>
        <div className="flex flex-shrink-0 gap-3 w-full md:w-auto justify-end">
          <Button
            component={Link}
            to={ROUTES.politicaPrivacidade}
            variant="text"
            size="small"
            sx={{
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.75rem",
              color: "text.secondary",
            }}
          >
            Política de Privacidade
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={handleAccept}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.75rem",
              px: 3,
            }}
          >
            Aceitar
          </Button>
        </div>
      </div>
    </div>
  );
};
