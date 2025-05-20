

const {tag} = input 
  if (!tag) {
    dv.paragraph("⚠️ Bitte gib einen Tag an, z.B. {tag: '#mytag'}");
    return;
  }
  const currentFile = dv.current().file.path;
  
  const outlinks = dv.page(currentFile).file.outlinks
    .filter(link => {
      const targetPage = dv.page(link.path);
      return targetPage && targetPage.file.tags.includes(tag);
    });

  // 2. Get backlinks to current file, but only those backlinks from files tagged with the tag
  // backlinks is an array of {path, ...} referring to backlink source files
  const backlinks = dv.page(currentFile).file.inlinks?.filter(bl => {
    const sourcePage = dv.page(bl.path);
    return sourcePage && sourcePage.file.tags.includes(tag);
  }) ?? [];


  // 3. Merge unique
  const mergedPaths = new Set([
    ...outlinks.map(l => l.path),
    ...backlinks.map(b => b.path),
  ]);
  

  if (mergedPaths.size === 0) {
    dv.paragraph(`Keine relevanten Notizen zum Tag ${tag}`);
    return;
  }

  // 4. Display the merged list as links
  dv.list(
    Array.from(mergedPaths).map(p => dv.fileLink(p))
  );