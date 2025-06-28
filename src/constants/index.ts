import type { Component, JSX } from "solid-js";
import { z } from "zod/v4";

import BoxIcon from "../assets/box.svg";
import CheckCircleIcon from "../assets/check-circle.svg";
import ClockIcon from "../assets/clock.svg";
import CoffeeIcon from "../assets/coffee.svg";
import DatabaseIcon from "../assets/database.svg";
import FeatherIcon from "../assets/feather.svg";
import GithubIcon from "../assets/github.svg";
import LinkedInIcon from "../assets/linkedin.svg";
import ServerIcon from "../assets/server.svg";
import SettingsIcon from "../assets/settings.svg";
import SunriseIcon from "../assets/sunrise.svg";
import SunsetIcon from "../assets/sunset.svg";
import TrashIcon from "../assets/trash.svg";
import TrelloIcon from "../assets/trello.svg";
import TvIcon from "../assets/tv.svg";
import YouTubeIcon from "../assets/youtube.svg";
import ZapIcon from "../assets/zap.svg";
import PlusCircleIcon from "../assets/plus-circle.svg";

export enum AppIconKey {
  PLUS_CIRCLE = "plusCircle",
}

export enum IconKey {
  BOX = "box",
  CHECK = "check",
  CLOCK = "clock",
  COFFEE = "coffee",
  DATABASE = "database",
  FEATHER = "feather",
  GITHUB = "github",
  LINKEDIN = "linkedin",
  SERVER = "server",
  SETTINGS = "settings",
  SUNRISE = "sunrise",
  SUNSET = "sunset",
  TRASH = "trash",
  TRELLO = "trello",
  TV = "tv",
  YOUTUBE = "youtube",
  ZAP = "zap",
}

export const ICON_KEYS = Object.values(IconKey);

export const ICON_MAP: Record<
  IconKey | AppIconKey,
  Component<JSX.SvgSVGAttributes<SVGSVGElement>>
> = {
  [IconKey.BOX]: BoxIcon,
  [IconKey.CHECK]: CheckCircleIcon,
  [IconKey.CLOCK]: ClockIcon,
  [IconKey.COFFEE]: CoffeeIcon,
  [IconKey.DATABASE]: DatabaseIcon,
  [IconKey.FEATHER]: FeatherIcon,
  [IconKey.GITHUB]: GithubIcon,
  [IconKey.LINKEDIN]: LinkedInIcon,
  [IconKey.SERVER]: ServerIcon,
  [IconKey.SETTINGS]: SettingsIcon,
  [IconKey.SUNRISE]: SunriseIcon,
  [IconKey.SUNSET]: SunsetIcon,
  [IconKey.TRASH]: TrashIcon,
  [IconKey.TRELLO]: TrelloIcon,
  [IconKey.TV]: TvIcon,
  [IconKey.YOUTUBE]: YouTubeIcon,
  [IconKey.ZAP]: ZapIcon,
  [AppIconKey.PLUS_CIRCLE]: PlusCircleIcon,
};

export const READONLY_LIST_NAMES = ["completed", "todomino", "today"] as const;

export const INIT_LIST_NAMES = ["reminders"] as const;

export const LIST_UNION = z.union([z.enum(INIT_LIST_NAMES), z.string().min(1)]);

export const TODO_FORM_SCHEMA = z.object({
  description: z.string().min(1),
  dependsOn: z.string().optional(),
  list: LIST_UNION,
});

// const HEX_COLOR_REGEX =
//   /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
