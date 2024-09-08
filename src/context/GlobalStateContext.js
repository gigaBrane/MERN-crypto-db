import React, { createContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  user: null,
  token: null, // Include token in state
  selectedCrypto: null,
  cryptos: [],
};

// Create context
export const GlobalStateContext = createContext(initialState);
export const GlobalDispatchContext = createContext(() => {});

// Reducer function to manage state updates
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload.user, token: action.payload.token };
    case 'SET_SELECTED_CRYPTO':
      return { ...state, selectedCrypto: action.payload };
    case 'SET_CRYPTOS':
      return { ...state, cryptos: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, token: null }; // Clear user and token on logout
    default:
      return state;
  }
};

// GlobalStateProvider component
export const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Check localStorage for token and user when the app loads
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      dispatch({ type: 'SET_USER', payload: { user: JSON.parse(storedUser), token: storedToken } });
    }
  }, []); // Run only once when app loads

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
};
