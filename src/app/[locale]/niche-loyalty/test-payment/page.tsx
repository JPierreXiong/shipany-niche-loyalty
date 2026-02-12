'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, CreditCard, Check } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function TestPaymentPage() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  const plans = [
    {
      id: 'glow_base',
      name: 'Studio Plan',
      price: '$19.9/month',
      productId: 'prod_5bo10kkVzObfuZIjUglgI0',
      features: ['Up to 500 members', 'Custom branding', 'Advanced analytics'],
    },
    {
      id: 'glow_pro',
      name: 'Atelier Plan',
      price: '$59.9/month',
      productId: 'prod_1lQWMwrdWZFzo6AgpVcCc7',
      features: ['Unlimited members', 'White-label', 'Dedicated support'],
    },
  ];

  const handleCheckout = async (productId: string, planName: string) => {
    setLoading(true);
    setSelectedPlan(productId);

    try {
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          payment_provider: 'creem',
          locale: 'en',
          metadata: {
            plan_name: planName,
            test: true,
          },
        }),
      });

      const data = await response.json();

      if (response.ok && data.data?.checkoutUrl) {
        toast.success('Redirecting to payment...');
        window.location.href = data.data.checkoutUrl;
      } else {
        toast.error(data.message || 'Failed to create checkout session');
        console.error('Checkout error:', data);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to initiate checkout');
    } finally {
      setLoading(false);
      setSelectedPlan('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">
            Test Creem Payment Integration
          </h1>
          <p className="text-stone-600 text-lg">
            Click on a plan below to test the payment flow
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {plans.map((plan) => (
            <Card key={plan.id} className="relative">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.price}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm">
                      <Check className="w-4 h-4 text-green-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleCheckout(plan.id, plan.name)}
                  disabled={loading}
                  className="w-full"
                >
                  {loading && selectedPlan === plan.productId ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Test Checkout
                    </>
                  )}
                </Button>
                <p className="text-xs text-stone-500 mt-2 text-center">
                  Product ID: {plan.productId}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Configuration Check</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-blue-800">Payment Provider:</span>
              <span className="font-mono text-blue-900">Creem</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-800">Environment:</span>
              <span className="font-mono text-blue-900">Sandbox</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-800">API Endpoint:</span>
              <span className="font-mono text-blue-900">/api/payment/checkout</span>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Testing Notes:</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Make sure you're signed in before testing</li>
            <li>• Use Creem test cards for sandbox environment</li>
            <li>• Check console for detailed error messages</li>
            <li>• Verify CREEM_API_KEY and CREEM_PRODUCT_IDS are set in environment variables</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

