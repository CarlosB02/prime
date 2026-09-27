import fs from 'fs';

const file = 'components/questionnaires/QuestionnaireModal.tsx';
if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/opacity-0 group-hover\/option:opacity-100/g, '');
  content = content.replace(/className="\s+/g, 'className="');
  fs.writeFileSync(file, content);
}
