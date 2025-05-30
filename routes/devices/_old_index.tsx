// import { FreshContext, PageProps } from "$fresh/server.ts";
// import { DeviceCardLarge } from "../../components/cards/DeviceCardLarge.tsx";
// import { DeviceCardMedium } from "../../components/cards/DeviceCardMedium.tsx";
// import { DeviceCardRow } from "../../components/cards/DeviceCardRow.tsx";
// import SEO from "../../components/SEO.tsx";
// import { PaginationNav } from "../../components/shared/PaginationNav.tsx";
// import { Device } from "../../data/frontend/contracts/device.model.ts";
// import { TagModel } from "../../data/frontend/models/tag.model.ts";
// import { DeviceService } from "../../data/frontend/services/devices/device.service.ts";
// import { DeviceSearchForm } from "../../islands/forms/DeviceSearchForm.tsx";
// import { LayoutSelector } from "../../islands/layout-selector.tsx";

// export const handler = {
//   async GET(_: Request, ctx: FreshContext) {
//     const deviceService = await DeviceService.getInstance();
//     const searchParams = new URLSearchParams(ctx.url.search);

//     const searchQuery = searchParams.get("search") || "";
//     const searchCategory = searchParams.get("category") || "all";
//     const pageNumber = parseInt(searchParams.get("page") || "1");
//     const sortBy = searchParams.get("sort") as
//       | "all"
//       | "highly-ranked"
//       | "new-arrivals"
//       | "high-low-price"
//       | "low-high-price"
//       | "alphabetical"
//       | "reverse-alphabetical" ||
//       "all";

//     const filter = searchParams.get("filter") as
//       | "all"
//       | "upcoming"
//       | "personal-picks" ||
//       "all";

//     const tagsParam = searchParams.get("tags");
//     const parsedTags = tagsParam ? tagsParam.split(",") : [];

//     const initialTags = (await Promise.all(
//       parsedTags.map((slug) => deviceService.getTagBySlug(slug)),
//     )).filter((tag) => tag !== null && tag.slug !== "") as TagModel[];

//     const allDevices = (await deviceService.getAllDevices())
//       .sort((a, b) => {
//         const dateA = a.released.mentionedDate
//           ? new Date(a.released.mentionedDate)
//           : new Date(0);
//         const dateB = b.released.mentionedDate
//           ? new Date(b.released.mentionedDate)
//           : new Date(0);
//         return dateB.getTime() - dateA.getTime();
//       });

//     const defaultTags = [
//       ...(await deviceService.getTagsBySlugs(
//         [
//           "low",
//           "mid",
//           "high",
//           "upcoming",
//           "personal-pick",
//           "year-2025",
//           "year-2024",
//           "anbernic",
//           "miyoo-bittboy",
//           "ayaneo",
//           "steam-os",
//           "clamshell",
//           "horizontal",
//           "vertical",
//           "micro",
//           "oled",
//         ],
//       )),
//     ];

//     // Get layout from URL params first, then localStorage, then default to "grid4"
//     const urlLayout = searchParams.get("layout") as string;
//     const activeLayout = urlLayout || "grid9";

//     const getPageSize = (activeLayout: string) => {
//       switch (activeLayout) {
//         case "grid9":
//           return 9;
//         case "grid4":
//           return 8;
//         default:
//           return 20;
//       }
//     };

//     const pageSize = searchParams.get("pageSize")
//       ? parseInt(
//         searchParams.get("pageSize") ??
//           getPageSize(activeLayout).toString(),
//       )
//       : getPageSize(activeLayout);

//     const getMaxPageSize = () => {
//       if (pageSize > 100) {
//         return 10;
//       }

//       return pageSize;
//     };

//     const pagedFilteredSortedDevices = await deviceService.searchDevices(
//       searchQuery,
//       searchCategory as "all" | "low" | "mid" | "high",
//       sortBy,
//       filter,
//       initialTags,
//       pageNumber,
//       getMaxPageSize(),
//     );

//     const hasResults = pagedFilteredSortedDevices.page.length > 0;
//     const pageResults = pagedFilteredSortedDevices.page;
//     const amountOfResults = pagedFilteredSortedDevices.totalAmountOfResults;

//     const hasNextPage =
//       pageNumber < Math.ceil(amountOfResults / getPageSize(activeLayout));

//     return ctx.render({
//       pageSize,
//       maxPageSize: getMaxPageSize(),
//       searchQuery,
//       searchCategory,
//       sortBy,
//       filter,
//       initialTags,
//       pageNumber,
//       defaultTags,
//       activeLayout,
//       allDevices,
//       hasResults,
//       devices: pageResults,
//       totalAmountOfResults: amountOfResults,
//       hasNextPage,
//       hasPreviousPage: pageNumber > 1,
//       user: ctx.state.user,
//     });
//   },
// };

// export default function DevicesIndex({ url, data }: PageProps) {
//   const maxPageSize = data.maxPageSize;
//   const pageSize = data.pageSize;
//   const hasNextPage = data.hasNextPage;
//   const searchQuery = data.searchQuery;
//   const searchCategory = data.searchCategory;
//   const sortBy = data.sortBy;
//   const filter = data.filter;
//   const initialTags = data.initialTags;
//   const pageNumber = data.pageNumber;
//   const defaultTags = data.defaultTags;
//   const activeLayout = data.activeLayout;
//   const allDevices = data.allDevices;
//   const hasResults = data.hasResults;
//   const pageResults = data.devices as Device[];
//   const amountOfResults = data.totalAmountOfResults;
//   const user = data.user;

