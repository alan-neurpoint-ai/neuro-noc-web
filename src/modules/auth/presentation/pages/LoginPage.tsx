import { Pagination } from "../../../../core/presentation/components/ui/Pagination";

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
          <Pagination
            currentPage={1}
            totalItems={100}
            onPageChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
};
