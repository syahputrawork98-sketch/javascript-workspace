import { cn } from "./lib/utils.js";

function Card({ className, ...props }) {
  return (
    <div
      className={cn("rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_6px_20px_rgba(15,23,42,0.05)]", className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return <div className={cn("mb-4 space-y-1", className)} {...props} />;
}

function CardTitle({ className, ...props }) {
  return <h2 className={cn("text-xl font-medium tracking-tight text-slate-900", className)} {...props} />;
}

function CardDescription({ className, ...props }) {
  return <p className={cn("text-sm text-slate-600", className)} {...props} />;
}

function CardContent({ className, ...props }) {
  return <div className={cn("space-y-4", className)} {...props} />;
}

export { Card, CardContent, CardDescription, CardHeader, CardTitle };
