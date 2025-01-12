export default function Loading() {
  const logo = "/assets/full-logo.png";
  return (
    <div className="w-full h-full flex items-center justify-center bg-secondary rounded-md">
      <img className="animate-pulse" src={logo} />
    </div>
  );
}
