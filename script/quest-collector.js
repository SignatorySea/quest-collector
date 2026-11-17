import { MODULE } from "./constants.js";
import { QuestWindow } from "./quest-window.js";
import  { addPresets } from "./addpresets.js";

let questWindow;

Hooks.once("init", async () =>{
  const QUESTCOLLECTAPI = game.modules.get(MODULE.ID);
    globalThis.QUESTCOLLECTAPI ={
        openQuestWindow
    };

    ATLAS.register(MODULE.ID, { 
      title: MODULE.NAME, 
      github: 'SignatorySea/quest-collector', 
      theme: { scope: '.quest-collector', default: 'questCollector' } 
    });
});



Hooks.once("calendaria.ready", async () => {
  addPresets();
  questWindow = new QuestWindow();

  CALENDARIA.api.registerWidget('questCollector', {
    id: 'quest-button',
    type: 'button',
    insertAt: 'hud.buttons.right',
    icon: 'fa-solid fa-scroll',
    label: 'Quest Board',
    tooltip: 'Open Quest Board',
    onClick: () => {
      openQuestWindow();
    }
  })

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
