const Module = require("module");
const path = require("path");

const aliasPrefix = "@/";
const projectRoot = path.join(__dirname, "..", "..");

if (!Module.__hasCatalogAliasPatch) {
  const originalResolveFilename = Module._resolveFilename;

  Module._resolveFilename = function patchedResolve(request, parent, isMain, options) {
    if (typeof request === "string" && request.startsWith(aliasPrefix)) {
      const relativePath = request.slice(aliasPrefix.length);
      const absolutePath = path.join(projectRoot, "src", relativePath);
      return originalResolveFilename.call(
        this,
        absolutePath,
        parent,
        isMain,
        options
      );
    }

    return originalResolveFilename.call(this, request, parent, isMain, options);
  };

  Module.__hasCatalogAliasPatch = true;
}
