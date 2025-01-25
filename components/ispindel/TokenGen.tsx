import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { useISpindel } from "../providers/ISpindelProvider";
import { CircleCheck, Clipboard } from "lucide-react";

function TokenGen() {
  const { hydrometerToken, tokenLoading, getNewHydrometerToken } =
    useISpindel();
  const { t } = useTranslation();

  const handleClick = async () => {
    if (hydrometerToken) {
      navigator.clipboard.writeText(hydrometerToken);
      toast({
        description: (
          <div className="flex items-center justify-center gap-2">
            <CircleCheck className="text-xl text-green-500" />
            {t("iSpindelDashboard.copyToken")}
          </div>
        ),
      });
    }
  };

  return (
    <div className="flex gap-0 flex-nowrap max-w-[500px] w-full">
      <LoadingButton
        loading={tokenLoading}
        onClick={getNewHydrometerToken}
        className="rounded-r-none h-10 w-[150px]" // Fixed width
        style={{ minWidth: "150px" }} // Ensures width consistency
      >
        {t("iSpindelDashboard.genToken")}
      </LoadingButton>
      <Input
        readOnly
        disabled
        value={hydrometerToken ?? ""}
        placeholder="Please Generate Token"
        className="text-center border-collapse rounded-none border-x-0 h-10" // Matches button height
      />
      <Button
        value={"copy to clipboard"}
        className="rounded-l-none h-10" // Matches button height
        onClick={handleClick}
      >
        <Clipboard />
      </Button>
    </div>
  );
}

export default TokenGen;
