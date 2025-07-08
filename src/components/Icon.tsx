import { type JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import type { IconKey } from "@/types";
import { ICON_MAP } from "@/constants/icons";

export interface IconProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
  icon: IconKey;
}

export function Icon(props: IconProps) {
  return <Dynamic component={ICON_MAP[props.icon]} {...props} />;
}
