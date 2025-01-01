export default function Loading() {
  const logo = "/assets/full-logo.png";
  return (
    <div className="w-screen h-full flex items-center justify-center bg-secondary">
      <img className="animate-pulse" src={logo} />
    </div>
  );
}
