export async function addPresets(){
    const presets = await CALENDARIA.api.getPresets();

    if (!presets.some(p => p.id === "completed-quest")) {
        const preset = await CALENDARIA.api.addPreset({
          label: 'Completed Quest',
          id: 'completed-quest',
          icon: "fa-solid fa-check-double",
          defaults:{
            visibility: "visible"
          }
        });
        await CALENDARIA.api.updatePreset(preset.id, {playerUsable: false });
    }
}