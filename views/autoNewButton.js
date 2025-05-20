const mb = app.plugins.getPlugin('obsidian-meta-bind-plugin')?.api;
const {entityType} = input;
const {templatePath} = input;
const {destinationFolder} = input;
const {fileName} = input;
console.log(input);
if (!mb) {
    dv.paragraph("⚠️ MetaBind-Plugin nicht aktiviert");
}



const btn = this.createEl("button", {
    text: `Neues ${entityType}`
});

btn.addEventListener("click", async () => {
    try {
        const templateFile = app.vault.getAbstractFileByPath(templatePath);
        if (!templateFile) {
            new Notice(`⚠️ Template not found: ${templatePath}`);
            return;
        }

        const templateContent = await app.vault.read(templateFile);

        const timestamp = window.moment().format("YYYY-MM-DD_HH-mm-ss");
        const newFileName = `${fileName} - ${timestamp}.md`;
        const newFilePath = `${destinationFolder}/${newFileName}`;

        console.log(newFilePath)
        const newFile = await app.vault.create(newFilePath, templateContent);
        new Notice(`✅ Created: ${newFileName}`);

        const leaf = app.workspace.getLeaf(true);
        await leaf.openFile(newFile);
    } catch (error) {
        new Notice("❌ Failed to create note.");
        console.error(error);
    }
});


dv.container.appendChild(btn);

dv.paragraph("MetaBind loaded")




