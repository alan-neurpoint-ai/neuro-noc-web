import { BiChip, BiLockAlt, BiWorld } from "react-icons/bi";
import type { SelectOption } from "../../../../core/presentation/components/ui/CustomSelect";
import { Topbar } from "../../../../core/presentation/components/ui/Topbar";

export const LoginPage = () => {
  const getEnvOptionsByRole = (role: string): SelectOption[] => {
    const baseOptions: SelectOption[] = [
      {
        value: "interno",
        label: "Interno",
        icon: <BiLockAlt className="text-red-400" />,
        description: "Red Privada",
      },
    ];

    if (role === "Senior Engineer" || role === "Admin") {
      return [
        ...baseOptions,
        {
          value: "externo",
          label: "Externo",
          icon: <BiWorld className="text-green-400" />,
          description: "Acceso Público",
        },
        {
          value: "ia_core",
          label: "IA Core",
          icon: <BiChip className="text-blue-400" />,
          description: "Módulo Inteligente",
        },
      ];
    }

    return baseOptions;
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e] px-4">
      <div className="max-w-md w-full space-y-8 bg-[#161b2c] p-10 rounded-2xl border border-blue-900/30 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            NEURO NOC
          </h2>
          <p className="mt-2 text-sm text-blue-300/60 font-medium">
            Network Operations Center Management
          </p>
        </div>
      </div>

      <Topbar
        envOptions={getEnvOptionsByRole("Admin")}
        onEnvChange={(v) => console.log(`Cambiando a entorno: ${v}`)}
      />
    </div>
  );
};
