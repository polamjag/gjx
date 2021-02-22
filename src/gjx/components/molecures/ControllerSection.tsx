import React from "react";

interface Props {
  title?: string;
}

export const ControllerSection: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="controller-section">
      {title && <h3 className="controller-section__title">{title}</h3>}
      {children}
    </div>
  );
};
