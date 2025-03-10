// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $_layout from "./routes/_layout.tsx";
import * as $_middleware from "./routes/_middleware.ts";
import * as $about from "./routes/about.tsx";
import * as $api_auth_sign_in from "./routes/api/auth/sign-in.ts";
import * as $api_auth_sign_out from "./routes/api/auth/sign-out.ts";
import * as $api_auth_sign_up from "./routes/api/auth/sign-up.ts";
import * as $api_devices_name_ from "./routes/api/devices/[name].ts";
import * as $api_devices_index from "./routes/api/devices/index.ts";
import * as $auth_sign_in from "./routes/auth/sign-in.tsx";
import * as $auth_sign_up from "./routes/auth/sign-up.tsx";
import * as $charts_index from "./routes/charts/index.tsx";
import * as $compare_layout from "./routes/compare/_layout.tsx";
import * as $compare_index from "./routes/compare/index.tsx";
import * as $contact from "./routes/contact.tsx";
import * as $devices_name_ from "./routes/devices/[name].tsx";
import * as $devices_index from "./routes/devices/index.tsx";
import * as $devices_tags from "./routes/devices/tags.tsx";
import * as $index from "./routes/index.tsx";
import * as $privacy from "./routes/privacy.tsx";
import * as $profile from "./routes/profile.tsx";
import * as $release_timeline_layout from "./routes/release-timeline/_layout.tsx";
import * as $release_timeline_index from "./routes/release-timeline/index.tsx";
import * as $terms from "./routes/terms.tsx";
import * as $LayoutSelector from "./islands/LayoutSelector.tsx";
import * as $TagTypeahead from "./islands/TagTypeahead.tsx";
import * as $TimelineContent from "./islands/TimelineContent.tsx";
import * as $auth_sign_in_1 from "./islands/auth/sign-in.tsx";
import * as $auth_sign_out from "./islands/auth/sign-out.tsx";
import * as $auth_sign_up_1 from "./islands/auth/sign-up.tsx";
import * as $buttons_BackButton from "./islands/buttons/BackButton.tsx";
import * as $buttons_ClipboardButton from "./islands/buttons/ClipboardButton.tsx";
import * as $buttons_CompareButton from "./islands/buttons/CompareButton.tsx";
import * as $buttons_ShareButton from "./islands/buttons/ShareButton.tsx";
import * as $charts_DevicesPerBrandBarChart from "./islands/charts/DevicesPerBrandBarChart.tsx";
import * as $charts_DevicesPerRankingBarChart from "./islands/charts/DevicesPerRankingBarChart.tsx";
import * as $charts_DevicesPerReleaseYearLineChart from "./islands/charts/DevicesPerReleaseYearLineChart.tsx";
import * as $charts_DevicesRadarChart from "./islands/charts/DevicesRadarChart.tsx";
import * as $charts_DevicesSimilarRadarChart from "./islands/charts/DevicesSimilarRadarChart.tsx";
import * as $charts_FreshChart from "./islands/charts/FreshChart.tsx";
import * as $forms_DeviceComparisonForm from "./islands/forms/DeviceComparisonForm.tsx";
import * as $forms_DeviceSearchForm from "./islands/forms/DeviceSearchForm.tsx";
import * as $navigation_Breadcrumb from "./islands/navigation/Breadcrumb.tsx";
import * as $navigation_DesktopNav from "./islands/navigation/DesktopNav.tsx";
import * as $navigation_MobileNav from "./islands/navigation/MobileNav.tsx";
import * as $navigation_Navbar from "./islands/navigation/Navbar.tsx";
import * as $navigation_ThemeSwitcher from "./islands/navigation/ThemeSwitcher.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/_layout.tsx": $_layout,
    "./routes/_middleware.ts": $_middleware,
    "./routes/about.tsx": $about,
    "./routes/api/auth/sign-in.ts": $api_auth_sign_in,
    "./routes/api/auth/sign-out.ts": $api_auth_sign_out,
    "./routes/api/auth/sign-up.ts": $api_auth_sign_up,
    "./routes/api/devices/[name].ts": $api_devices_name_,
    "./routes/api/devices/index.ts": $api_devices_index,
    "./routes/auth/sign-in.tsx": $auth_sign_in,
    "./routes/auth/sign-up.tsx": $auth_sign_up,
    "./routes/charts/index.tsx": $charts_index,
    "./routes/compare/_layout.tsx": $compare_layout,
    "./routes/compare/index.tsx": $compare_index,
    "./routes/contact.tsx": $contact,
    "./routes/devices/[name].tsx": $devices_name_,
    "./routes/devices/index.tsx": $devices_index,
    "./routes/devices/tags.tsx": $devices_tags,
    "./routes/index.tsx": $index,
    "./routes/privacy.tsx": $privacy,
    "./routes/profile.tsx": $profile,
    "./routes/release-timeline/_layout.tsx": $release_timeline_layout,
    "./routes/release-timeline/index.tsx": $release_timeline_index,
    "./routes/terms.tsx": $terms,
  },
  islands: {
    "./islands/LayoutSelector.tsx": $LayoutSelector,
    "./islands/TagTypeahead.tsx": $TagTypeahead,
    "./islands/TimelineContent.tsx": $TimelineContent,
    "./islands/auth/sign-in.tsx": $auth_sign_in_1,
    "./islands/auth/sign-out.tsx": $auth_sign_out,
    "./islands/auth/sign-up.tsx": $auth_sign_up_1,
    "./islands/buttons/BackButton.tsx": $buttons_BackButton,
    "./islands/buttons/ClipboardButton.tsx": $buttons_ClipboardButton,
    "./islands/buttons/CompareButton.tsx": $buttons_CompareButton,
    "./islands/buttons/ShareButton.tsx": $buttons_ShareButton,
    "./islands/charts/DevicesPerBrandBarChart.tsx":
      $charts_DevicesPerBrandBarChart,
    "./islands/charts/DevicesPerRankingBarChart.tsx":
      $charts_DevicesPerRankingBarChart,
    "./islands/charts/DevicesPerReleaseYearLineChart.tsx":
      $charts_DevicesPerReleaseYearLineChart,
    "./islands/charts/DevicesRadarChart.tsx": $charts_DevicesRadarChart,
    "./islands/charts/DevicesSimilarRadarChart.tsx":
      $charts_DevicesSimilarRadarChart,
    "./islands/charts/FreshChart.tsx": $charts_FreshChart,
    "./islands/forms/DeviceComparisonForm.tsx": $forms_DeviceComparisonForm,
    "./islands/forms/DeviceSearchForm.tsx": $forms_DeviceSearchForm,
    "./islands/navigation/Breadcrumb.tsx": $navigation_Breadcrumb,
    "./islands/navigation/DesktopNav.tsx": $navigation_DesktopNav,
    "./islands/navigation/MobileNav.tsx": $navigation_MobileNav,
    "./islands/navigation/Navbar.tsx": $navigation_Navbar,
    "./islands/navigation/ThemeSwitcher.tsx": $navigation_ThemeSwitcher,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
