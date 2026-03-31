// Test data for SauceDemo application
export const users = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce',
    description: 'Standard user - can login and perform all actions'
  },
  lockedOut: {
    username: 'locked_out_user',
    password: 'secret_sauce',
    description: 'Locked out user - should see error message on login'
  },
  problem: {
    username: 'problem_user',
    password: 'secret_sauce',
    description: 'Problem user - may have image loading issues'
  },
  performanceGlitch: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
    description: 'Performance glitch user - slow response times'
  },
  error: {
    username: 'error_user',
    password: 'secret_sauce',
    description: 'Error user - may encounter various errors'
  },
  visual: {
    username: 'visual_user',
    password: 'secret_sauce',
    description: 'Visual user - for visual testing'
  }
};

// User type enumeration
export enum UserType {
  STANDARD = 'standard',
  LOCKED_OUT = 'lockedOut',
  PROBLEM = 'problem',
  PERFORMANCE_GLITCH = 'performanceGlitch',
  ERROR = 'error',
  VISUAL = 'visual'
}

// Get user credentials by type
export function getUser(userType: UserType) {
  return users[userType];
}

// List of all users for parameterized testing
export const allUsers = [
  UserType.STANDARD,
  UserType.LOCKED_OUT,
  UserType.PROBLEM,
  UserType.PERFORMANCE_GLITCH,
  UserType.ERROR,
  UserType.VISUAL
];

export const checkoutInfo = {
  firstName: 'John',
  lastName: 'Doe',
  postalCode: '12345'
};

export const items = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
  fleeceJacket: 'Sauce Labs Fleece Jacket',
  onesie: 'Sauce Labs Onesie',
  redShirt: 'Test.allTheThings() T-Shirt (Red)'
};