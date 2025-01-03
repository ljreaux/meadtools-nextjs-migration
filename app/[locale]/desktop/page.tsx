"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import hydroFile from "@/public/chart-images/hydro-file.png";
import pillFile from "@/public/chart-images/pill-file.png";

type OSType = "windows" | "linux" | "macos-intel" | "macos-arm";

function DesktopDownload() {
  const { t } = useTranslation();
  const [os, setOs] = useState<null | OSType>(null);

  const downloadButtons = [
    {
      os: "Windows",
      href: "https://cdn.crabnebula.app/download/meadtools/meadtools/latest/platform/nsis-x86_64",
      key: "windows",
      logo: <WindowsIcon />,
    },
    {
      os: "Ubuntu",
      href: "https://cdn.crabnebula.app/download/meadtools/meadtools/latest/platform/appimage-x86_64",
      key: "linux",
      logo: <UbuntuIcon />,
    },
    {
      os: "Mac (intel)",
      href: "https://cdn.crabnebula.app/download/meadtools/meadtools/latest/MeadTools.app.tar.gz",
      key: "macos-intel",
      logo: <AppleIcon />,
    },
    {
      os: "Mac",
      href: "https://cdn.crabnebula.app/download/meadtools/meadtools/latest/platform/dmg-aarch64",
      key: "macos-arm",
      logo: <AppleIcon />,
    },
  ];

  const currentButton = downloadButtons.find((item) => item.key === os);
  const otherButtons = downloadButtons.filter((item) => item.key !== os);

  useEffect(() => {
    async function getOs() {
      const ua = navigator.userAgent;
      if (ua.includes("Windows")) return setOs("windows");
      if (ua.includes("Linux")) return setOs("linux");
      if (ua.includes("Macintosh")) {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("webgl");
          const debugInfo = ctx?.getExtension("WEBGL_debug_renderer_info");
          const renderer = ctx?.getParameter(
            debugInfo?.UNMASKED_RENDERER_WEBGL || 0
          );
          return setOs(
            renderer?.match(/(M1|M2|M3)/gm) ? "macos-arm" : "macos-intel"
          );
        } catch {
          setOs("macos-intel");
        }
      }
      return setOs(null);
    }
    getOs();
  }, []);

  return (
    <section className="w-full flex justify-center items-center sm:py-24 py-[6rem] relative ">
      <div className="flex flex-col md:p-12 p-8 rounded-xl bg-background gap-4 w-11/12 max-w-[1000px]">
        <h1 className="sm:text-3xl text-xl text-center">
          {t("downloadDesktop")}
        </h1>
        <p className="my-2 text-base sm:text-xl text-center">1.0.3</p>
        {currentButton && (
          <a
            href={currentButton.href}
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "text-[rgb(200_215_255)] flex items-center justify-center gap-1"
            )}
          >
            {currentButton.logo} {t("download")} {currentButton.os}
          </a>
        )}
        <div className="flex flex-wrap items-center justify-center my-4">
          {otherButtons.map((button) => (
            <a
              key={button.key}
              href={button.href}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "text-[rgb(200_215_255)] flex items-center justify-center gap-1"
              )}
            >
              {button.logo} {t("download")} {button.os}
            </a>
          ))}
        </div>
        <h2 className="text-xl">{t("newFeatures")}</h2>
        <iframe
          className="w-full my-4 aspect-video"
          src="https://www.youtube.com/embed/I1OSPqiaOfs"
          title="New Features"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-lg">{t("desktop.features.offline.label")}</h3>
            <p>{t("desktop.features.offline.body")}</p>
          </div>
          <div>
            <h3 className="text-lg">
              {t("desktop.features.customization.label")}
            </h3>
            <p>{t("desktop.features.customization.body")}</p>
          </div>
          <div>
            <h3 className="text-lg">{t("desktop.features.charts.label")}</h3>
            <p>{t("desktop.features.charts.body")}</p>
            <div className="grid w-full gap-2 my-4 sm:grid-cols-2">
              <Image src={pillFile} alt="Rapt pill chart" />
              <Image src={hydroFile} alt="Manual hydrometer data chart" />
            </div>
          </div>
        </div>
        <p className="flex mt-4">
          {t("poweredBy")}
          <a
            href="https://web.crabnebula.cloud/meadtools/meadtools/releases"
            className="text-[rgb(200_215_255)] flex"
            target="_blank"
            rel="noreferrer"
          >
            <CNLogo cn="fill-[rgb(200_215_255)] w-6 h-6" />
            CrabNebula Cloud
          </a>
        </p>
      </div>
    </section>
  );
}

