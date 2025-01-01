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
    { path: "/ExtraCalcs/", icon: <Beer />, label: t("sideNav.abv") },
    {
      path: "/ExtraCalcs/brixCalc",
      icon: <Percent />,
      label: t("sideNav.brix"),
    },
    { path: "/ExtraCalcs/estOG", icon: <Scale />, label: t("sideNav.estOG") },
    {
      path: "/ExtraCalcs/benchTrials",
      icon: <FlaskConical />,
      label: t("sideNav.benchTrials"),
    },
    {
      path: "/ExtraCalcs/sulfite",
      icon: <Atom />,
      label: t("sulfiteHeading"),
    },
    {
      path: "/ExtraCalcs/sorbate",
      icon: <Pipette />,
      label: t("sorbateHeading"),
    },
    {
      path: "/ExtraCalcs/RefractometerCorrection",
      icon: <Rainbow />,
      label: t("sideNav.refractometer"),
    },
    {
      path: "/ExtraCalcs/tempCorrection",
      icon: <Thermometer />,
      label: t("sideNav.tempCorrection"),
    },
    {
      path: "/ExtraCalcs/blending",
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
