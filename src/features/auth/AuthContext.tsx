import { createContext, useState } from "react";
import { api } from "@/services/api";
import type {
  CargoUsuario,
  LoginDto,
  CadastroDto,
  AlterarSenhaDto,
} from "@/types/dtos";

type AuthUser = {
  id: string;
  nome: string;
  ultimoNome: string;
  email: string;
  cargo: CargoUsuario;
  status: string;
  createdAt: string;
};

type AuthContextType = {
  user: AuthUser | null;
  isReady: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (data: LoginDto) => Promise<{ ok: boolean; error?: string }>;
  cadastro: (data: CadastroDto) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  alterarSenha: (
    data: AlterarSenhaDto,
  ) => Promise<{ ok: boolean; error?: string }>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem("portal@user");
    if (!stored) return null;
    try {
      return JSON.parse(stored) as AuthUser;
    } catch {
      localStorage.removeItem("portal@user");
      return null;
    }
  });
  const [isReady] = useState(true);

  const login = async (data: LoginDto) => {
    try {
      const res = await api.post<{
        accessToken: string;
        id: string;
        nome: string;
        ultimoNome: string;
        email: string;
        cargo: CargoUsuario;
      }>("/usuario/login", data);
      localStorage.setItem("portal@access_token", res.data.accessToken);
      const userData: AuthUser = {
        id: res.data.id,
        nome: res.data.nome,
        ultimoNome: res.data.ultimoNome,
        email: res.data.email,
        cargo: res.data.cargo,
        status: "Ativo",
        createdAt: new Date().toISOString(),
      };
      setUser(userData);
      localStorage.setItem("portal@user", JSON.stringify(userData));
      return { ok: true };
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao fazer login.";
      return { ok: false, error: message };
    }
  };

  const cadastro = async (data: CadastroDto) => {
    try {
      await api.post("/usuario/register", data);
      return { ok: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao cadastrar.";
      return { ok: false, error: message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("portal@access_token");
    localStorage.removeItem("portal@refresh_token");
    localStorage.removeItem("portal@user");
  };

  const alterarSenha = async (data: AlterarSenhaDto) => {
    try {
      await api.put("/usuario/senha", {
        senhaAntiga: data.senhaAtual,
        senhaNova: data.novaSenha,
      });
      return { ok: true };
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao alterar senha.";
      return { ok: false, error: message };
    }
  };

  const isAuthenticated = !!user;
  const isAdmin =
    user?.cargo === "Administrador" || user?.cargo === "SuperAdministrador";
  const isSuperAdmin = user?.cargo === "SuperAdministrador";

  return (
    <AuthContext.Provider
      value={{
        user,
        isReady,
        isAuthenticated,
        isAdmin,
        isSuperAdmin,
        login,
        cadastro,
        logout,
        alterarSenha,
      }}
    >
      {isReady ? children : null}
    </AuthContext.Provider>
  );
};

export { AuthContext };
