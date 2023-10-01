import { motion } from "framer-motion";
import { useState } from "react";
import { useMediaQuery } from "../util/useMediaQuery";

export default function Nav() {
  const [toggled, setToggled] = useState(false);
  const matches = useMediaQuery("(min-width: 1240px)");
  return (
    <nav className="relative mx-8 mb-24 flex justify-between items-center pt-12 pb-6 font-medium md:mx-16 lg:mx-32">
      <svg
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        width="250"
        height={4}
        viewBox="0 0 250 4"
        fill="none"
      >
        <path
          d="M2 2L428 2"
          stroke="#282828"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      <div>{/* Insert profile pic orimage */}</div>

      <h1 className="text-4xl font-bold text-slate-800">
        <a href="/">Admin</a>
      </h1>

      {matches && (
        <div className="flex gap-12">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/stock">Stock</a>
          <a href="/transaction">Transaction</a>
        </div>
      )}

      {!matches && (
        <div
          className="space-y-1.5 cursor-pointer z-50"
          onClick={() => setToggled((prevToggle) => !prevToggle)}
        >
          <motion.span
            animate={{
              rotateZ: toggled ? 45 : 0,
              y: toggled ? 8 : 0,
              width: toggled ? 40 : 32,
            }}
            className="block h-0.5 w-8 bg-black"
          ></motion.span>
          <motion.span
            animate={{
              rotateZ: toggled ? 0 : 0,
              y: toggled ? 0 : 1,
              width: toggled ? 0 : 24,
              //   length: toggled ? 0 : 16,
            }}
            className="block h-0.5 w-6 bg-black"
          ></motion.span>
          <motion.span
            animate={{
              rotateZ: toggled ? -45 : 0,
              y: toggled ? -8 : 0,
              width: toggled ? 40 : 16,
            }}
            className="block h-0.5 w-4 bg-black"
          ></motion.span>
        </div>
      )}

      {toggled && !matches && (
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: 25 }}
          className="fixed flex bg-white bottom-0 left-0 w-full h-screen items-center justify-center z-40"
        >
          <div className="flex flex-col gap-24 text-lg">
            <motion.a href="/">Home</motion.a>
            {/* <motion.a href="/about">About</motion.a> */}
            <motion.a href="/stock">Stock</motion.a>
            <motion.a href="/transaction">Transaction</motion.a>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
