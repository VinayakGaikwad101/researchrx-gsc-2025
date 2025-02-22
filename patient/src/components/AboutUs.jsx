const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-6">
            About ResearchRX
          </h1>
          <p className="text-gray-700 mb-6 text-lg leading-relaxed">
            At ResearchRX, we are committed to providing top-notch healthcare
            services to our patients. Our team of experienced professionals
            ensures you receive the best consultation and care.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Our mission is to make healthcare accessible and convenient for
            everyone. We believe in the power of technology to improve lives and
            are constantly innovating to serve you better.
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href="/contact"
              className="bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition duration-300 text-lg font-semibold"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
