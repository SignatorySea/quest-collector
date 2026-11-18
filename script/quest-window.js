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

        //sets player filter for if there are no quests (completed or not) to display a lack of quest message
        if (!game.user.isGM) {
            quests = quests.filter(quest => quest.flagData.visibility === "visible");
        }

        const formattedQuests = await Promise.all(
            quests.map(async quest => ({
                id: quest.id,
                name: quest.name,
                startDate: await CALENDARIA.api.formatDate( quest.flagData.startDate, 'DD MMMM, YYYY'),
                visibility: quest.flagData?.visibility,
                isCompleted: quest.flagData?.categories?.includes("completed-quest")
            }))
        );

        console.error (formattedQuests);

        //Seperates quests based on visiblility
        const activeQuests = formattedQuests.filter(q => q.visibility === "visible" && !q.isCompleted);
        const inactiveQuests = formattedQuests.filter(q => q.visibility === "hidden" || q.visibility === "secret");

        const completedQuests = formattedQuests.filter(q => q.visibility === "visible" && q.isCompleted);
        

        return {
            quests : formattedQuests,
            activeQuests,
            inactiveQuests,
            completedQuests,
            isGM: game.user.isGM
        };
    }

    async _onRender(content, options){
        await super._onRender(content, options);

        this.element.querySelectorAll(".quest-link").forEach(div => {
            div.addEventListener("click", this._onQuestClick.bind(this));
        });
    }

    async _onQuestClick(event){
        const noteID= event.currentTarget.dataset.noteId;
        await CALENDARIA.api.navigateToNote(noteID);
    }
}