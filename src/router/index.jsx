import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Lazy load all page components
const Layout = lazy(() => import('@/components/organisms/Layout'));
const BoardList = lazy(() => import('@/components/pages/BoardList'));
const BoardView = lazy(() => import('@/components/pages/BoardView'));
const Login = lazy(() => import('@/components/pages/Login'));
const Signup = lazy(() => import('@/components/pages/Signup'));
const Callback = lazy(() => import('@/components/pages/Callback'));
const ErrorPage = lazy(() => import('@/components/pages/ErrorPage'));
const ResetPassword = lazy(() => import('@/components/pages/ResetPassword'));
const PromptPassword = lazy(() => import('@/components/pages/PromptPassword'));
const NotFound = lazy(() => import('@/components/pages/NotFound'));

const loadingFallback = (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
);

// Define main routes
const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={loadingFallback}>
        <BoardList />
      </Suspense>
    )
  },
  {
    path: "boards",
    element: (
      <Suspense fallback={loadingFallback}>
        <BoardList />
      </Suspense>
    )
  },
  {
    path: "recent",
    element: (
      <Suspense fallback={loadingFallback}>
        <BoardList />
      </Suspense>
    )
  },
  {
    path: "favorites",
    element: (
      <Suspense fallback={loadingFallback}>
        <BoardList />
      </Suspense>
    )
  },
  {
    path: "board/:boardId",
    element: (
      <Suspense fallback={loadingFallback}>
        <BoardView />
      </Suspense>
    )
  },
  {
    path: "*",
    element: (
      <Suspense fallback={loadingFallback}>
        <NotFound />
      </Suspense>
    )
  }
];

// Create routes array with authentication routes
const routes = [
  {
    path: "/login",
    element: (
      <Suspense fallback={loadingFallback}>
        <Login />
      </Suspense>
    )
  },
  {
    path: "/signup", 
    element: (
      <Suspense fallback={loadingFallback}>
        <Signup />
      </Suspense>
    )
  },
  {
    path: "/callback",
    element: (
      <Suspense fallback={loadingFallback}>
        <Callback />
      </Suspense>
    )
  },
  {
    path: "/error",
    element: (
      <Suspense fallback={loadingFallback}>
        <ErrorPage />
      </Suspense>
    )
  },
  {
    path: "/prompt-password/:appId/:emailAddress/:provider",
    element: (
      <Suspense fallback={loadingFallback}>
        <PromptPassword />
      </Suspense>
    )
  },
  {
    path: "/reset-password/:appId/:fields",
    element: (
      <Suspense fallback={loadingFallback}>
        <ResetPassword />
      </Suspense>
    )
  },
  {
    path: "/",
    element: (
      <Suspense fallback={loadingFallback}>
        <Layout />
      </Suspense>
    ),
    children: [...mainRoutes]
  }
];

export const router = createBrowserRouter(routes);