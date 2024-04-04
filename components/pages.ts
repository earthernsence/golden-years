export type Page = { route: string, text: string, leaves?: Array<Page> };

export const Pages: Array<Page> = [
  {
    route: "/",
    text: "Home"
  },
  {
    route: "/about_us",
    text: "About Us",
  },
  {
    route: "/events",
    text: "Events"
  }
];