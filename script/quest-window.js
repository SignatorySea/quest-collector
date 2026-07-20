const {ApplicationV2, HandlebarsApplicationMixin} = foundry.applications.api;

export class QuestWindow extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        id: "quest-window",
        tag: "section",
    
        window: {
            title: "Quest Board",
            icon: "fa-solid fa-scroll",
        },
        position: {
            width: 500,
            height: 400
        },
    };

    static PARTS = {
        content: {
            template: "modules/quest-collector/templates/quest-window.hbs"
        }
    };

    async _prepareContext(){
        let quests = await CALENDARIA.api.getNotesByPreset("quest") ?? [];
        
        console.log(quests);

        if (!game.user.isGM) {
            quests = quests.filter(quest => quest.flagData.visibility === "visible");
            console.log("filtered Quests:", quests);
        }

        //Seperates quests based on presets
        const activeQuests = quests.filter(q => q.flagData?.categories.includes("active"));
        const inactiveQuests = quests.filter(q => !q.flagData?.categories.includes("active"));

        

        return {
            quests,
            activeQuests,
            inactiveQuests,
            isGM: game.user.isGM
        };
    }

    async _onRender(content, options){
        await super._onRender(content, options);

        this.element.querySelectorAll(".quest-link").forEach(button => {
            button.addEventListener("click", this._onQuestClick.bind(this));
        });
    }

    async _onQuestClick(event){
        const noteID= event.currentTarget.dataset.noteId;
        await CALENDARIA.api.navigateToNote(noteID);
    }
}