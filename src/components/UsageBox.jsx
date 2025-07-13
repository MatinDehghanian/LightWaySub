import PropTypes from "prop-types";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { t } from "../utils/translations";

const UsageBox = ({ type, value, total, remaining }) => {
  const parseValue = (input) => {
    const numericMatch = input.match(/\d+/);
    const number = numericMatch ? numericMatch[0] : "0";
    const text = input;
    return { number, text };
  };

  const getProgressColor = (v) => {
    if (v === Infinity || Number.isNaN(v)) {
      return "bg-green-500";
    } else if (v <= 30) {
      return "bg-green-500";
    } else if (v <= 70) {
      return "bg-yellow-500";
    } else {
      return "bg-red-500";
    }
  };

  const getTextColor = (v) => {
    if (v === Infinity || Number.isNaN(v)) {
      return "text-green-600 dark:text-green-400";
    } else if (v <= 30) {
      return "text-green-600 dark:text-green-400";
    } else if (v <= 70) {
      return "text-yellow-600 dark:text-yellow-400";
    } else {
      return "text-red-600 dark:text-red-400";
    }
  };

  const labels = {
    usage: {
      title: t("remaining_volume"),
      totaltitle: t("initial_volume"),
      unit: t("gigabytes"),
    },
    time: {
      title: t("remaining_time"),
      totaltitle: t("initial_time"),
      unit: t("days"),
    },
  };

  const { title, totaltitle } = labels[type];

  const remainingParsed = parseValue(remaining);

  const totalParsed = parseValue(total || "");

  // Round the value to remove decimal places
  const roundedValue = Math.round(value);

  return (
    <Card className="w-full">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-center gap-5 sm:gap-6">
          {/* Progress Circle */}
          <div className="flex-shrink-0">
            <div className="relative w-20 h-20 sm:w-20 sm:h-20">
              <svg
                className="w-20 h-20 sm:w-20 sm:h-20 transform -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  className="text-gray-200 dark:text-gray-700"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={getProgressColor(value)}
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${
                    value === Infinity || Number.isNaN(value) ? 100 : value
                  }, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-base sm:text-sm font-bold">
                  {value === Infinity || Number.isNaN(value)
                    ? "∞"
                    : `${roundedValue}%`}
                </span>
              </div>
            </div>
          </div>

          {/* Remaining Info */}
          <div className="flex-1 text-center">
            <p className="text-sm sm:text-sm text-muted-foreground font-light mb-2">
              {title}
            </p>
            <p
              className={`text-2xl sm:text-xl font-bold ${getTextColor(value)}`}
            >
              {remainingParsed.text === t("infinity")
                ? remainingParsed.text
                : remainingParsed.number}
            </p>
            <p
              dir="ltr"
              className="text-sm sm:text-sm text-muted-foreground font-light"
            >
              {remainingParsed.text}
            </p>
          </div>

          {/* Total Info (only for usage type) */}
          {type === "usage" && (
            <div className="flex-1 text-center">
              <p className="text-sm sm:text-sm text-muted-foreground font-light mb-2">
                {totaltitle}
              </p>
              <p className="text-2xl sm:text-xl font-bold">
                {totalParsed.text === t("infinity")
                  ? totalParsed.text
                  : totalParsed.number}
              </p>
              <p className="text-sm sm:text-sm text-muted-foreground font-light">
                {totalParsed.text}
              </p>
            </div>
          )}
        </div>

        {/* Linear Progress Bar */}
        <div className="mt-4 sm:mt-4">
          <Progress value={value} className="h-3 sm:h-3" />
        </div>
      </CardContent>
    </Card>
  );
};

UsageBox.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  total: PropTypes.string,
  remaining: PropTypes.string.isRequired,
};

export default UsageBox;
