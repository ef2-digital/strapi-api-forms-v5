"use strict";
const React = require("react");
const jsxRuntime = require("react/jsx-runtime");
const __variableDynamicImportRuntimeHelper = (glob, path, segs) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(
      reject.bind(
        null,
        new Error(
          "Unknown variable dynamic import: " + path + (path.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : "")
        )
      )
    );
  });
};
const PLUGIN_ID = "api-forms";
const Initializer = ({ setPlugin }) => {
  const ref = React.useRef(setPlugin);
  React.useEffect(() => {
    ref.current(PLUGIN_ID);
  }, []);
  return null;
};
const PluginIcon = () => /* @__PURE__ */ jsxRuntime.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 512 512", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
  /* @__PURE__ */ jsxRuntime.jsx("rect", { width: "512", height: "512", rx: "64", fill: "#4DADF7" }),
  /* @__PURE__ */ jsxRuntime.jsx(
    "rect",
    {
      x: "120",
      y: "140",
      width: "272",
      height: "200",
      rx: "16",
      fill: "none",
      stroke: "white",
      "stroke-width": "10"
    }
  ),
  /* @__PURE__ */ jsxRuntime.jsx(
    "line",
    {
      x1: "140",
      y1: "180",
      x2: "372",
      y2: "180",
      stroke: "white",
      "stroke-width": "8",
      "stroke-linecap": "round"
    }
  ),
  /* @__PURE__ */ jsxRuntime.jsx(
    "line",
    {
      x1: "140",
      y1: "220",
      x2: "300",
      y2: "220",
      stroke: "white",
      "stroke-width": "8",
      "stroke-linecap": "round"
    }
  ),
  /* @__PURE__ */ jsxRuntime.jsx(
    "line",
    {
      x1: "140",
      y1: "260",
      x2: "320",
      y2: "260",
      stroke: "white",
      "stroke-width": "8",
      "stroke-linecap": "round"
    }
  ),
  /* @__PURE__ */ jsxRuntime.jsx("circle", { cx: "340", cy: "220", r: "10", fill: "white" }),
  /* @__PURE__ */ jsxRuntime.jsx("circle", { cx: "360", cy: "260", r: "10", fill: "white" }),
  /* @__PURE__ */ jsxRuntime.jsx(
    "text",
    {
      x: "80",
      y: "400",
      "font-size": "80",
      fill: "white",
      "font-family": "Arial, sans-serif",
      "font-weight": "bold"
    }
  )
] });
const index = {
  register(app) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: PLUGIN_ID
      },
      Component: async () => {
        const { App } = await Promise.resolve().then(() => require("./App-CUol5_aa.js"));
        return App;
      }
    });
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID
    });
  },
  async registerTrads({ locales }) {
    return await Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/en.json": () => Promise.resolve().then(() => require("./en-RVsKvN1O.js")), "./translations/nl.json": () => Promise.resolve().then(() => require("./nl-C39qzstY.js")) }), `./translations/${locale}.json`, 3);
          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  }
};
exports.PLUGIN_ID = PLUGIN_ID;
exports.index = index;
