import { useState } from "react";
import { Modal } from "../../../../core/presentation/components/ui/Modal";

export const LoginPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleLogin = () => {
    setIsOpen(true);
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
          <button
            onClick={handleLogin}
            className="mt-4 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-accent hover:bg-brand-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
          >
            Open Demo Modal
          </button>
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Demo Modal">
            <p>This is a simple demo modal.</p>
          </Modal>
        </div>
      </div>
    </div>
  );
};
