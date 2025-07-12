import BoxIcon from "@/assets/box.svg";
import CheckCircleIcon from "@/assets/check-circle.svg";
import ClockIcon from "@/assets/clock.svg";
import CoffeeIcon from "@/assets/coffee.svg";
import DatabaseIcon from "@/assets/database.svg";
import FeatherIcon from "@/assets/feather.svg";
import GithubIcon from "@/assets/github.svg";
import LinkedInIcon from "@/assets/linkedin.svg";
import ServerIcon from "@/assets/server.svg";
import SettingsIcon from "@/assets/settings.svg";
import SunriseIcon from "@/assets/sunrise.svg";
import SunsetIcon from "@/assets/sunset.svg";
import TrashIcon from "@/assets/trash.svg";
import TrelloIcon from "@/assets/trello.svg";
import TvIcon from "@/assets/tv.svg";
import YouTubeIcon from "@/assets/youtube.svg";
import ZapIcon from "@/assets/zap.svg";
import PlusCircleIcon from "@/assets/plus-circle.svg";
import EllipsisIcon from "@/assets/more-vertical.svg";

export const RESTRICTED_ICON_MAP = {
  PLUS_CIRCLE: PlusCircleIcon,
  ELLIPSIS: EllipsisIcon,
} as const;

export const APP_ICON_MAP = {
  BOX: BoxIcon,
  CHECK: CheckCircleIcon,
  CLOCK: ClockIcon,
  COFFEE: CoffeeIcon,
  DATABASE: DatabaseIcon,
  FEATHER: FeatherIcon,
  GITHUB: GithubIcon,
  LINKEDIN: LinkedInIcon,
  SERVER: ServerIcon,
  SETTINGS: SettingsIcon,
  SUNRISE: SunriseIcon,
  SUNSET: SunsetIcon,
  TRASH: TrashIcon,
  TRELLO: TrelloIcon,
  TV: TvIcon,
  YOUTUBE: YouTubeIcon,
  ZAP: ZapIcon,
} as const;

export const ICON_MAP = {
  ...RESTRICTED_ICON_MAP,
  ...APP_ICON_MAP,
} as const;

export type RestrictedIconKey = keyof typeof RESTRICTED_ICON_MAP;
export type AppIconKey = keyof typeof APP_ICON_MAP;
export type IconKey = RestrictedIconKey | AppIconKey;

export const APP_ICON_KEYS = Object.keys(APP_ICON_MAP) as AppIconKey[];
