const {ApplicationV2, HandlebarsApplicationMixin} = foundry.applications.api;

export class QuestWindow extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        id: "quest-window",
        classes:['quest-collector'],
        tag: "section",
    
        window: {
            title: "Quest Board",
            icon: "fa-solid fa-scroll",
        },
        position: {
            width: 'auto',
            height: 'auto'
        }
    };

    static PARTS = {
        content: {
            template: "modules/questCollector/templates/quest-window.hbs"
        }
    };

    async _prepareContext(){
        let quests = await CALENDARIA.api.getNotesByPreset("quest") ?? [];
        
        console.log(quests);

        if (!game.user.isGM) {
            quests = quests.filter(quest => quest.flagData.visibility === "visible");
        }

        //Seperates quests based on visiblility
        const activeQuests = quests.filter(q => q.flagData?.visibility === "visible" && !q.flagData?.categories?.includes("completed-quest"));
        const inactiveQuests = quests.filter(q => q.flagData?.visibility === "hidden" || q.flagData?.visibility === "secret");

        const completedQuests = quests.filter(q => q.flagData?.visibility === "visible" && q.flagData?.categories?.includes("completed-quest"));
        

        return {
            quests,
            activeQuests,
            inactiveQuests,
            completedQuests,
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