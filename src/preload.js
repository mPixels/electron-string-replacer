const customTitlebar = require("custom-electron-titlebar");

window.addEventListener("DOMContentLoaded", () => {
  new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex("#444"),
    maximizable: false,
    titleHorizontalAlignment: "left",
  });
  const finishButton = document.getElementById("btncomplete");
  const renameButton = document.getElementById("btnrename");
  finishButton.disabled = true;
  renameButton.disabled = true;
});
