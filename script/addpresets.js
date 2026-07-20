export async function addPresets(){
    const presets = await CALENDARIA.api.getPresets();

    if (!presets.some(p => p.id === "Active")) {
        const preset = await CALENDARIA.api.addPreset({
          label: 'Active',
        });
        await CALENDARIA.api.updatePreset(preset.id, {playerUsable: false });
    }

    if (!presets.some(p => p.id === "Inactive")) {
        const preset2 = await CALENDARIA.api.addPreset({
          label: 'Inactive',
        });
        await CALENDARIA.api.updatePreset(preset2.id, {playerUsable: false });
    }
}