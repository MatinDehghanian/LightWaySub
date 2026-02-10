import { Card, CardContent, CardHeader } from "./ui/card";

// Lightweight skeleton component for perceived faster loading
const Skeleton = ({ className = "" }) => (
  <div
    className={`animate-pulse bg-muted/50 rounded ${className}`}
    style={{ animationDuration: "1.5s" }}
  />
);

// eslint-disable-next-line react/prop-types
const LoadingSkeleton = () => {
  return (
    <div className="space-y-5 sm:space-y-6">
      {/* UserBox Skeleton */}
      <Card className="w-full">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="w-14 h-14 sm:w-12 sm:h-12 rounded-full flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-10 sm:h-10 sm:w-10" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="flex-1 h-10" />
                <Skeleton className="flex-1 h-10" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* UsageBox Skeleton */}
      <Card className="w-full">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TimeBox Skeleton */}
      <Card className="w-full">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Apps Skeleton */}
      <Card className="w-full">
        <CardHeader className="p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-5 w-5" />
          </div>
        </CardHeader>
      </Card>

      {/* Configs Skeleton */}
      <Card className="w-full">
        <CardHeader className="p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <Skeleton className="h-5 w-28" />
            </div>
            <Skeleton className="h-5 w-5" />
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default LoadingSkeleton;
