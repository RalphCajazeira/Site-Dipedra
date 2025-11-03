const assert = require("assert");
const path = require("path");

const blocosRoutes = require("../routes/blocosRoutes");
const { syncDriveRename } = blocosRoutes;

function createDriveFake() {
  let idCounter = 0;
  const foldersByPath = new Map();
  const pathById = new Map();
  const filesByFolder = new Map();

  const calls = {
    getDriveFolderId: [],
    listDriveFilesInFolder: [],
    moveFileOrFolder: [],
    createFolder: [],
    deleteFileOrFolder: [],
  };

  function normalize(input) {
    const sanitized = (input || "").toString().replace(/\\\\/g, "/");
    const trimmed = sanitized.replace(/^\/+/, "").replace(/\/+$/, "");
    const parts = trimmed ? trimmed.split("/").filter(Boolean) : [];

    if (parts[0] === "assets") {
      parts.shift();
    }
    if (parts.length === 0 || parts[0] !== "blocos") {
      parts.unshift("blocos");
    }
    return parts.join("/");
  }

  function createFolderEntry(folderPath) {
    const normalized = normalize(folderPath);
    if (foldersByPath.has(normalized)) {
      return foldersByPath.get(normalized);
    }

    const id = `folder-${++idCounter}`;
    foldersByPath.set(normalized, id);
    pathById.set(id, normalized);
    filesByFolder.set(id, filesByFolder.get(id) || []);
    return id;
  }

  function setFiles(folderPath, files) {
    const folderId = createFolderEntry(folderPath);
    filesByFolder.set(folderId, files.map((f) => ({ ...f })));
    return folderId;
  }

  // Estado inicial: blocos -> Categoria -> Antiga
  const blocosId = createFolderEntry("blocos");
  const categoriaId = createFolderEntry("assets/blocos/Categoria");
  const antigaId = setFiles("assets/blocos/Categoria/Antiga", [
    { id: "file-1", name: "foto1.jpg" },
    { id: "file-2", name: "foto2.jpg" },
  ]);

  const driveFns = {
    DRIVE_FOLDER_NOT_FOUND: "DRIVE_FOLDER_NOT_FOUND",
    async getDriveFolderId(requestPath, options = {}) {
      calls.getDriveFolderId.push({ requestPath, options });
      const normalized = normalize(requestPath);
      const existingId = foldersByPath.get(normalized);
      if (existingId) return existingId;
      if (options.createIfMissing) {
        return createFolderEntry(normalized);
      }
      const error = new Error(`Folder not found: ${normalized}`);
      error.code = "DRIVE_FOLDER_NOT_FOUND";
      throw error;
    },
    async listDriveFilesInFolder(folderId) {
      calls.listDriveFilesInFolder.push({ folderId });
      return (filesByFolder.get(folderId) || []).map((item) => ({ ...item }));
    },
    async moveFileOrFolder(fileId, newParentId) {
      calls.moveFileOrFolder.push({ fileId, newParentId });
      let file;
      for (const [folderId, items] of filesByFolder.entries()) {
        const idx = items.findIndex((item) => item.id === fileId);
        if (idx !== -1) {
          [file] = items.splice(idx, 1);
          break;
        }
      }
      if (!file) {
        throw new Error(`File ${fileId} not found`);
      }
      const target = filesByFolder.get(newParentId) || [];
      target.push(file);
      filesByFolder.set(newParentId, target);
      return { id: fileId, parents: [newParentId] };
    },
    async createFolder(name, parentId) {
      calls.createFolder.push({ name, parentId });
      const parentPathEntry = Array.from(pathById.entries()).find(
        ([id]) => id === parentId
      );
      const parentPath = parentPathEntry ? parentPathEntry[1] : "blocos";
      const newPath = normalize(path.posix.join(parentPath, name));
      const newId = createFolderEntry(newPath);
      filesByFolder.set(newId, filesByFolder.get(newId) || []);
      return { id: newId, name };
    },
    async deleteFileOrFolder(folderId) {
      calls.deleteFileOrFolder.push({ folderId });
      const folderPath = pathById.get(folderId);
      filesByFolder.delete(folderId);
      pathById.delete(folderId);
      if (folderPath) {
        foldersByPath.delete(folderPath);
      }
      return true;
    },
  };

  return {
    blocosId,
    categoriaId,
    antigaId,
    calls,
    state: {
      foldersByPath,
      pathById,
      filesByFolder,
    },
    driveFns,
  };
}

async function testSuccessfulRename() {
  const fake = createDriveFake();

  const result = await syncDriveRename({
    currentPath: "assets/blocos/Categoria",
    oldName: "Antiga",
    newName: "Nova",
    driveFns: fake.driveFns,
  });

  assert.strictEqual(result.skipped, undefined);
  assert.strictEqual(result.movedCount, 2, "Should move all items");

  const newPath = "blocos/Categoria/Nova";
  const newFolderId = fake.state.foldersByPath.get(newPath);
  assert.ok(newFolderId, "New folder must exist");
  const newFolderFiles = fake.state.filesByFolder.get(newFolderId) || [];
  assert.strictEqual(newFolderFiles.length, 2, "Files must be moved to new folder");

  const oldPath = "blocos/Categoria/Antiga";
  assert.ok(!fake.state.foldersByPath.has(oldPath), "Old folder should be removed");
  assert.strictEqual(
    fake.calls.createFolder.length,
    1,
    "Should call createFolder exactly once"
  );
  assert.strictEqual(
    fake.calls.deleteFileOrFolder.length,
    1,
    "Should delete old folder"
  );
}

async function testSkipWhenOldFolderMissing() {
  const fake = createDriveFake();
  fake.state.foldersByPath.delete("blocos/Categoria/Antiga");
  fake.state.pathById.delete(fake.antigaId);
  fake.state.filesByFolder.delete(fake.antigaId);

  const skippedResult = await syncDriveRename({
    currentPath: "assets/blocos/Categoria",
    oldName: "Antiga",
    newName: "Nova",
    driveFns: fake.driveFns,
  });

  assert.deepStrictEqual(skippedResult, { skipped: true });
  assert.strictEqual(fake.calls.createFolder.length, 0);
  assert.strictEqual(fake.calls.moveFileOrFolder.length, 0);
  assert.strictEqual(fake.calls.deleteFileOrFolder.length, 0);
}

async function runTests() {
  await testSuccessfulRename();
  await testSkipWhenOldFolderMissing();
  console.log("All Drive rename sync tests passed ✅");
}

runTests().catch((err) => {
  console.error("Tests failed", err);
  process.exit(1);
});
