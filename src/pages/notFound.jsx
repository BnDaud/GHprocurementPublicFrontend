import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-peach px-6 text-center">
      <h1 className="text-9xl font-black text-purple opacity-20">404</h1>

      <div className="absolute">
        <h2 className="text-3xl md:text-5xl font-bold text-purple mb-4">
          Lost in Inventory?
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you are looking for has been moved, archived, or never
          existed in our catalog.
        </p>

        <Link
          to="/"
          className="inline-block bg-purple text-peach font-bold px-8 py-3 rounded-lg hover:scale-105 transition-transform duration-200 shadow-lg"
        >
          Back to Warehouse (Home)
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
