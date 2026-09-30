import { useContext } from 'react';
import { CheckoutContext } from '../context/CheckoutContext';

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  return context || {};
};

export default useCheckout;
