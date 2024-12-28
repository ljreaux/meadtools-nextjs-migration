import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import Link from "next/link";
import { ModeToggle } from "../ui/mode-toggle";
import LanguageSwitcher from "../ui/language-switcher";
import Image from "next/image";
import { extraCalculatorLinks, extraLinks, mainCalcs } from "@/lib/navigation";
import { ListItem } from "./ListItem";
import AccountLinks from "./AccountLinks";
import { TFunctionNonStrict } from "i18next";

export default async function Navbar({
  t,
}: {
  t: TFunctionNonStrict<"translation", undefined>;
}) {
  return (
    <nav className="sm:h-20 h-28 fixed top-0 z-[51] flex items-center justify-between mb-[1rem] border-b-2 border-background">
      <div className="relative grid items-center justify-center w-screen h-full gap-2 text-xl text-center sm:justify-between sm:flex bg-background text-foreground">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="px-2">
                {t("calculators.label")}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid sm:gap-3 gap-2 sm:p-4 sm:min-w-[400px] min-w-[300px] lg:grid-cols-[1fr_1fr] text-start">
                  <li className="col-span-full">{t("calculators.main")}</li>
                  {mainCalcs.map((link) => {
                    return (
                      <ListItem
                        key={link.path}
                        title={t(link.label)}
                        href={link.path}
                      />
                    );
                  })}
                </ul>
                <ul className="grid sm:gap-3 gap-2 sm:p-4 p-2 sm:min-w-[400px] min-w-[300px] lg:grid-cols-[1fr_1fr] text-start">
                  <li className="col-span-full">
                    {t("calculators.extraCalcs.label")}
                  </li>
                  {extraCalculatorLinks.map((link) => {
                    return (
                      <ListItem
                        key={link.path}
                        title={t(link.label)}
                        href={link.path}
                      />
                    );
                  })}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="px-2">
                {t("additionalLinks.label")}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid grid-cols-2 gap-3 p-4 sm:min-w-[400px] min-w-[300px] text-left">
                  {extraLinks.map((link) => {
                    return (
                      <ListItem
                        key={link.path}
                        title={t(link.label)}
                        href={link.path}
                      />
                    );
                  })}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center justify-center h-full">
          <div className="flex gap-4 ml-4 mr-auto sm:mr-4 items-center justify-center">
            <LanguageSwitcher />
            <ModeToggle />
            <AccountLinks />
          </div>
          <Link
            className="bg-background w-[3rem] sm:flex sm:w-24 lg:w-52 h-full left-0 border-[1px] border-sidebar hover:opacity-80 transition-all"
            href="/"
          >
            <span className="flex flex-col items-center justify-center w-full h-full bg-secondary">
              <Image
                src={"/assets/full-logo.png"}
                alt="MeadTools logo"
                className="hidden lg:flex"
                width="300"
                height="50"
              />
              <Image
                src={"/assets/logoOnly.png"}
                alt="MeadTools logo"
                className="lg:hidden"
                width="50"
                height="50"
              />
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
