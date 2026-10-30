import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiHome } from "react-icons/fi";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="grid min-h-[70vh] place-items-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-md">
        <p className="text-8xl font-extrabold text-[#00298d]">404</p>

        <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-gray-500">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 font-semibold hover:bg-gray-50"
          >
            <FiArrowLeft size={18} /> Go back
          </button>

          <Link
            to="/feed"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00298d] px-5 py-2.5 font-semibold text-white hover:opacity-90"
          >
            <FiHome size={18} /> Back to Feed
          </Link>
        </div>
      </div>
    </div>
  );
}