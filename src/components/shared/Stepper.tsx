import React, { useState, ReactNode } from 'react';
import { Button } from "@/components/ui/button";

interface StepProps {
  children: ReactNode;
  isValid?: boolean;
}

export function Step({ children }: StepProps) {
  return <div>{children}</div>;
}

interface StepperProps {
  children: React.ReactElement<StepProps>[];
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  backButtonText?: string;
  nextButtonText?: string;
  finalButtonText?: string;
}

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange,
  onFinalStepCompleted,
  backButtonText = "Previous",
  nextButtonText = "Next",
  finalButtonText = "Complete"
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const totalSteps = children.length;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      onStepChange?.(newStep);
    } else {
      onFinalStepCompleted?.();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      onStepChange?.(newStep);
    }
  };

  const currentChild = children[currentStep - 1];
  const isValid = currentChild.props.isValid ?? true;

  return (
    <div className="space-y-8">
      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-12">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500
                  ${isActive 
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-500/25' 
                    : isCompleted 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-zinc-700 text-zinc-400 border border-zinc-600'
                  }
                `}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              
              {stepNumber < totalSteps && (
                <div 
                  className={`
                    w-16 h-px transition-colors duration-500
                    ${stepNumber < currentStep ? 'bg-emerald-500' : 'bg-zinc-600'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px] flex flex-col">
        <div className="flex-grow">
          {currentChild}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-8 mt-8 border-t border-zinc-700/50">
          <Button
            onClick={handleBack}
            disabled={currentStep === 1}
            variant="outline"
            className="bg-transparent border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed h-12 px-8"
          >
            {backButtonText}
          </Button>

          <div className="text-zinc-400 text-sm font-light">
            Step {currentStep} of {totalSteps}
          </div>

          <Button
            onClick={handleNext}
            disabled={!isValid}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white border-0 h-12 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === totalSteps ? finalButtonText : nextButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
}