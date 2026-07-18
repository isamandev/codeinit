// Prisma's generated client (src/generated) ships extensionless relative
// imports (e.g. "./internal/class"), written for bundler-style resolution.
// Our own compiled output (dist/**) mirrors that style too. Plain Node ESM
// requires explicit extensions, so this hook retries a failed relative
// resolution with ".js" appended before giving up.
export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    const isRelative = specifier.startsWith("./") || specifier.startsWith("../");
    if (isRelative && error?.code === "ERR_MODULE_NOT_FOUND") {
      return nextResolve(`${specifier}.js`, context);
    }
    throw error;
  }
}
