export const SidebarHeaderSkeleton = () => {
  return (
    <div className="border-b border-sidebar-border px-2 py-2 space-y-3">
      
      {/* Logo skeleton */}
      <div className="h-12 w-12 rounded-md bg-muted animate-pulse" />

      {/* User skeleton */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />

        <div className="space-y-2">
          <div className="h-3 w-24 bg-muted rounded animate-pulse" />
          <div className="h-3 w-32 bg-muted rounded animate-pulse" />
        </div>
      </div>

    </div>
  );
};