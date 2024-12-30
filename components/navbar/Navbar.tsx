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
import { Menu } from "lucide-react";
import { HoverHamburgerMenuTrigger } from "../ui/HamburgerMenuTrigger";

export default async function Navbar({
  t,
}: {
  t: TFunctionNonStrict<"translation", undefined>;
}) {
  return (
    <nav className="sm:h-20 h-20 fixed top-0 z-[51] flex items-center justify-between border-b-2 border-background bg-background">
      <div className="relative w-screen h-full gap-2 text-xl text-center justify-between flex text-foreground">
        {/* Navigation Menu with Hamburger Icon */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <HoverHamburgerMenuTrigger className="p-2 sm:px-4" />
              <NavigationMenuContent className="sm:p-4 p-2 sm:min-w-[600px] min-w-[300px] sm:flex sm:justify-between flex flex-col max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground bg-background">
                {/* Desktop Layout */}
                <div className="hidden sm:flex sm:gap-8">
                  {/* Main Calculators */}
                  <div className="pr-4 border-r border-muted-foreground">
                    <div className="pb-2 mb-2 border-b border-muted-foreground">
                      <p className="font-bold text-left mb-2">
                        {t("calculators.main")}
                      </p>
                      <ul className="grid grid-cols-2 gap-3 text-start">
                        {mainCalcs.map((link) => (
                          <ListItem
                            key={link.path}
                            title={t(link.label)}
                            href={link.path}
                          />
                        ))}
                      </ul>
                    </div>

                    {/* Additional Links */}
                    <div className="mt-4 max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground">
                      <p className="font-bold text-left mb-2">
                        {t("additionalLinks.label")}
                      </p>
                      <ul className="grid grid-cols-2 gap-3 text-start">
                        {extraLinks.map((link) => (
                          <ListItem
                            key={link.path}
                            title={t(link.label)}
                            href={link.path}
                          />
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Extra Calculators */}
                  <div className="pl-4">
                    <p className="font-bold text-left mb-2">
                      {t("calculators.extraCalcs.label")}
                    </p>
                    <ul className="grid grid-cols-2 gap-3 text-start">
                      {extraCalculatorLinks.map((link) => (
                        <ListItem
                          key={link.path}
                          title={t(link.label)}
                          href={link.path}
                        />
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="flex sm:hidden flex-col gap-6">
                  {/* Main Calculators */}
                  <div>
                    <p className="font-bold text-left mb-2">
                      {t("calculators.main")}
                    </p>
                    <ul className="grid grid-cols-1 gap-3 text-start">
                      {mainCalcs.map((link) => (
                        <ListItem
                          key={link.path}
                          title={t(link.label)}
                          href={link.path}
                        />
                      ))}
                    </ul>
                  </div>

                  {/* Extra Calculators */}
                  <div>
                    <p className="font-bold text-left mb-2">
                      {t("calculators.extraCalcs.label")}
                    </p>
                    <ul className="grid grid-cols-1 gap-3 text-start">
                      {extraCalculatorLinks.map((link) => (
                        <ListItem
                          key={link.path}
                          title={t(link.label)}
                          href={link.path}
                        />
                      ))}
                    </ul>
                  </div>

                  {/* Additional Links */}
                  <div>
                    <p className="font-bold text-left mb-2">
                      {t("additionalLinks.label")}
                    </p>
                    <ul className="grid grid-cols-1 gap-3 text-start">
                      {extraLinks.map((link) => (
                        <ListItem
                          key={link.path}
                          title={t(link.label)}
                          href={link.path}
                        />
                      ))}
                    </ul>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Utility Links */}
        <div className="flex items-center justify-center h-full">
          <div className="flex gap-4 ml-4 mr-4 items-center justify-center">
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
