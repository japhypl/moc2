import { cn } from "@/lib/utils/cn";

function Section({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn("py-section-mobile md:py-section", className)}
      {...props}
    />
  );
}

export { Section };
