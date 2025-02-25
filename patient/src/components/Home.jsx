import { useNavigate } from "react-router-dom";
import logoComponent from "../assets/logoComponent.png";

const Home = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl bg-white shadow-2xl rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              className="h-full w-full object-contain"
              src={logoComponent}
              alt="Logo"
            />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">
              ResearchRX
            </div>
            <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Welcome to ResearchRX
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam,
              illum!
            </p>
            <div className="mt-6">
              <button
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
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
