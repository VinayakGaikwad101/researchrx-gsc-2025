import { useNavigate } from "react-router-dom";
import logoComponent from "../assets/logoComponent.png";

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 to-blue-200 flex items-center justify-center">
      <div className="max-w-3xl bg-white shadow-2xl rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              className="h-full w-full object-contain"
              src={logoComponent}
              alt="Logo"
            />
          </div>
          <div className="md:flex-shrink-0"></div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-teal-600 font-semibold">
              ResearchRX
            </div>
            <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Welcome to ResearchRX
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam,
              dolorum.
            </p>
            <div className="mt-6">
              <button
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out"
                onClick={handleGetStarted}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
