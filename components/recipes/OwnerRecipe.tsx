import React from "react";

function OwnerRecipe({ recipe }: { recipe: any }) {
  return (
    <div className="flex flex-col p-12 py-8 rounded-xl bg-background gap-4 w-11/12 max-w-[1000px]">
      {recipe.id}
    </div>
  );
}

export default OwnerRecipe;
