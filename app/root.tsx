import { LinksFunction } from "@remix-run/node";
import {
  Meta,
  Links,
  Scripts,
  Outlet,
  LiveReload,
  ScrollRestoration,
} from "@remix-run/react";

import tailwindStyleHref from "tailwindcss/tailwind.css";

export let links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStyleHref },
];

export default function App() {
  return (
    <html lang="en" className="min-h-full antialiased text-size-adjust-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-transparent"
        />
        <meta name="theme-color" content="#000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#000" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-full font-normal bg-white">
        <Outlet />
        <Scripts />
        <LiveReload />
        <ScrollRestoration />
      </body>
    </html>
  );
}
