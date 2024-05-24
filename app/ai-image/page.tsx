import DropDown, { DropDownProps } from "@/components/DropDown";
import React from "react";
const dropDownMockData: DropDownProps[] = [
  {
    buttonLabel: "Dropdown button1",
    ulItems: [
      {
        liLabel: "Action",
        href: "#",
      },
      {
        liLabel: "Another action",
        href: "#",
      },
      {
        liLabel: "Something else here",
        href: "#",
      },
    ],
  },
  {
    buttonLabel: "Dropdown button2",
    ulItems: [
      {
        liLabel: "Action",
        href: "#",
      },
      {
        liLabel: "Another action",
        href: "#",
      },
      {
        liLabel: "Something else here",
        href: "#",
      },
    ],
  },
];
const page = () => {
  return (
    <div className="">
      <DropDown items={dropDownMockData} />
    </div>
  );
};

export default page;
