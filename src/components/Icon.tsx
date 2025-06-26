import { type JSX } from "solid-js";
import { AppIconKey, ICON_MAP, type IconKey } from "../constants";
import { Dynamic } from "solid-js/web";

export interface IconProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
  icon: IconKey | AppIconKey;
}

export function Icon(props: IconProps) {
  return <Dynamic component={ICON_MAP[props.icon]} {...props} />;
}
