export function DataStream() {
  const streams = [
    'SYS::MONITORING_NODE_07 → ACTIVE',
    'NET::LATENCY_12MS → NOMINAL',
    'SEC::TLS_1.3_ENCRYPTED → VERIFIED',
    'NOC::ALERT_ENGINE → STANDBY',
    'API::RESPONSE_200OK → CONNECTED',
    'DB::CONNECTION_POOL → HEALTHY',
    'INF::UPTIME_99.97% → TRACKING',
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 overflow-hidden h-6 z-20">
      <div className="flex animate-login-data-stream">
        {[...streams, ...streams].map((line, i) => (
          <span
            key={i}
            className="font-label text-[9px] text-brand-primary/25 tracking-[0.15em] whitespace-nowrap mr-12"
          >
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}
