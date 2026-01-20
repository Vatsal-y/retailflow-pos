import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SubscriptionPlan = 'starter' | 'professional' | 'enterprise';
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trialing';

export interface Subscription {
  id: string;
  storeId: string;
  storeName: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  priceMonthly: number;
  billingCycle: 'monthly' | 'yearly';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEndsAt?: string;
  cancelledAt?: string;
  createdAt: string;
}

export interface PlanDetails {
  name: SubscriptionPlan;
  displayName: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  maxBranches: number;
  maxEmployees: number;
  maxProducts: number;
}

interface SubscriptionState {
  subscriptions: Subscription[];
  currentSubscription: Subscription | null;
  plans: PlanDetails[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  subscriptions: [],
  currentSubscription: null,
  plans: [
    {
      name: 'starter',
      displayName: 'Starter',
      priceMonthly: 29,
      priceYearly: 290,
      features: ['1 Branch', '5 Employees', '100 Products', 'Basic Reports'],
      maxBranches: 1,
      maxEmployees: 5,
      maxProducts: 100,
    },
    {
      name: 'professional',
      displayName: 'Professional',
      priceMonthly: 79,
      priceYearly: 790,
      features: ['5 Branches', '25 Employees', 'Unlimited Products', 'Advanced Analytics', 'Priority Support'],
      maxBranches: 5,
      maxEmployees: 25,
      maxProducts: -1,
    },
    {
      name: 'enterprise',
      displayName: 'Enterprise',
      priceMonthly: 199,
      priceYearly: 1990,
      features: ['Unlimited Branches', 'Unlimited Employees', 'Unlimited Products', 'Custom Integrations', '24/7 Support', 'Dedicated Account Manager'],
      maxBranches: -1,
      maxEmployees: -1,
      maxProducts: -1,
    },
  ],
  isLoading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscriptions: (state, action: PayloadAction<Subscription[]>) => {
      state.subscriptions = action.payload;
    },
    setCurrentSubscription: (state, action: PayloadAction<Subscription | null>) => {
      state.currentSubscription = action.payload;
    },
    updateSubscription: (state, action: PayloadAction<Subscription>) => {
      const index = state.subscriptions.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.subscriptions[index] = action.payload;
      }
      if (state.currentSubscription?.id === action.payload.id) {
        state.currentSubscription = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setSubscriptions, setCurrentSubscription, updateSubscription, setLoading, setError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
