/* eslint-disable react/prop-types */
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { User, MessageCircle, QrCode } from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import QrModal from "./QrModal";
import { t } from "../utils/translations";

const UserBox = ({ data, subLink }) => {
  const [statusData, setStatusData] = useState("");

  useEffect(() => {
    if (data?.status) {
      setStatusData(data?.status);
    } else if (data?.expired || data?.data_limit_reached) {
      setStatusData("expired");
    } else if (!data?.enabled) {
      setStatusData("disabled");
    } else if (data?.is_active) {
      setStatusData("active");
    } else if (data?.activated === null) {
      setStatusData("on_hold");
    } else return setStatusData("");
  }, [data]);

  const getStatusColors = (status) => {
    switch (status) {
      case "active":
        return {
          bg: "bg-green-500 hover:bg-green-600",
          text: "text-white",
        };
      case "expired":
      case "limited":
        return {
          bg: "bg-red-500 hover:bg-red-600",
          text: "text-white",
        };
      case "on_hold":
        return {
          bg: "bg-yellow-500 hover:bg-yellow-600",
          text: "text-white",
        };
      case "disabled":
        return {
          bg: "bg-gray-500 hover:bg-gray-600",
          text: "text-white",
        };
      default:
        return {
          bg: "bg-gray-300 hover:bg-gray-400",
          text: "text-gray-700",
        };
    }
  };

  const [openQrModal, setOpenQrModal] = useState(false);
  const [qrLink, setQrLink] = useState("https://example.com");

  const handleQrModalOpen = () => {
    setOpenQrModal(true);
  };

  const handleQrModalClose = () => {
    setOpenQrModal(false);
  };

  useEffect(() => {
    setQrLink(subLink);
  }, [subLink]);

  const statusColors = getStatusColors(statusData);

  return (
    <>
      <Card className="w-full">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-start gap-4 sm:gap-4">
            {/* User Icon */}
            <div className="flex-shrink-0 p-2">
              <User className="h-14 w-14 sm:h-12 sm:w-12 text-primary" />
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4 sm:mb-4">
                <h3 className="text-sm sm:text-sm font-medium text-foreground truncate">
                  {data?.username}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleQrModalOpen}
                  className="flex-shrink-0 h-12 w-12 sm:h-10 sm:w-auto px-3 sm:px-3"
                >
                  <QrCode className="h-5 w-5" />
                </Button>
              </div>

              {/* Status and Support Buttons */}
              <div className="flex gap-3 sm:gap-3">
                <Button
                  className={`flex-1 ${statusColors.bg} ${statusColors.text} font-medium text-base sm:text-base py-3 sm:py-2.5`}
                >
                  {t(`status.${statusData}`)}
                </Button>

                {import.meta.env.VITE_SUPPORT_URL && (
                  <Button
                    onClick={() =>
                      window.open(
                        import.meta.env.VITE_SUPPORT_URL ||
                          "https://t.me/YourID"
                      )
                    }
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium text-base sm:text-base py-3 sm:py-2.5"
                  >
                    <MessageCircle className="h-5 w-5 me-2" />
                    <span className="hidden sm:inline">{t("support")}</span>
                    <span className="sm:hidden">پشتیبانی</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <QrModal
        open={openQrModal}
        handleClose={handleQrModalClose}
        title={t("subQRCode")}
        link={qrLink}
        id="switch"
      />
    </>
  );
};

UserBox.propTypes = {
  data: PropTypes.shape({
    username: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
};

export default UserBox;
