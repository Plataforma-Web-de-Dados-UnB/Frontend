import React from "react";

interface PageHeaderCardProps {
  title: string;
  description: string;
}

export const PageHeaderCard: React.FC<PageHeaderCardProps> = ({
  title,
  description,
}): React.JSX.Element => {
  return (
    <div className="relative overflow-hidden rounded bg-gradient-to-r from-azul-unb/90 to-azul-unb p-6 text-white shadow-md">
      <div className="relative z-10 w-full">
        <h1 className="text-2xl font-black tracking-tight">{title}</h1>
        <p className="mt-2 text-white/80 text-sm w-full font-medium">
          {description}
        </p>
      </div>
      <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
    </div>
  );
};
