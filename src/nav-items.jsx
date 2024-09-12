import { HomeIcon, Code } from "lucide-react";
import Home from "./pages/Home.jsx";
import CodeEditor from "./components/CodeEditor.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Home />,
  },
  {
    title: "Code Editor",
    to: "/editor",
    icon: <Code className="h-4 w-4" />,
    page: <CodeEditor />,
  },
];