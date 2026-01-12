const AuthHeader = ({ title, subtitle, logoSrc = "/Logo.png" }) => {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 pt-10 pb-8 px-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="bg-white p-3 rounded-lg">
          <img 
            src={logoSrc} 
            alt="Logo" 
            className="w-12 h-12 object-contain"
          />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      <p className="text-blue-100 mt-1">{subtitle}</p>
    </div>
  );
};

export default AuthHeader;