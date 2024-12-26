"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import Link from "next/link";
import { ModeToggle } from "./ui/mode-toggle";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "./ui/language-switcher";
import Image from "next/image";
import logo from "@/assets/full-logo.png";
import logoOnly from "@/assets/logoOnly.png";
import { useAuth } from "./providers/AuthProvider";
import { extraCalculatorLinks, extraLinks, mainCalcs } from "@/lib/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
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
                {t("account.label")}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex sm:min-w-[400px] min-w-[300px] p-4 items-center justify-center">
                  {user ? (
                    <>
                      <li>
                        <Link
                          className="p-3 space-y-1 leading-none no-underline transition-colors rounded-md outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href="/account"
                        >
                          {t("account.label")}
                        </Link>
                        <Link
                          href={"/account/ispindel"}
                          className="p-3 space-y-1 leading-none no-underline transition-colors rounded-md outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          {t("iSpindelDashboard.manage")}
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            router.push("/login");
                          }}
                          className="p-3 space-y-1 leading-none no-underline transition-colors rounded-md outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          {t("account.logout")}
                        </button>
                      </li>
                    </>
                  ) : (
                    <li>
                      <Link
                        className="block p-3 space-y-1 leading-none no-underline transition-colors rounded-md outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground "
                        href="/login"
                      >
                        {t("account.login")}
                      </Link>
                    </li>
                  )}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="px-2">
                {t("additionalLinks.label")}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex gap-3 p-4 sm:min-w-[400px] min-w-[300px] justify-center">
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
          <div className="flex gap-4 ml-4 mr-auto sm:mr-4">
            <ModeToggle />
            <LanguageSwitcher />
          </div>
          <Link
            className="bg-background w-[3rem] sm:flex sm:w-24 lg:w-52 h-full left-0 border-[1px] border-sidebar hover:opacity-80 transition-all"
            href="/"
          >
            <span className="flex flex-col items-center justify-center w-full h-full bg-secondary">
              <Image
                src={logo}
                alt="MeadTools logo"
                className="hidden lg:flex"
              />
              <Image
                src={logoOnly}
                alt="MeadTools logo"
                className="lg:hidden w-[50%]"
              />
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-sm leading-snug line-clamp-2 text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
