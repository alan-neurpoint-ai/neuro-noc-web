export function LoginBackground() {
  return (
    <div className="absolute inset-0 bg-bg-main">
      <div className="absolute inset-0 gradient-login-ambient" />
      <div className="absolute inset-0 perspective-midrange">
        <div className="absolute left-0 right-0 bottom-0 h-3/5 transform-[rotateX(55deg)] origin-[bottom_center] bg-[linear-gradient(rgba(99,102,241,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.06)_1px,transparent_1px)] bg-size-[80px_80px] mask-[linear-gradient(to_bottom,transparent_0%,black_40%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_40%)]" />
      </div>
      <div className="absolute w-150 h-150 xl:w-180 xl:h-180 rounded-full top-[-10%] left-[-5%] gradient-login-orb1 animate-login-orb1" />
      <div className="absolute w-100 h-100 xl:w-120 xl:h-120 rounded-full bottom-[5%] right-[10%] gradient-login-orb2 animate-login-orb2" />
      <div className="absolute left-0 right-0 h-px gradient-login-scan animate-login-scan-line" />
      <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml,%3Csvg_viewBox%3D%220_0_256_256%22_xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter_id%3D%22n%22%3E%3CfeTurbulence_type%3D%22fractalNoise%22_baseFrequency%3D%220.9%22_numOctaves%3D%224%22_stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect_width%3D%22100%25%22_height%3D%22100%25%22_filter%3D%22url(%23n)%22_opacity%3D%221%22%2F%3E%3C%2Fsvg%3E')] bg-size-[128px_128px]" />
    </div>
  );
}