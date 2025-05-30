import { createAct } from './database';

const sampleActs = [
  "Helped an elderly neighbor carry groceries up three flights of stairs. She was so grateful and it only took 5 minutes of my day.",
  "Left a positive sticky note on a coworker's computer before they came in on Monday morning. Sometimes a little encouragement goes a long way.",
  "Paid for the coffee of the person behind me in line. The barista said they'd been having a rough morning and it completely changed their mood.",
  "Donated blood today for the first time. One donation can help save up to three lives - that's pretty amazing.",
  "Volunteered at the local animal shelter this weekend. Got to walk dogs and play with cats. Honestly, I think they helped me more than I helped them.",
  "Called my grandmother just to check in and listen to her stories. She talks about the same things but her joy in sharing them never gets old.",
  "Found a lost wallet on the street and tracked down the owner on social media. They were so relieved - apparently had been looking everywhere for it.",
  "Bought lunch for a homeless person I see regularly downtown. We ended up having a great conversation about his life before he lost his job.",
  "Sent an anonymous thank you card to my mail carrier. They work so hard every day regardless of the weather.",
  "Helped a mom struggling with strollers and bags get through a heavy door at the mall. She looked so overwhelmed and grateful for the small help."
];

export function seedDatabase() {
  console.log('Seeding database with sample acts of helping others...');
  
  sampleActs.forEach((act, index) => {
    try {
      createAct(act);
      console.log(`✓ Added sample act ${index + 1}`);
    } catch (error) {
      console.error(`✗ Failed to add sample act ${index + 1}:`, error);
    }
  });
  
  console.log('Database seeding completed!');
} 