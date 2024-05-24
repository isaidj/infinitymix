"use client";
import React, { useRef } from "react";
import "./DropDown.css";
export interface DropDownProps {
  buttonLabel: string;
  ulItems: {
    liLabel: string;
    href: string;
  }[];
}

const DropDown = ({ items }: { items: DropDownProps[] }) => {
  const buttonsRef = useRef<HTMLButtonElement[]>([]);

  return (
    <div className="dropdown">
      {items.map((item, index) => {
        return (
          <div key={index} className="dropdown-item">
            <button
              // ref={(el) => (buttonsRef.current[index] = el)}
              className="dropdown-button"
              ref={(el) => {
                buttonsRef.current[index] = el as HTMLButtonElement;
              }}
              onClick={() => {
                buttonsRef.current[index].classList.toggle("active");
              }}
            >
              {item.buttonLabel}
            </button>
            <ul>
              {item.ulItems.map((li, index) => {
                return (
                  <li key={index}>
                    <a href={li.href}>{li.liLabel}</a>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default DropDown;
