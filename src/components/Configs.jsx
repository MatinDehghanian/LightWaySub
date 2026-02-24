import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ChevronDown, QrCode, Copy, Globe } from "lucide-react";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import {
  extractNameFromConfigURL,
  handleCopyToClipboard,
} from "../utils/Helper";
import QrModal from "./QrModal";
import { t } from "../utils/translations";

const Configs = ({ title, configs, isFirst }) => {
  const filteredLinks = useMemo(() => {
    if (configs && configs[configs.length - 1] === "False") {
      return configs.slice(0, -1);
    }
    return configs || [];
  }, [configs]);

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(null);
  const [link, setLink] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOpen = (title, link, index) => {
    setOpen(true);
    setModalTitle(title);
    setLink(link);
    setIndex(index);
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <Card className={`w-full ${isFirst ? "mt-6" : ""}`}>
        <CardHeader
          className="cursor-pointer hover:bg-muted/50 transition-colors p-5 sm:p-6"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Globe className="h-5 w-5 sm:h-5 sm:w-5 text-primary-foreground" />
              </div>
              <CardTitle className="text-lg sm:text-lg">{title}</CardTitle>
            </div>
            <ChevronDown
              className={`h-5 w-5 sm:h-5 sm:w-5 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="pt-0 px-5 sm:px-6 pb-5 sm:pb-6">
            <div className="space-y-3">
              {filteredLinks?.map((config, index) => {
                const title = extractNameFromConfigURL(config);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 sm:p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpen(title, filteredLinks?.[index], index);
                    }}
                  >
                    <span className="font-medium truncate flex-1 me-3 sm:me-3 text-xs sm:text-xs">
                      {title}
                    </span>
                    <div className="flex gap-2 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 w-10 sm:h-9 sm:w-auto px-3 sm:px-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpen(title, filteredLinks?.[index], index);
                        }}
                      >
                        <QrCode className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 w-10 sm:h-9 sm:w-auto px-3 sm:px-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyToClipboard(filteredLinks?.[index], index);
                        }}
                      >
                        <Copy className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                );
              })}

              <Button
                onClick={() =>
                  handleCopyToClipboard(filteredLinks.join("\n"), -1, t)
                }
                className="w-full py-3 sm:py-3 text-base sm:text-base"
                variant="outline"
              >
                {t("copyAll")}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      <QrModal
        open={open}
        handleClose={handleClose}
        title={modalTitle}
        link={link}
        index={index}
        id="clist"
      />
    </>
  );
};

Configs.propTypes = {
  title: PropTypes.string.isRequired,
  configs: PropTypes.arrayOf(PropTypes.string).isRequired,
  isFirst: PropTypes.bool,
};

export default Configs;
