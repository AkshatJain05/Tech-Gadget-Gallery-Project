import { FaSpinner } from "react-icons/fa";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center m-6 my-12 gap-4">
      <FaSpinner className="animate-spin text-5xl text-blue-600 drop-shadow-lg" />
      <p className="text-blue-600 font-medium text-lg animate-pulse">Loading...</p>
    </div>
  );
};

export default Loading;
