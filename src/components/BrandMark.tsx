import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * RAIQEN brand mark — renders /logo.png (the company symbol).
 * Sits beside the RAIQEN wordmark in the navbar and footer.
 */
export default function BrandMark({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo.png"
      alt="RAIQEN"
      width={201}
      height={212}
      priority={priority}
      className={cn(
        "h-6 w-auto shrink-0 object-contain drop-shadow-[0_0_10px_rgba(227,180,108,0.18)]",
        className
      )}
    />
  );
}