//   const getLayoutGrid = (layout: string) => {
//     if (layout === "grid9") {
//       return "device-search-grid-9";
//     }
//     if (layout === "grid4") {
//       return "device-search-grid-4";
//     }
//     return "device-search-list";
//   };

//   const getPageSize = (activeLayout: string) => {
//     switch (activeLayout) {
//       case "grid9":
//         return 9;
//       case "grid4":
//         return 8;
//       default:
//         return 20;
//     }
//   };

//   return (
//     <div class="devices-page">
//       <SEO
//         title="Device Catalog"
//         description="Browse our catalog of retro gaming handhelds with specs."
//         url={`https://retroranker.site${url.pathname}`}
//         keywords="retro gaming handhelds, emulation devices, retro console comparison, handheld gaming systems, retro gaming devices catalog, Anbernic devices, Miyoo handhelds, retro gaming specs, portable emulation systems"
//       >
//         <script
//           type="application/ld+json"
//           // deno-lint-ignore react-no-danger
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify({
//               "@context": "https://schema.org",
//               "@type": "BreadcrumbList",
//               "itemListElement": [
//                 {
//                   "@type": "ListItem",
//                   "position": 1,
//                   "name": "Home",
//                   "item": "https://retroranker.site",
//                 },
//                 {
//                   "@type": "ListItem",
//                   "position": 2,
//                   "name": "Device Catalog",
//                   "item": "https://retroranker.site/devices",
//                 },
//               ],
//             }),
//           }}
//         />
//         {pageNumber > 1 && (
//           <link
//             rel="prev"
//             href={`/devices?page=${pageNumber - 1}&category=${searchCategory}`}
//           />
//         )}
//         {hasNextPage && (
//           <link
//             rel="next"
//             href={`/devices?page=${pageNumber + 1}&category=${searchCategory}`}
//           />
//         )}
//       </SEO>
//       <header>
//         <hgroup style={{ textAlign: "center" }}>
//           <h1>Device Catalog</h1>
//           <p>
//             Search through{" "}
//             <span style={{ color: "var(--pico-primary)" }}>
//               {allDevices.length}
//             </span>{" "}
//             devices
//           </p>
//           <a
//             f-client-nav={false}
//             style={{ fontSize: "0.8rem" }}
//             href="/devices/tags"
//           >
//             Advanced Search by tags
//           </a>
//         </hgroup>
//       </header>

//       {/* <Partial name="search-results"> */}
//       <DeviceSearchForm
//         initialSearch={searchQuery}
//         initialCategory={searchCategory}
//         initialSort={sortBy}
//         initialFilter={filter}
//         initialPage={pageNumber}
//         initialTags={initialTags}
//         defaultTags={defaultTags}
//         activeLayout={activeLayout}
//       />

//       <hr />
//       <div>
//         {
//           <LayoutSelector
//             activeLayout={activeLayout}
//             initialPageSize={pageSize}
//             defaultPageSize={getPageSize(activeLayout)}
//           />
//         }
//       </div>

//       {hasResults && (
//         <PaginationNav
//           pageNumber={pageNumber}
//           pageSize={maxPageSize}
//           totalResults={amountOfResults}
//           searchQuery={searchQuery}
//           searchCategory={searchCategory}
//           sortBy={sortBy}
//           filter={filter}
//           activeLayout={activeLayout}
//           tags={initialTags}
//         />
//       )}

//       {!hasResults
//         ? (
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               marginTop: "1rem",
//             }}
//           >
//             <p>No results found for your search criteria.</p>
//           </div>
//         )
//         : (
//           <div class={getLayoutGrid(activeLayout)} f-client-nav={false}>
//             {pageResults.map((device) => (
//               <>
//                 <a
//                   href={`/devices/${device.name.sanitized}`}
//                   style={{
//                     textDecoration: "none",
//                     width: "100%",
//                   }}
//                 >
//                   {activeLayout === "grid9" && (
//                     <DeviceCardMedium
//                       device={device}
//                       isActive={false}
//                       user={user}
//                     />
//                   )}

//                   {activeLayout === "grid4" && (
//                     <DeviceCardLarge device={device} />
//                   )}

//                   {activeLayout === "list" && <DeviceCardRow device={device} />}
//                 </a>
//               </>
//             ))}
//           </div>
//         )}

//       {hasResults && (
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             marginTop: "1rem",
//           }}
//         >
//           <PaginationNav
//             pageNumber={pageNumber}
//             pageSize={maxPageSize}
//             totalResults={amountOfResults}
//             searchQuery={searchQuery}
//             searchCategory={searchCategory}
//             sortBy={sortBy}
//             filter={filter}
//             activeLayout={activeLayout}
//             tags={initialTags}
//           />
//         </div>
//       )}

//       {/* FAQ Section Start */}
//       {/* FAQ Section End */}

//       {/* </Partial> */}
//     </div>
//   );
// }
