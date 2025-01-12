export const CardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col p-12 py-8 rounded-xl bg-background gap-4 w-11/12 max-w-[1000px]">
      {children}
    </div>
  );
};
