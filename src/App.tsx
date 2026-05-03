import { useEffect } from "react";
import Index from "./presentation/routers";
import { useAuthStore } from "./presentation/store/AuthStore";
export default function App() {
  const { hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, []);
  return (
    <div>
      <Index />
    </div>
  );
}
