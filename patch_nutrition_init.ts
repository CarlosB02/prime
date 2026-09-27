import fs from 'fs';
const content = fs.readFileSync('components/nutrition_plans/NutritionPlanBuilder.tsx', 'utf-8');

let newContent = content.replace(
  "startDate: '2026-07-01',",
  "startDate: '',"
);

newContent = newContent.replace(
  "endDate: '2026-08-31',",
  "endDate: '',"
);

newContent = newContent.replace(
  "name: 'Plano Hipertrofia (Diogo)',",
  "name: 'Novo Plano de Nutrição',"
);

fs.writeFileSync('components/nutrition_plans/NutritionPlanBuilder.tsx', newContent);
