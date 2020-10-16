const fs = require("fs");
const path = require("path");
const util = require("util");
const { dialog } = require("electron").remote;

var btnWowPath = document.getElementById("btnwowpath");
var wowPath = document.getElementById("wowpathtext");
var btnRename = document.getElementById("btnrename");
var renameText = document.getElementById("newaddonname");
var btnComplete = document.getElementById("btncomplete");
var finishText = document.getElementById("finishtext");
var searchPath = "";
var oldAddonName = "";
var newAddonName = "";

const fsReaddir = util.promisify(fs.readdir);
const fsReadFile = util.promisify(fs.readFile);
const fsLstat = util.promisify(fs.lstat);

btnWowPath.addEventListener("click", (event) => {
  dialog
    .showOpenDialog({
      title: "Select the addon path",
      buttonLabel: "Open",
      properties: ["openDirectory"],
    })
    .then((result) => {
      console.log(result.canceled);
      if (!result.canceled) {
        console.log(result.filePaths[0].toString());
        wowPath.textContent = result.filePaths[0].toString();
        searchPath = result.filePaths[0].toString();
        oldAddonName = path.parse(searchPath).base;
        btnRename.disabled = false;
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

btnRename.addEventListener("click", (event) => {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_";
  var charatersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charatersLength));
  }
  renameText.textContent = result;
  newAddonName = result;

  searchFilesInDirectoryAsync(searchPath, oldAddonName);
  btnComplete.disabled = false;
});

btnComplete.addEventListener("click", (event) => {
  fs.renameSync(
    searchPath + "\\" + oldAddonName + ".toc",
    searchPath + "\\" + newAddonName + ".toc"
  );
  console.log("File renamed: " + searchPath + "\\" + oldAddonName + ".toc to " + newAddonName);
  fs.renameSync(
    searchPath + "\\" + oldAddonName + ".xml",
    searchPath + "\\" + newAddonName + ".xml"
  );
  console.log("File renamed: " + searchPath + "\\" + oldAddonName + ".xml to " + newAddonName);
  fs.renameSync(searchPath, searchPath.replace(oldAddonName, newAddonName));
  console.log("File renamed: " + searchPath + "to " + newAddonName);

  finishText.textContent = "Addon Renamed Successfully!";
});

async function searchFilesInDirectoryAsync(dir, filter) {
  const files = await fsReaddir(dir).catch((err) => {
    throw new Error(err.message);
  });
  const found = await getFilesInDirectoryAsync(dir);
  var count = 0;

  for (file of found) {
    const fileContent = await fsReadFile(file);

    const regex = new RegExp(filter);
    const replacer = new RegExp(filter, "g");
    if (regex.test(fileContent)) {
      count += 1;
      console.log(`Word found in file: ${file}`);
      console.log(count);
      var newContent = fileContent.toString().replace(replacer, newAddonName);
      fs.writeFile(file, newContent, function (err) {
        if (err) return console.log(err);
      });
    }
  }
}

async function getFilesInDirectoryAsync(dir) {
  let files = [];
  const filesFromDirectory = await fsReaddir(dir).catch((err) => {
    throw new Error(err.message);
  });

  for (let file of filesFromDirectory) {
    const filePath = path.join(dir, file);
    const stat = await fsLstat(filePath);

    if (stat.isDirectory()) {
      const nestedFiles = await getFilesInDirectoryAsync(filePath);
      files = files.concat(nestedFiles);
    } else {
      files.push(filePath);
    }
  }

  return files;
}
