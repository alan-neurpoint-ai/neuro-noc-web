import { useState, useEffect } from 'react';
import { LoginBackground } from '../components/LoginBackground';
import { DataStream } from '../components/DataStream';
import { LoginBrandPanel } from '../components/LoginBrandPanel';
import { LoginFormCard } from '../components/LoginFormCard';

export default function LoginPage() {
  const [mountAnim, setMountAnim] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => setMountAnim(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  return (
    <div
      data-theme="dark"
      className="min-h-screen flex font-body antialiased overflow-hidden relative"
    >
      <LoginBackground />
      <DataStream />
      <LoginBrandPanel mountAnim={mountAnim} />

      <div
        className={`hidden lg:block absolute left-[52%] top-[8%] xl:top-[10%] bottom-[8%] xl:bottom-[10%] w-px transition-all duration-1000 delay-500 ${mountAnim ? 'opacity-100' : 'opacity-0'} gradient-login-divider`}
      />

      <LoginFormCard mountAnim={mountAnim} />
    </div>
  );
}
