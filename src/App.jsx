import { useState, useMemo, useEffect, Suspense, lazy } from "react";
import { Helmet } from "react-helmet";
import { ClipLoader } from "react-spinners";
import { ToastContainer } from "react-toastify";

// Lazy load components for better performance
const UserBox = lazy(() => import("./components/UserBox"));
const UsageBox = lazy(() => import("./components/UsageBox"));
const Apps = lazy(() => import("./components/Apps"));
const Configs = lazy(() => import("./components/Configs"));

import GetInfoRequest from "./utils/GetInfoRequest";
import {
  calculateRemainingTime,
  calculateUsedTimePercentage,
  formatTraffic,
} from "./utils/Helper";
import { t } from "./utils/translations";

function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [dataLinks, setDataLinks] = useState([]);

  useEffect(() => {
    GetInfoRequest.getInfo()
      .then((res) => {
        setData(res?.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (data?.links) {
      const links =
        data.links[data.links.length - 1] === "False"
          ? data.links.slice(0, -1)
          : data.links;
      setDataLinks(links);
    } else if (data && !data.links) {
      GetInfoRequest.getConfigs().then((res) => {
        const links = res.data.trim();
        const decodedLinks =
          links.includes("vmess") || links.includes("vless")
            ? links
            : decodeBase64(links);
        const configArray = decodedLinks ? decodedLinks.split("\n") : [];
        setDataLinks(
          configArray[configArray.length - 1] === "False"
            ? configArray.slice(0, -1)
            : configArray
        );
      });
    }
  }, [data]);

  const getAdjustedUrl = (subURL) => {
    if (import.meta.env.VITE_PANEL_DOMAIN) {
      return subURL.replace(
        /https?:\/\/[^/]+/,
        import.meta.env.VITE_PANEL_DOMAIN
      );
    } else if (subURL?.includes("https://")) {
      return subURL;
    }

    return `${window.location.origin}${subURL}`;
  };

  const title = data?.username
    ? `${data.username} Sub Info`
    : `Lightway Sub Info`;

  const isOffSections = useMemo(() => {
    try {
      const envValue = import.meta.env.VITE_OFF_SECTIONS;
      if (envValue) {
        return JSON.parse(envValue);
      }
      return {
        appsBox: true,
        logoBox: true,
        timeBox: true,
        usageBox: true,
        userBox: true,
        supportBox: true,
        configs: true,
      };
    } catch (error) {
      console.error("Failed to parse VITE_OFF_SECTIONS:", error);
      return {
        appsBox: true,
        logoBox: true,
        timeBox: true,
        usageBox: true,
        userBox: true,
        supportBox: true,
        configs: true,
      };
    }
  }, []);

  return (
    <div
      className="min-h-screen bg-background text-foreground transition-colors duration-200 text-base sm:text-base"
      dir="rtl"
    >
      <Helmet>
        <title>{title}</title>
        <meta
          name="description"
          content="Powered by https://github.com/MatinDehghanian"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Helmet>

      <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-8">
        <div className="mx-auto max-w-2xl">
          {loading ? (
            <div className="flex h-96 items-center justify-center">
              <ClipLoader
                size={60}
                color="hsl(var(--primary))"
                loading={loading}
              />
            </div>
          ) : (
            data && (
              <Suspense
                fallback={
                  <div className="flex h-96 items-center justify-center">
                    <ClipLoader size={40} color="hsl(var(--primary))" />
                  </div>
                }
              >
                <div className="space-y-5 sm:space-y-6">
                  {isOffSections.userBox && (
                    <UserBox
                      data={data}
                      subLink={getAdjustedUrl(data?.subscription_url)}
                    />
                  )}

                  {isOffSections.usageBox && (
                    <UsageBox
                      type="usage"
                      value={Number(
                        ((data?.used_traffic / data?.data_limit) * 100).toFixed(
                          2
                        )
                      )}
                      total={formatTraffic(data?.data_limit, t)}
                      remaining={
                        data?.data_limit === null
                          ? formatTraffic(null, t)
                          : formatTraffic(
                              data?.data_limit - data?.used_traffic,
                              t
                            )
                      }
                    />
                  )}

                  {isOffSections.timeBox && (
                    <UsageBox
                      type="time"
                      value={calculateUsedTimePercentage(
                        data?.expire || data?.expire_date
                      )}
                      remaining={calculateRemainingTime(
                        data?.expire || data?.expire_date,
                        t
                      )}
                    />
                  )}

                  {isOffSections.appsBox && (
                    <Apps subLink={getAdjustedUrl(data?.subscription_url)} />
                  )}

                  {isOffSections.configs && (
                    <Configs
                      title={t("configsList")}
                      configs={dataLinks}
                      isFirst={!isOffSections.appsBox}
                    />
                  )}
                </div>
              </Suspense>
            )
          )}
        </div>
      </div>

      <ToastContainer
        position="top-right"
        theme="colored"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="mt-4 rounded-2xl"
      />
    </div>
  );
}

export default App;

function decodeBase64(encodedString) {
  try {
    const decodedString = atob(encodedString);
    return decodedString;
  } catch (error) {
    console.error("Failed to decode base64:", error);
    return "";
  }
}
