import React from "react";

function ExtraCalcsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex justify-center sm:pt-24 sm:items-baseline items-center h-full">
      <ExtraCalcsCard>{children}</ExtraCalcsCard>
    </div>
  );
}

export default ExtraCalcsLayout;

const ExtraCalcsCard = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col md:p-12 p-8 rounded-xl bg-background gap-4 w-11/12 max-w-[650px] ">
    {children}
  </div>
);
