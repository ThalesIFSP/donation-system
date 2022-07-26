const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("pages/IndexPage.vue"),
      },
    ],
    meta: { requireLogin: true },
  },
  {
    path: "/login",
    component: () => import("layouts/Login.vue"),
    children: [
      { path: "", name: "sign_in", component: () => import("pages/Login.vue") },
    ],
  },
  {
    path: "/myprofile",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "my_profile",
        component: () => import("pages/MyProfile.vue"),
      },
    ],
    meta: { requireLogin: true },
  },
  {
    path: "/organization",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "organization",
        component: () => import("pages/Organization.vue"),
      },
    ],
    meta: { requireLogin: true },
  },
  {
    path: "/moderators",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "moderators",
        component: () => import("pages/Moderators.vue"),
      },
    ],
    meta: { requireLogin: true },
  },
  {
    path: "/donations",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "donations",
        component: () => import("pages/Donations.vue"),
      },
    ],
    meta: { requireLogin: true },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
