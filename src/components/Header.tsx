import React from "react";
import useStartRedirect from "../hooks/useStartRedirect";

const Header: React.FC = () => {
  const { start } = useStartRedirect();

  return (
    <div className="pt-100 pl-200">
      <button onClick={start} className="btn btn-primary">
        Start Quiz
      </button>
    </div>
  );
};

export default Header;
