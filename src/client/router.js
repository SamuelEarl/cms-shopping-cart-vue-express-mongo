import Vue from "vue";
import Router from "vue-router";
import store from "./store";
import Layout from "./views/layouts/Layout.vue";
import AuthLayout from "./views/layouts/AuthLayout.vue";
import LoginForm from "./views/auth/LoginForm.vue";
import RegisterForm from "./views/auth/RegisterForm.vue";
import ForgotPasswordForm from "./views/auth/ForgotPasswordForm.vue";
import SendEmailVerificationForm from "./views/auth/SendEmailVerificationForm.vue";
import EmailSent from "./views/auth/EmailSent.vue";
import VerifyEmail from "./views/auth/VerifyEmail.vue";
import ResetPassword from "./views/auth/ResetPassword.vue";
import PublicPage from "./views/pages-public/PublicPage.vue";
import Admin from "./views/pages-admin/Admin.vue";
import Users from "./views/pages-admin/Users.vue";
import PagesList from "./views/pages-admin/PagesList.vue";
import CreateEditPage from "./views/pages-admin/CreateEditPage.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      component: Layout,
      children: [
        {
          path: "",
          name: "home",
          component: PublicPage
        },
        {
          path: "page/:slug",
          name: "public-page",
          component: PublicPage
        },
        {
          path: "admin",
          component: Admin,
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "pages-list",
              name: "pages-list",
              component: PagesList
            },
            {
              path: "create-page/:sortPosition",
              name: "create-page",
              component: CreateEditPage
            },
            {
              path: "edit-page/:pageId",
              name: "edit-page",
              component: CreateEditPage
            },
            {
              path: "users",
              name: "users",
              component: Users
            }
          ]
        },
      ],
    },
    {
      path: "/",
      component: AuthLayout,
      children: [
        {
          path: "login",
          name: "login",
          component: LoginForm
        },
        {
          path: "register",
          name: "register",
          component: RegisterForm
        },
        {
          path: "forgot-password",
          name: "forgot-password",
          component: ForgotPasswordForm
        },
        {
          path: "send-email-verification",
          name: "send-email-verification",
          component: SendEmailVerificationForm
        },
        {
          path: "email-sent/:email",
          name: "email-sent",
          component: EmailSent
        },
        {
          path: "verify-email/:email/:token",
          name: "verify-email",
          component: VerifyEmail
        },
        {
          path: "reset-password/:email/:token",
          name: "reset-password",
          component: ResetPassword
        },
      ]
    }
  ]
});

// IMPORTANT NOTE:
// There is no need to manually check the user's auth status with every request or refresh their
// "isAuthenticated" or "scope" variables (which are stored in the browser) with every request. Each
// request that goes to the server will package up the cookie that was set when the user logged in.
// We already configured our routes on the server to check for authentication and scope, so our app
// is secure. It doesn't matter if a malicious user tampers with their cookie or their
// "isAuthenticated" or "scope" variables that are stored in the browser (in an attempt to gain
// access to things they are not allowed to) because everything is locked down on the server. For
// example, a malicious user could gain access to the admin pages if they set their
// "isAuthenticated" variable to true, but those pages would be blank. They wouldn't have access to
// see or alter the data, which is the most important thing.

// You can set a "requiresAuth: true" meta data property on each route that should be protected.
// For each protected route, check if the user is logged in before they are allowed access.
// If the user is not logged in, then redirect them to the login page.
router.beforeEach(async (to, from, next) => {
  // Store the previous route in Vuex. This is used to determine where to redirect users in the login flow.
  store.dispatch("helpers/setPrevRouteNameAction", from.name);

  if (to.matched.some(record => record.meta.requiresAuth)) {
    // If the user is not logged in, then redirect the user to the login page.
    const isAuthenticated = store.getters["auth/getIsAuthenticated"];
    if (!isAuthenticated) {
      next({
        path: "/login",
        query: { redirect: to.fullPath }
      });
    }
    // Otherwise continue with the request.
    else {
      next();
    }
  }
  else {
    next(); // Make sure to always call `next()`!
  }
});

export default router;
