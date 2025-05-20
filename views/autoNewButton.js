const mb = app.plugins.getPlugin('obsidian-meta-bind-plugin')?.api;
const { entityType } = input;
const { templatePath } = input;
const { destinationFolder } = input;
console.log(input);


if (!mb) {
    dv.paragraph("⚠️ MetaBind-Plugin nicht aktiviert");
}

this.createEl("label", { text: "Filename: " });
const inputField = await this.createEl("input", { type: "text", placeholder: `New ${entityType} title...` });
inputField.setAttr("style", `
    padding: 4px 8px;
    background-color: white;
    color: black;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 8px;
`);
const btn = this.createEl("button", {
    text: `${entityType} hinzufügen`
});

btn.onclick = async () => {
    try {

        const filename = inputField.value.trim();
        if (!filename) {
            new Notice("Please enter a filename.");
            return;
        }

        const templateFile = app.vault.getAbstractFileByPath(templatePath);
        if (!templateFile) {
            new Notice(`⚠️ Template not found: ${templatePath}`);
            return;
        }

        const newFileName = `${filename}.md`;
        const newFilePath = `${destinationFolder}/${newFileName}`;

        console.log(app.plugins)
        const tp = app.plugins.plugins["templater-obsidian"]?.templater;

        if (!tp) {
            new Notice("Templater plugin not found or not loaded.");
            return;
        }

        // create an empty note first
        const file = await app.vault.create(newFilePath, "");
        await tp.write_template_to_file(templateFile, file); // Apply the template
        new Notice(`✅ Created: ${newFileName}`);
        const leaf = await app.workspace.getLeaf(true);
        await leaf.openFile(file);
    } catch (error) {
        new Notice("❌ Failed to create note.");
        console.error(error);
    }
};


dv.container.appendChild(inputField);
dv.container.appendChild(btn);


