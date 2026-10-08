import { Link } from "react-router-dom";

export function Logo({ className = "h-14 sm:h-[78px]" }: { className?: string }) {
  return (
    <Link to="/" className="flex min-w-0 shrink items-center">
      <img src="/logo.png" alt="Stories from the Soil" className={`${className} w-auto`} />
    </Link>
  );
}
