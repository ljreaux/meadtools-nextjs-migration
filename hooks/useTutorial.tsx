// hooks/useTutorial.tsx
"use client";

import { useState, useEffect } from "react";
import Joyride, { CallBackProps, Step, STATUS } from "react-joyride-react-19";
import React from "react";

interface UseTutorialReturn {
  run: boolean;
  setRun: React.Dispatch<React.SetStateAction<boolean>>;
  TutorialComponent: React.FC;
  sidebarOpen: boolean;
}

/**
 * Custom hook to encapsulate Joyride tutorial logic.
 * @param steps - Array of Joyride step objects.
 * @returns An object containing the run state, a setter for the run state, and a TutorialComponent.
 */
export function useTutorial(steps: Step[]): UseTutorialReturn {
  // Run the tutorial immediately by default.
  const [run, setRun] = useState<boolean>(true);
  const [sidebarOpen] = useState<boolean>(run);

  // Callback to handle Joyride events.
  const handleJoyrideCallback = (data: CallBackProps): void => {
    const { status: joyrideStatus } = data;
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

  /**
   * Custom styles for Joyride that use your Tailwind CSS variables.
   * The tooltip container now has an extra top margin (adjust as needed) to account for the fixed navbar.
   */
  const customJoyrideStyles = {
    options: {
      zIndex: 10000,
      primaryColor: "hsl(var(--primary))",
      textColor: "hsl(var(--foreground))",
      width: 500,
    },
    // Override the outer tooltip container to remove unwanted white backgrounds.
    tooltip: {
      backgroundColor: "hsl(var(--card))",
      border: "none",
      boxShadow: "none",
    },
    // Adjust the tooltip container so it doesn't get hidden behind the navbar.
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
    // Secondary button styles for Next, Back, and Skip buttons.
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
  };

  // The TutorialComponent renders Joyride only on the client.
  const TutorialComponent: React.FC = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
      setMounted(true);
    }, []);
    if (!mounted) return null; // Avoid rendering on the server

    return (
      <Joyride
        steps={steps}
        run={run}
        continuous
        showSkipButton
        scrollToFirstStep
        scrollOffset={100} // Adjust scrolling so the target isn't hidden by the navbar
        callback={handleJoyrideCallback}
        styles={customJoyrideStyles}
      />
    );
  };

  return { run, setRun, TutorialComponent, sidebarOpen };
}
