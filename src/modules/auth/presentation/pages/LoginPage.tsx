import { Card } from "../../../../core/presentation/components/ui/Card";

export const LoginPage = () => {
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
          <Card
            variant="stat"
            className="flex flex-col items-center justify-center text-center"
          >
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">
              Tiempo Promedio Respuesta
            </span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-4xl font-black text-black">50 min</span>
              <span className="text-[10px] text-red-500 font-bold flex flex-col items-center">
                ↓ <span className="leading-none">5%</span>
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
