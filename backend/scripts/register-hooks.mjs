import { register } from "node:module";
import { pathToFileURL } from "node:url";

register(
  "./resolve-js-extension-hook.mjs",
  pathToFileURL(`${import.meta.dirname}/`),
);
