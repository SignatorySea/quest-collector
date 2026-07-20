import { QuestWindow } from "./quest-window.js";
import  { addPresets } from "./addpresets.js";

let questWindow;

Hooks.once("ready", () =>{
    globalThis.questCollector ={
      api:{
        openQuestWindow
      }
    };
});

Hooks.once("calendaria.ready", async () => {
  addPresets();
  questWindow = new QuestWindow();

});

Hooks.on("getSceneControlButtons", (controls) => {

  controls.tokens.tools.questBoard = {
    name: "questBoard",
    title: "Quest Board",
    icon: "fa-solid fa-scroll",
    order: Object.keys(controls.tokens.tools).length,
    button: true,
    onChange: () => {
      openQuestWindow();
    }
  };

});

function openQuestWindow() {
  const existing = foundry.applications.instances.get("quest-window");

  if (existing) {
    existing.bringToFront();
  } else {
    questWindow.render({force: true});
  }
}


/*
Function working order

  Make Preset if preset of "active" and "inactive" dont exist
  create quest window
  filter quests into 2 groups for displaying by the preset of "active"/"inactive" for GM users only
  maybe filter into a 3rd category based on visibility?
*/