import { FaCheck } from 'react-icons/fa';

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === currentStep;
          const isDone = i < currentStep;

          return (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg scale-110'
                      : isDone
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {isDone ? <FaCheck /> : <Icon />}
                </div>
                <p
                  className={`text-xs mt-2 text-center font-medium ${
                    isActive
                      ? 'text-blue-600'
                      : isDone
                        ? 'text-green-600'
                        : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 ${
                    isDone ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;