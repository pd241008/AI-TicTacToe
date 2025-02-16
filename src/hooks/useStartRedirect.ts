import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useStartRedirect = (initialState: boolean = false, redirectPath: string = "/quiz") => {
  const [started, setStarted] = useState<boolean>(initialState);
  const navigate = useNavigate();

  useEffect(() => {
    if (started) {
      navigate(redirectPath);
    }
  }, [started, navigate, redirectPath]);

  const start = () => {
    setStarted(true);
  };

  return { start, started };
};

export default useStartRedirect;
