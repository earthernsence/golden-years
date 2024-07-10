export type Page = { route: string, text: string, leaves?: Array<Page & { description: string }> };
export type Leaf = Page & { description: string };

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
  },
  {
    route: "/teams",
    text: "Teams"
  },
  {
    route: "/members",
    text: "Members",
    leaves: [
      {
        route: "/members/executive",
        text: "Executive Team",
        description: "Meet the Executive Team of Golden Years!"
      },
      {
        route: "/members/volunteers",
        text: "Volunteer Team",
        description: "Meet the heart and soul of Golden Years -- our volunteers!"
      }
    ]
  }
];