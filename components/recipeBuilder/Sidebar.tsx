"use client";

import React, { JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronDown,
  ChevronUp,
  CookingPot,
  SmartphoneCharging,
  Pipette,
  Scale,
  NotebookPen,
  FileText,
} from "lucide-react";

function RecipeCalculatorSideBar({
  goTo,
  children,
}: {
  goTo: (pageNum: number) => void;
  children: JSX.Element;
}) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const links = [
    {
      label: t("recipeBuilder.homeHeading"),
      pageNumber: 0,
      icon: <CookingPot />,
    },
    {
      label: t("nutesHeading"),
      pageNumber: 1,
      icon: <SmartphoneCharging />,
    },
    {
      label: t("stabilizersHeading"),
      pageNumber: 3,
      icon: <Pipette />,
    },
    {
      label: t("additivesHeading"),
      pageNumber: 4,
      icon: <Scale />,
    },
    {
      label: t("notes.title"),
      pageNumber: 5,
      icon: <NotebookPen />,
    },
    {
      label: t("PDF.title"),
      pageNumber: 6,
      icon: <FileText />,
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
            icon={link.icon}
            label={link.label}
            clickFn={() => goTo(link.pageNumber)}
          />
        ))}
        {children}
      </nav>
    </div>
  );
}

function NavItem({
  clickFn,
  icon,
  label,
}: {
  clickFn: () => void;
  icon: JSX.Element;
  label: string;
}) {
  return (
    <div className="relative group flex flex-col items-center">
      {/* Icon Link */}
      <button
        onClick={clickFn}
        className="flex items-center justify-center sm:w-12 sm:h-12 w-8 h-8 bg-background text-foreground rounded-full border border-foreground hover:text-background hover:bg-foreground transition-colors"
      >
        {icon}
      </button>

      {/* Hover Label */}
      <span className="absolute top-1/2 -translate-y-1/2 right-16 whitespace-nowrap px-2 py-1 bg-background text-foreground border border-foreground rounded opacity-0 group-hover:opacity-100 transition-opacity">
        {label}
      </span>
    </div>
  );
}

export default RecipeCalculatorSideBar;
