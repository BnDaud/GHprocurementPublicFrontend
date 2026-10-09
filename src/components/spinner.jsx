import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Spinner({ className = "" }) {
  return <AiOutlineLoading3Quarters aria-label="Loading" className={`animate-spin ${className}`} />;
}
