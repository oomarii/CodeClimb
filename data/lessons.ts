// /data/lessons.ts

const lessons: Record<string, string[]> = {
    'js-basics': [
      `# JavaScript Basics
  
  JavaScript is a versatile, high‑level scripting language used in web development.
  
  ## Topics
  1. Variables (let, const, var)  
  2. Data Types (string, number, boolean)  
  3. Functions and Arrow Functions`,
      `# Variables
  
  Use \`let\` and \`const\` instead of \`var\`.
    
  \`\`\`js
  let count = 0;
  const name = "Alice";
  \`\`\``,
      `# Functions
  
  Regular:
  \`\`\`js
  function add(a, b) {
    return a + b;
  }
  \`\`\`
  
  Arrow:
  \`\`\`js
  const add = (a, b) => a + b;
  \`\`\``
    ],
    'py-intro': [
      `# Python 101
  
  Python is a readable, interpreted language.
  
  ## Topics
  - Indentation  
  - Variables  
  - Functions`,
      `# Indentation
  
  Use 4 spaces per level:
  \`\`\`py
  def greet():
      print("Hello")
  \`\`\``,
      `# Functions
  
  \`\`\`py
  def add(a, b):
      return a + b
  \`\`\``
    ],
    'ds-algos': [
      `# Data Structures & Algorithms
  
  Covers arrays, linked lists, sorting, searching.`,
      `# Bubble Sort
  
  \`\`\`js
  function bubbleSort(arr) {
    // ...
  }
  \`\`\``,
      `# Binary Search
  
  \`\`\`js
  function binarySearch(arr, target) {
    // ...
  }
  \`\`\``,
      `# Linked Lists
  
  \`\`\`js
  class Node {
    constructor(val) {
      this.val = val;
      this.next = null;
    }
  }
  \`\`\``,
      `# Complexity
  
  - Time: O(n²) for bubble sort  
  - Space: O(1)`
    ]
  };
  
  export default lessons;
  