export default DesktopDownload;

const CNLogo = ({ cn }: { cn?: string }) => (
  <svg
    width="332"
    height="332"
    viewBox="0 0 332 332"
    xmlns="http://www.w3.org/2000/svg"
    className={cn}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M164.923 101.881C131.11 146.401 131.306 203.282 165.36 228.927C174.309 235.667 184.707 239.579 195.787 240.875C164.356 266.368 128.151 274.279 103.705 257.675C70.1784 234.904 71.4639 174.647 106.576 123.088C135.895 80.0339 179.53 56.6586 212.649 63.3761C195.156 71.1026 178.364 84.1831 164.923 101.881ZM209.351 158.739C193.56 173.643 175.512 183.55 160.274 186.845C169.271 218.962 203.857 221.431 203.857 221.431C203.857 221.431 224.44 216.704 239.983 181.83C252.781 153.111 251.666 123.437 238.765 108.335C237.694 122.931 227.161 141.932 209.351 158.739Z"
      fill="rgb(200 215 255)"
    />
  </svg>
);

const WindowsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48.746 48.746"
    role="img"
    className="w-6 h-6"
    fill="currentColor"
  >
    <g transform="translate(71.22 -22.579)" fill="currentColor">
      <rect x="-71.22" y="22.579" width="23.105" height="23.105" />
      <rect x="-45.58" y="22.579" width="23.105" height="23.105" />
      <rect x="-71.22" y="48.221" width="23.105" height="23.105" />
      <rect x="-45.58" y="48.221" width="23.105" height="23.105" />
    </g>
  </svg>
);

const UbuntuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    role="img"
    className="w-6 h-6"
  >
    <circle cx="50" cy="50" r="45" className="fill-current" />
    <circle
      cx="50"
      cy="50"
      r="21.825"
      fill="none"
      stroke="currentColor"
      strokeWidth="8.55"
      className="stroke-secondary"
    />
    <g>
      <circle cx="19.4" cy="50" r="8.4376" className="fill-current" />
      <path
        d="M67,50H77"
        stroke="currentColor"
        strokeWidth="3.2378"
        className="stroke-current"
      />
      <circle cx="19.4" cy="50" r="6.00745" className="fill-secondary" />
    </g>
    <g transform="rotate(120,50,50)">
      <circle cx="19.4" cy="50" r="8.4376" className="fill-current" />
      <path
        d="M67,50H77"
        stroke="currentColor"
        strokeWidth="3.2378"
        className="stroke-current"
      />
      <circle cx="19.4" cy="50" r="6.00745" className="fill-secondary" />
    </g>
    <g transform="rotate(240,50,50)">
      <circle cx="19.4" cy="50" r="8.4376" className="fill-current" />
      <path
        d="M67,50H77"
        stroke="currentColor"
        strokeWidth="3.2378"
        className="stroke-primary"
      />
      <circle cx="19.4" cy="50" r="6.00745" className="fill-secondary" />
    </g>
  </svg>
);

const AppleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 814 1000"
    role="img"
    className="w-6 h-6"
    fill="currentColor"
  >
    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
  </svg>
);

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-center w-10 h-10">{children}</div>
);
