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
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
