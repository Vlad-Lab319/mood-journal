// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// const isProtectedRoute = createRouteMatcher([
//   '/journal(.*)',
//   '/new-user',
// ]);

// export default clerkMiddleware((auth, request) => {
//   if(isProtectedRoute(request)) {
//     auth().protect();
//   }
// });

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// }



import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/', '/test', '/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware((auth, request) => {
  if(!isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}