import { useState, ChangeEvent } from 'react';

type UseOnChangeHandlerReturnType<T> = [
  T, 
  React.Dispatch<React.SetStateAction<T>>, 
  (e: ChangeEvent<HTMLInputElement>) => void 
];

export const useOnChangeHandler = <T>(initial: T): UseOnChangeHandlerReturnType<T> => { 
  const [value, setValue] = useState(initial); 
  
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => { 
    setValue(e.target.value as unknown as T); 
  };   
  
  return [value, setValue, onChangeHandler]; 
};