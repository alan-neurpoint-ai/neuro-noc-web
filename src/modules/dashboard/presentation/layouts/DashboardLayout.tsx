import { Outlet } from "react-router";

export const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-[#0a0f1e] text-white overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto p-6 bg-[#0d1224]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
