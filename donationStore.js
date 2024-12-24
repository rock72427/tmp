import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialDonorDetails = {
  title: "",
  name: "",
  phone: "",
  deeksha: "",
  roomNo: "",
  email: "",
  identityType: "Aadhaar",
  identityNumber: "",
  pincode: "",
  state: "",
  district: "",
  postOffice: "",
  flatNo: "",
  streetName: "",
};

const initialDonationDetails = {
  purpose: "",
  specifiedPurpose: "",
  donationType: "Others (Revenue)",
  amount: "",
  panNumber: "",
  transactionType: "Cash",
  inMemoryOf: "",
};

const initialTransactionDetails = {
  date: "",
  transactionId: "",
  bankName: "",
  branchName: "",
};

const initialTabState = {
  math: {
    donorDetails: { ...initialDonorDetails },
    donationDetails: { ...initialDonationDetails },
    transactionDetails: { ...initialTransactionDetails },
  },
  mission: {
    donorDetails: { ...initialDonorDetails },
    donationDetails: { ...initialDonationDetails },
    transactionDetails: { ...initialTransactionDetails },
  },
  activeSection: "math",
};

const useDonationStore = create(
  persist(
    (set) => ({
      donorTabs: {
        1: { ...initialTabState },
      },
      activeTabId: 1,

      // Reset store to initial state
      resetStore: () =>
        set({
          donorTabs: {
            1: { ...initialTabState },
          },
          activeTabId: 1,
        }),

      // Reset specific tab to initial state
      resetTab: (tabId) =>
        set((state) => ({
          donorTabs: {
            ...state.donorTabs,
            [tabId]: { ...initialTabState },
          },
        })),

      // Add new donor tab
      addNewDonorTab: () =>
        set((state) => {
          const newTabId =
            Math.max(...Object.keys(state.donorTabs).map(Number)) + 1;
          return {
            donorTabs: {
              ...state.donorTabs,
              [newTabId]: { ...initialTabState },
            },
            activeTabId: newTabId,
          };
        }),

      // Remove donor tab
      removeDonorTab: (tabId) =>
        set((state) => {
          const newDonorTabs = { ...state.donorTabs };
          delete newDonorTabs[tabId];

          // If we're deleting the active tab, switch to the last remaining tab
          const remainingTabs = Object.keys(newDonorTabs).map(Number);
          const newActiveTabId =
            state.activeTabId === tabId
              ? Math.max(...remainingTabs)
              : state.activeTabId;

          return {
            donorTabs: newDonorTabs,
            activeTabId: newActiveTabId,
          };
        }),

      // Set active tab
      setActiveTab: (tabId) =>
        set({
          activeTabId: tabId,
        }),

      // Set active section (math/mission)
      setActiveSection: (tabId, section) =>
        set((state) => ({
          donorTabs: {
            ...state.donorTabs,
            [tabId]: {
              ...state.donorTabs[tabId],
              activeSection: section,
            },
          },
        })),

      // Update donor details
      updateDonorDetails: (tabId, section, details) =>
        set((state) => ({
          donorTabs: {
            ...state.donorTabs,
            [tabId]: {
              ...state.donorTabs[tabId],
              [section]: {
                ...state.donorTabs[tabId][section],
                donorDetails: {
                  ...state.donorTabs[tabId][section].donorDetails,
                  ...details,
                },
              },
            },
          },
        })),

      // Update donation details
      updateDonationDetails: (tabId, section, details) =>
        set((state) => ({
          donorTabs: {
            ...state.donorTabs,
            [tabId]: {
              ...state.donorTabs[tabId],
              [section]: {
                ...state.donorTabs[tabId][section],
                donationDetails: {
                  ...state.donorTabs[tabId][section].donationDetails,
                  ...details,
                },
              },
            },
          },
        })),

      // Update transaction details
      updateTransactionDetails: (tabId, section, details) =>
        set((state) => ({
          donorTabs: {
            ...state.donorTabs,
            [tabId]: {
              ...state.donorTabs[tabId],
              [section]: {
                ...state.donorTabs[tabId][section],
                transactionDetails: {
                  ...state.donorTabs[tabId][section].transactionDetails,
                  ...details,
                },
              },
            },
          },
        })),

      // Copy donor details from math to mission or vice versa
      copyDonorDetails: (tabId, fromSection, toSection) =>
        set((state) => ({
          donorTabs: {
            ...state.donorTabs,
            [tabId]: {
              ...state.donorTabs[tabId],
              [toSection]: {
                ...state.donorTabs[tabId][toSection],
                donorDetails: {
                  ...state.donorTabs[tabId][fromSection].donorDetails,
                },
              },
            },
          },
        })),
    }),
    {
      name: "donation-store", // unique name for localStorage
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    }
  )
);

export default useDonationStore;
