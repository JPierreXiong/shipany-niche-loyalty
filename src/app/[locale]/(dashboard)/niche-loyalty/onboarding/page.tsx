/**
 * Onboarding Page
 * 4-step wizard for first-time setup
 */

'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Step1ConnectShopify } from './components/Step1ConnectShopify';
import { Step2BrandSetup } from './components/Step2BrandSetup';
import { Step3CreateCard } from './components/Step3CreateCard';
import { Step4SetAutomation } from './components/Step4SetAutomation';

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [onboardingData, setOnboardingData] = useState({
    shopifyConnected: false,
    brandSetup: {},
    cardCreated: null,
    automationCreated: null,
  });

  const steps = [
    { number: 1, title: 'Connect Shopify', component: Step1ConnectShopify },
    { number: 2, title: 'Brand Setup', component: Step2BrandSetup },
    { number: 3, title: 'Create First Card', component: Step3CreateCard },
    { number: 4, title: 'Set Automation', component: Step4SetAutomation },
  ];

  const handleStepComplete = (stepNumber: number, data: any) => {
    setCompletedSteps([...completedSteps, stepNumber]);
    setOnboardingData({ ...onboardingData, ...data });
    
    if (stepNumber < 4) {
      setCurrentStep(stepNumber + 1);
    } else {
      // Onboarding complete, redirect to dashboard
      window.location.href = '/niche-loyalty/dashboard';
    }
  };

  const handleSkipStep = (stepNumber: number) => {
    if (stepNumber < 4) {
      setCurrentStep(stepNumber + 1);
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome to Glow Niche Loyalty
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Set up your automated loyalty program in 4 simple steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mt-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                      completedSteps.includes(step.number)
                        ? 'border-green-500 bg-green-500'
                        : currentStep === step.number
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {completedSteps.includes(step.number) ? (
                      <CheckCircle className="h-6 w-6 text-white" />
                    ) : (
                      <span
                        className={`text-lg font-semibold ${
                          currentStep === step.number
                            ? 'text-white'
                            : 'text-gray-400'
                        }`}
                      >
                        {step.number}
                      </span>
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      currentStep === step.number
                        ? 'text-blue-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-4 h-0.5 flex-1 ${
                      completedSteps.includes(step.number)
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <div className="mt-12">
          <CurrentStepComponent
            onComplete={(data: any) => handleStepComplete(currentStep, data)}
            onSkip={() => handleSkipStep(currentStep)}
            data={onboardingData}
          />
        </div>
      </div>
    </div>
  );
}

