// data/quizzes.ts

export type Question = {
  prompt:      string;
  options:     string[];
  answerIndex: number;
};

const quizzes: Record<string, Question[][]> = {
  'js-basics': [
    // 1️⃣ Basics Overview
    [
      {
        prompt: "Which keyword declares a variable that cannot be reassigned?",
        options: ['var', 'let', 'const'],
        answerIndex: 2
      },
      {
        prompt: "What is the output of: `typeof 'Hello'`?",
        options: ['string', 'number', 'object'],
        answerIndex: 0
      },
      {
        prompt: "Which of these is an arrow function?",
        options: ['() => {}', 'function(){}', '=> {}'],
        answerIndex: 0
      }
    ],

    // 2️⃣ Variables
    [
      {
        prompt: "Which keyword allows reassignment?",
        options: ['const', 'let', 'var (no reassignment)'],
        answerIndex: 1
      },
      {
        prompt: "What happens if you redeclare with `let` in the same scope?",
        options: ['Error', 'Silent overwrite', 'New var created'],
        answerIndex: 0
      }
    ],

    // 3️⃣ Functions
    [
      {
        prompt: "How do you define an anonymous function?",
        options: ['function(a, b) {}', '=> function(a,b)','fn(a,b) => {}'],
        answerIndex: 0
      },
      {
        prompt: "Arrow functions inherit `this` from…?",
        options: ['global scope', 'their enclosing scope', 'nowhere'],
        answerIndex: 1
      }
    ],

    // 4️⃣ Arrays
    [
      {
        prompt: "Which method adds an item to end of an array?",
        options: ['pop()', 'push()', 'shift()'],
        answerIndex: 1
      },
      {
        prompt: "What does `arr.length` return?",
        options: ['Last index', 'Number of elements', 'Undefined'],
        answerIndex: 1
      },
      {
        prompt: "Access first element via…?",
        options: ['arr[1]', 'arr[0]', 'arr.first()'],
        answerIndex: 1
      }
    ],

    // 5️⃣ Objects
    [
      {
        prompt: "Create an empty object literal:",
        options: ['let o = {}', 'let o = []', 'let o() = {}'],
        answerIndex: 0
      },
      {
        prompt: "Access prop `name`:",
        options: ['obj.name', 'obj["name"]', 'Both'],
        answerIndex: 2
      },
      {
        prompt: "Delete a property:",
        options: ['delete obj.age', 'obj.remove("age")', 'obj.age = null'],
        answerIndex: 0
      }
    ],

    // 6️⃣ DOM & Events
    [
      {
        prompt: "Select element with id `main`:",
        options: ['getElementById("main")', 'querySelector(".main")', 'getElements("main")'],
        answerIndex: 0
      },
      {
        prompt: "Event fired on click:",
        options: ['onClick', 'click', 'clickEvent'],
        answerIndex: 1
      },
      {
        prompt: "Attach listener:",
        options: [
          'el.addEventListener("click", fn)',
          'el.on("click", fn)',
          'el.listen("click", fn)'
        ],
        answerIndex: 0
      }
    ]
  ],

  'py-intro': [
    // existing sets...
  ],

  'ds-algos': [
    // existing sets...
  ]
};

export default quizzes;
