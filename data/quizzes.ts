// data/quizzes.ts

export type Question = {
    prompt:       string;
    options:      string[];
    answerIndex:  number;
  };
  
  const quizzes: Record<string, Question[][]> = {
    'js-basics': [
      [
        {
          prompt: "Which keyword declares a variable that cannot be reassigned?",
          options: ['var','let','const'],
          answerIndex: 2
        },
        {
          prompt: "What is the output of: `typeof 'Hello'`?",
          options: ['string','number','object'],
          answerIndex: 0
        },
        {
          prompt: "Which of these is an arrow function?",
          options: ['() => {}','function(){}','=> {}'],
          answerIndex: 0
        }
      ],
      [
        {
          prompt: "Arrays in JS are zero-indexed. True or False?",
          options: ['True','False'],
          answerIndex: 0
        },
        {
          prompt: "Add item to end of array: `arr._____(item)`",
          options: ['push','pop','shift'],
          answerIndex: 0
        }
      ],
      [
        {
          prompt: "How do you convert a string `s` to a number?",
          options: ['Number(s)','parseInt(s)','Both'],
          answerIndex: 2
        }
      ]
    ],
  
    'py-intro': [
      [
        {
          prompt: "Which symbol begins a comment in Python?",
          options: ['//','#','<!--'],
          answerIndex: 1
        },
        {
          prompt: "Indentation in Python uses …?",
          options: ['braces','tabs or spaces','semicolons'],
          answerIndex: 1
        }
      ],
      [
        {
          prompt: "Define function: `def foo():` uses keyword … ?",
          options: ['function','def','func'],
          answerIndex: 1
        }
      ],
      [
        {
          prompt: "To print to console, use …",
          options: ['echo','print()','printf()'],
          answerIndex: 1
        }
      ],
      [
        {
          prompt: "Lists are defined with … brackets?",
          options: ['[]','()','{}'],
          answerIndex: 0
        }
      ]
    ],
  
    'ds-algos': [
      [
        {
          prompt: "Which algorithm is O(n log n) average-case?",
          options: ['Bubble Sort','Quick Sort','Insertion Sort'],
          answerIndex: 1
        }
      ],
      [
        {
          prompt: "BFS stands for …?",
          options: ['Breadth-First Search','Binary-First Search','Backtracking-First Search'],
          answerIndex: 0
        }
      ],
      [
        {
          prompt: "A linked list node contains …?",
          options: ['value & next pointer','only value','only pointer'],
          answerIndex: 0
        }
      ]
    ]
  };
  
  export default quizzes;
  