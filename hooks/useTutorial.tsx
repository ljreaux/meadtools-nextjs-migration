"use client";

import { useState, useEffect } from "react";
import Joyride, { CallBackProps, Step, STATUS } from "react-joyride";
import React from "react";

export type SpecialStepCallbacks = {
  [stepIndex: number]: () => void;
};

interface UseTutorialReturn {
  TutorialComponent: React.FC;
  sidebarOpen: boolean;
}

export function useTutorial(
  steps: Step[],
  specialCallbacks?: SpecialStepCallbacks
): UseTutorialReturn {
  // Initially, tutorial is off.
  const [run, setRun] = useState<boolean>(true);
  // We'll use 'run' to force open the sidebar as well.
  const sidebarOpen = run;

  // Callback to handle Joyride events.
  const handleJoyrideCallback = (data: CallBackProps): void => {
    const { status: joyrideStatus, index } = data;

    // If we have a step index and a corresponding callback, execute it.
    if (
      typeof index === "number" &&
      specialCallbacks &&
      specialCallbacks[index]
    ) {
      specialCallbacks[index]();
    }

    // When the tutorial finishes or is skipped, stop it.
    const finishedStatuses: (typeof joyrideStatus)[] = [
      STATUS.FINISHED,
      STATUS.SKIPPED,
    ];
    if (finishedStatuses.includes(joyrideStatus)) {
      setTimeout(() => {
        setRun(false);
      }, 100);
    }
  };

  const customJoyrideStyles = {
    options: {
      zIndex: 10000,
      primaryColor: "hsl(var(--primary))",
      textColor: "hsl(var(--foreground))",
      width: 500,
    },
    tooltip: {
      backgroundColor: "hsl(var(--card))",
      border: "none",
      boxShadow: "none",
    },
    tooltipContainer: {
      backgroundColor: "transparent",
      borderRadius: "var(--radius)",
      padding: "1rem",
      border: "none",
      boxShadow: "none",
    },
    tooltipContent: {
      backgroundColor: "transparent",
      padding: 0,
      border: "none",
      boxShadow: "none",
    },
    buttonNext: {
      backgroundColor: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
      border: "1px solid hsl(var(--border))",
      padding: "0.5rem 1rem",
      borderRadius: "var(--radius)",
      fontWeight: 500,
      cursor: "pointer",
    },
    buttonBack: {
      backgroundColor: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
      border: "1px solid hsl(var(--border))",
      padding: "0.5rem 1rem",
      borderRadius: "var(--radius)",
      fontWeight: 500,
      cursor: "pointer",
    },
    buttonSkip: {
      backgroundColor: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
      border: "1px solid hsl(var(--border))",
      padding: "0.5rem 1rem",
      borderRadius: "var(--radius)",
      fontWeight: 500,
      cursor: "pointer",
    },
    buttonClose: {
      display: "none",
    },
  };

  const TutorialComponent: React.FC = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
      setMounted(true);
    }, []);
    if (!mounted) return null;
    return (
      <Joyride
        steps={steps}
        run={run}
        continuous
        scrollOffset={100}
        callback={handleJoyrideCallback}
        styles={customJoyrideStyles}
        disableCloseOnEsc
        disableOverlayClose
      />
    );
  };

  return {
    TutorialComponent,
    sidebarOpen,
  };
}
