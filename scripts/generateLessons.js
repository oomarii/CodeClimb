// scripts/generateLessons.js

const fs   = require('fs');
const path = require('path');

/** 1) All your tracks and their topics **/
const tracks = {
  'js-basics': [
    'Introduction to JavaScript',
    'Variables (let & const)',
    'Primitive Data Types',
    'Type Coercion',
    'Operators',
    'Control Flow (if/else)',
    'Loops (for, while)',
    'Functions & Arrow Functions',
    'Scope & Closures',
    'Hoisting',
    'this & Context',
    'Arrays & Array Methods',
    'Objects & Object Methods',
    'String Methods',
    'Number Methods',
    'Template Literals',
    'Destructuring Assignment',
    'Spread & Rest Operators',
    'Default Parameters',
    'Optional Chaining',
    'Nullish Coalescing',
    'Symbols',
    'Iterators & Generators',
    'Regular Expressions',
    'Date & Time API',
    'Error Handling (try/catch)',
    'Promises',
    'Async/Await',
    'Event Loop & Concurrency',
    'Fetch API'
  ],
  'py-intro': [
    'Python 101',
    'Indentation',
    'Functions',
    'Lists & Tuples',
    'Dictionaries & Sets',
    'Comprehensions',
    'Modules & Packages',
    'File I/O',
    'Error Handling'
  ],
  'ds-algos': [
    'Data Structures & Algorithms',
    'Bubble Sort',
    'Binary Search',
    'Linked Lists',
    'Stacks & Queues',
    'Trees',
    'Graphs',
    'Hash Tables',
    'Heaps',
    'Tries',
    'Big O Notation',
    'Sorting Algorithms',
    'Searching Algorithms',
    'Dynamic Programming',
    'Greedy Algorithms',
    'Divide & Conquer',
    'Backtracking'
  ]
  // …add more tracks here if needed…
};

/** 2) One topic per page **/
const TOPICS_PER_LESSON = 1;

/** 3) Custom intros & examples **/
const topicDetails = {
  // — JS BASICS —
  'Introduction to JavaScript': {
    intro:
      `JavaScript runs in every browser and on servers (via Node.js), powering both front‑end and back‑end code.`,
    example:
      `// Hello World
console.log("Hello, CodeClimb!");`
  },
  'Variables (let & const)': {
    intro:
      `Variables store data. Use \`const\` for constants, and \`let\` for reassignable values.`,
    example:
      `const PI = 3.14;
let count = 0;
count++;`
  },
  'Primitive Data Types': {
    intro:
      `Strings, numbers, booleans, null, undefined, symbols, and bigints are JavaScript’s primitives—immutable and copied by value.`,
    example:
      `console.log(typeof "hello"); // "string"
console.log(typeof 42);      // "number";`
  },
  // …add more hand‑crafted JS entries here if you like…

  // — PYTHON INTRO —
  'Python 101': {
    intro:
      `Python is a high‑level, interpreted language with clear syntax and a vast standard library.`,
    example:
      `# Hello World in Python
print("Hello, CodeClimb!")`
  },
  // …and more Python entries…

  // — DS & ALGORITHMS —
  'Data Structures & Algorithms': {
    intro:
      `Data structures organize information; algorithms manipulate them to solve real‑world problems efficiently.`,
    example:
      `// Pseudocode: traverse a list
for (item of list) {
  process(item);
}`
  },
  // …and more DS entries…
};

/**
 *  Build the Markdown for one page of up to TOPICS_PER_LESSON topics
 */
function makeLessonMarkdown(trackId, topics) {
  const title = topics.join(' & ');
  let md = `# ${title}\n\n`;
  md += `Welcome to the **${title}** lesson in the **${trackId}** track.\n\n`;

  topics.forEach((topic, idx) => {
    const det = topicDetails[topic] || {};
    const intro = det.intro || `In this lesson you’ll learn about **${topic}**.`;
    const rawExample = det.example ||
      (trackId.startsWith('py')
        ? `# Example usage of ${topic}\nprint("${topic}")`
        : `// Example usage of ${topic}\nconsole.log("${topic}");`);

    md += `## ${idx+1}. ${topic}\n\n`;
    md += `${intro}\n\n`;
    // Always include a code block
    const lang = trackId.startsWith('py') ? 'py' : 'js';
    md += '```' + lang + '\n' + rawExample + '\n```\n\n';
  });

  return md.trim();
}

/**  Generate and write data/lessons.ts  **/
function generate() {
  const out = [
    `// AUTO‑GENERATED — do NOT edit by hand\n`,
    `const lessons: Record<string,string[]> = {\n`
  ];

  Object.entries(tracks).forEach(([trackId, topics]) => {
    out.push(`  '${trackId}': [\n`);
    for (let i = 0; i < topics.length; i += TOPICS_PER_LESSON) {
      const chunk = topics.slice(i, i + TOPICS_PER_LESSON);
      const md    = makeLessonMarkdown(trackId, chunk);
      out.push(`    ${JSON.stringify(md)},\n`);
    }
    out.push(`  ],\n\n`);
  });

  out.push(`};\n\nexport default lessons;\n`);

  fs.writeFileSync(path.join(__dirname, '../data/lessons.ts'),
                   out.join(''), 'utf8');
  console.log('✅ Generated data/lessons.ts with full content for all topics.');
}

generate();
