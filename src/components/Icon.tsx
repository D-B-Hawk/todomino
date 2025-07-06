import { type JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import { AppIconKey, ICON_MAP, type IconKey } from "@/constants";

export interface IconProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
  icon: IconKey | AppIconKey;
}

export function Icon(props: IconProps) {
  return <Dynamic component={ICON_MAP[props.icon]} {...props} />;
}
