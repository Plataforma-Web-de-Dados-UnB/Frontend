import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  to?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export const Breadcrumb = ({ items }: BreadcrumbProps) => (
  <nav
    aria-label="Breadcrumb"
    className="flex flex-wrap items-center gap-1.5 text-base text-texto-secundario select-none"
  >
    <Link
      to="/"
      className="flex items-center gap-1.5 hover:text-destaque transition-colors shrink-0"
      title="Página Inicial"
    >
      <Home className="h-4 w-4" />
      <span className="hidden sm:inline">Página Inicial</span>
    </Link>

    {items.map((item, i) => {
      const isLast = i === items.length - 1;
      return (
        <span key={i} className="flex items-center gap-1.5 min-w-0 max-w-full">
          <ChevronRight className="h-4 w-4 shrink-0 text-texto-secundario/50" />
          {isLast || !item.to ? (
            <span
              className={`truncate ${isLast ? "font-semibold text-texto-principal" : ""}`}
              title={item.label}
            >
              {item.label}
            </span>
          ) : (
            <Link
              to={item.to}
              className="truncate hover:text-destaque transition-colors"
              title={item.label}
            >
              {item.label}
            </Link>
          )}
        </span>
      );
    })}
  </nav>
);
