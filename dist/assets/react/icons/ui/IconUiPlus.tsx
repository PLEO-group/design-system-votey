import * as React from "react";
import type { SVGProps } from "react";
const SvgIconUiPlus = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={2}
      d="M12 5v14m-7-7h14"
    />
  </svg>
);
export default SvgIconUiPlus;
