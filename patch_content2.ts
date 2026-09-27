import fs from 'fs';

let content = fs.readFileSync('components/content/ContentView.tsx', 'utf-8');

// 1. Remove handleView from thumbnail
content = content.replace(
  `                        <div className="w-16 aspect-video rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden shadow-sm relative group-hover:scale-105 transition-transform cursor-pointer" onClick={() => handleView(item)}>`,
  `                        <div className="w-16 aspect-video rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden shadow-sm relative group-hover:scale-105 transition-transform">`
);

// 2. Remove handleView from title
content = content.replace(
  `                        <h3 
                            className="font-bold text-slate-800 dark:text-white text-sm sm:text-base truncate pr-2 cursor-pointer hover:text-primary-500 transition-colors" 
                            title={item.title}
                            onClick={() => handleView(item)}
                        >`,
  `                        <h3 
                            className="font-bold text-slate-800 dark:text-white text-sm sm:text-base truncate pr-2 transition-colors" 
                            title={item.title}
                        >`
);

// 3. Make actions always visible
content = content.replace(
  `<div className="col-span-4 sm:col-span-3 md:col-span-2 lg:col-span-1 flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">`,
  `<div className="col-span-4 sm:col-span-3 md:col-span-2 lg:col-span-1 flex justify-end items-center gap-2">`
);

// 4. Add stopPropagation to handleView calls
content = content.replaceAll(
  `onClick={() => handleView(item)}`,
  `onClick={(e) => { e.stopPropagation(); handleView(item); }}`
);

// 5. Add stopPropagation to toggleDelete if not already there
// Checking the source, one toggleDelete wasn't updated in the previous script or had a typo.
content = content.replace(
  `onClick={() => toggleDelete(item.id)}`,
  `onClick={(e) => { e.stopPropagation(); toggleDelete(item.id); }}`
);

fs.writeFileSync('components/content/ContentView.tsx', content);
