import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  ChevronDown,
  Download,
  Play,
  Monitor,
  Smartphone,
  Apple,
  Code,
  X,
  Plus,
  Airplay,
} from "lucide-react";
import { t } from "../utils/translations";
import osData from "../assets/os-resolved.json";

const getOsIcon = (osName) => {
  const icons = {
    Windows: <Monitor className="h-6 w-6 sm:h-6 sm:w-6" />,
    Android: <Smartphone className="h-6 w-6 sm:h-6 sm:w-6" />,
    iOS: <Apple className="h-6 w-6 sm:h-6 sm:w-6" />,
    macOS: <Airplay className="h-6 w-6 sm:h-6 sm:w-6" />,
    Linux: <Code className="h-6 w-6 sm:h-6 sm:w-6" />,
    default: <X className="h-6 w-6 sm:h-6 sm:w-6" />,
  };
  return icons[osName] || icons.default;
};

const AppCard = ({ app, t, subLink, onTutorialOpen }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const openShadowrocketURL = (subLink) => {
    const encodedURL = btoa(subLink);
    const shadowrocketLink = "sub://" + encodedURL;
    window.location.href = shadowrocketLink;
  };

  return (
    <Card className="mb-4">
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors p-5 sm:p-6"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-3">
            <img
              src={app.logo}
              alt={`${app.name} logo`}
              className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg object-contain"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = "none";
              }}
            />
            <div>
              <h3 className="font-medium text-base sm:text-base">{app.name}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={
                app?.price === "0"
                  ? "bg-green-100 text-green-800 hover:bg-green-200 text-sm sm:text-sm"
                  : app?.isAd
                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 text-sm sm:text-sm"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200 text-sm sm:text-sm"
              }
            >
              {app.price === "0"
                ? t("free")
                : app?.isAd
                  ? t("ad")
                  : `${app.price} $`}
            </Button>
            <ChevronDown
              className={`h-5 w-5 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 px-5 sm:px-6 pb-5 sm:pb-6">
          <p className="text-sm sm:text-sm text-muted-foreground mb-3">
            {app.faDescription || app.description}
          </p>
          <div className="flex flex-col gap-4 sm:gap-5 my-3">
            {app.downloadLink && !app?.isAd && (
              <Button
                variant="outline"
                className="w-full py-3 sm:py-3 text-base sm:text-base"
                onClick={() => window.open(app.downloadLink, "_blank")}
              >
                <Download className="h-5 w-5 me-2" />
                {t("download")}
              </Button>
            )}

            {app.resolvedDownloadLinks?.length > 0 &&
              !app?.isAd &&
              app.resolvedDownloadLinks.map((item, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="w-full py-3 sm:py-3 text-base sm:text-base"
                  disabled={!item.url}
                  onClick={() => item.url && window.open(item.url, "_blank")}
                >
                  <Download className="h-5 w-5 me-2" />
                  <span>
                    {t("download")}
                    {item.label ? ` (${item.label})` : ""}
                  </span>
                  {item.version && (
                    <span className="text-xs ms-2 opacity-60">
                      {item.version}
                    </span>
                  )}
                </Button>
              ))}

            {app.configLink && (
              <Button
                asChild
                variant="outline"
                className="w-full py-3 sm:py-3 text-base sm:text-base"
              >
                <a
                  href={app.configLink.replace("{url}", subLink)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Plus className="h-5 w-5 me-2" />
                  {t("configuration")}
                </a>
              </Button>
            )}

            {app.name === "Shadowrocket" && (
              <Button
                variant="outline"
                className="w-full py-3 sm:py-3 text-base sm:text-base"
                onClick={() => openShadowrocketURL(subLink)}
              >
                <Plus className="h-5 w-5 me-2" />
                {t("configuration")}
              </Button>
            )}

            {app.tutorialSteps?.length > 0 && (
              <Button
                variant="outline"
                className="w-full py-3 sm:py-3 text-base sm:text-base"
                onClick={() => onTutorialOpen(app)}
              >
                <Play className="h-5 w-5 me-2" />
                {t("watchVideo")}
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

AppCard.propTypes = {
  app: PropTypes.shape({
    name: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    description: PropTypes.string,
    faDescription: PropTypes.string,
    price: PropTypes.string,
    isAd: PropTypes.bool,
    downloadLink: PropTypes.string,
    resolvedDownloadLinks: PropTypes.array,
    configLink: PropTypes.string,
    adBtnText: PropTypes.string,
    tutorialSteps: PropTypes.array,
    githubReleases: PropTypes.array,
  }).isRequired,
  t: PropTypes.func.isRequired,
  subLink: PropTypes.string,
  onTutorialOpen: PropTypes.func.isRequired,
};

const OsSection = ({ os, t, subLink, onTutorialOpen }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="mb-4">
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors p-5 sm:p-6"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-3">
            {getOsIcon(os.engName)}
            <h3 className="font-medium text-base sm:text-base">
              {os.name || os.engName}
            </h3>
          </div>
          <ChevronDown
            className={`h-5 w-5 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 px-5 sm:px-6 pb-5 sm:pb-6">
          <div className="space-y-4 sm:space-y-4 my-3 sm:my-4">
            {os.apps.map((app, appIndex) => (
              <AppCard
                key={appIndex}
                app={app}
                t={t}
                subLink={subLink}
                onTutorialOpen={onTutorialOpen}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

OsSection.propTypes = {
  os: PropTypes.shape({
    name: PropTypes.string,
    engName: PropTypes.string.isRequired,
    apps: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        logo: PropTypes.string.isRequired,
        description: PropTypes.string,
        faDescription: PropTypes.string,
        price: PropTypes.string,
        isAd: PropTypes.bool,
        downloadLink: PropTypes.string,
        configLink: PropTypes.string,
        adBtnText: PropTypes.string,
        tutorialSteps: PropTypes.array,
      })
    ).isRequired,
  }).isRequired,
  t: PropTypes.func.isRequired,
  subLink: PropTypes.string,
  onTutorialOpen: PropTypes.func.isRequired,
};

const Apps = ({ subLink }) => {
  const [operatingSystems, setOperatingSystems] = useState([]);

  useEffect(() => {
    setOperatingSystems(osData.operatingSystems || []);
  }, []);

  return (
    <>
      <Card className="w-full">
        <CardHeader className="p-5 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-lg">
            <div className="p-2 bg-primary rounded-lg">
              <Monitor className="h-5 w-5 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            {t("operatingSystems")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 sm:p-6">
          <div className="space-y-4 sm:space-y-5">
            {operatingSystems.map((os, index) => (
              <OsSection key={index} os={os} t={t} subLink={subLink} />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

Apps.propTypes = {
  subLink: PropTypes.string,
};

export default Apps;
