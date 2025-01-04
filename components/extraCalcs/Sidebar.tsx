"use client";

import React, { JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import {
  Beer,
  Percent,
  FlaskConical,
  Thermometer,
  Blend,
  ChevronDown,
  ChevronUp,
  Scale,
  Rainbow,
  Pipette,
  Atom,
} from "lucide-react";

function ExtraCalcsSideBar() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const links = [
    { path: "/extra-calcs/", icon: <Beer />, label: t("sideNav.abv") },
    {
      path: "/extra-calcs/brix",
      icon: <Percent />,
      label: t("sideNav.brix"),
    },
    {
      path: "/extra-calcs/estimated-og",
      icon: <Scale />,
      label: t("sideNav.estOG"),
    },
    {
      path: "/extra-calcs/bench-trials",
      icon: <FlaskConical />,
      label: t("sideNav.benchTrials"),
    },
    {
      path: "/extra-calcs/sulfite",
      icon: <Atom />,
      label: t("sulfiteHeading"),
    },
    {
      path: "/extra-calcs/sorbate",
      icon: <Pipette />,
      label: t("sorbateHeading"),
    },
    {
      path: "/extra-calcs/refractometer-correction",
      icon: <Rainbow />,
      label: t("sideNav.refractometer"),
    },
    {
      path: "/extra-calcs/temperature-correction",
      icon: <Thermometer />,
      label: t("sideNav.tempCorrection"),
    },
    {
      path: "/extra-calcs/blending",
      icon: <Blend />,
      label: t("sideNav.blending"),
    },
  ];

  return (
    <div
      className={`fixed top-28 right-0 transition-transform duration-500 bg-background border border-foreground z-50 px-2 rounded-md ${
        isOpen ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -top-5 right-0 flex items-center justify-center w-8 h-8 bg-background text-foreground border border-foreground rounded-md z-50"
        aria-label={isOpen ? "Close Sidebar" : "Open Sidebar"}
      >
        {isOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>

      {/* Sidebar Content */}
      <nav
        className={`flex flex-col items-center gap-4 py-4 ${
          isOpen ? "" : "hidden"
        }`}
      >
        {links.map((link, idx) => (
          <NavItem
            key={idx}
            link={link.path}
            icon={link.icon}
            label={link.label}
          />
        ))}
      </nav>
    </div>
  );
}

function NavItem({
  link,
  icon,
  label,
}: {
  link: string;
  icon: JSX.Element;
  label: string;
}) {
  return (
    <div className="relative group flex flex-col items-center">
      {/* Icon Link */}
      <Link
        href={link}
        className="flex items-center justify-center sm:w-12 sm:h-12 w-8 h-8 bg-background text-foreground rounded-full border border-foreground hover:text-background hover:bg-foreground transition-colors"
      >
        {icon}
      </Link>

      {/* Hover Label */}
      <span className="absolute top-1/2 -translate-y-1/2 right-16 whitespace-nowrap px-2 py-1 bg-background text-foreground border border-foreground rounded opacity-0 group-hover:opacity-100 transition-opacity">
        {label}
      </span>
    </div>
  );
}

export default ExtraCalcsSideBar;
