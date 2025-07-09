const quiz = document.getElementById('quiz');
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const nextBtn = document.getElementById('nextBtn');
const result = document.getElementById('result');
const scoreEl = document.getElementById('score');

let currentQuestionIndex = 0;
let score = 0;
let questions = [];

async function fetchQuestions() {
  const res = await fetch('https://the-trivia-api.com/v2/questions');
  const data = await res.json();
  questions = data;
  console.log(data);
  
  showQuestion();
}

function showQuestion() {
  const q = questions[currentQuestionIndex];

  questionEl.innerHTML = decodeHTML(q.question.text);

  const answers = [...q.incorrectAnswers];
  answers.push(q.correctAnswer);
  answers.sort(() => Math.random() - 0.5);

  answersEl.innerHTML = '';
  answers.forEach(answer => {
    const li = document.createElement('li');
    li.innerText = decodeHTML(answer);
    li.addEventListener('click', () => selectAnswer(answer, q.correctAnswer)); // ✅ fixed key
    answersEl.appendChild(li);
  });
}

function selectAnswer(selected, correct) {
  const lis = document.querySelectorAll('li');
  lis.forEach(li => li.style.pointerEvents = 'none');

  if (selected === correct) {
    score++;
  }

  lis.forEach(li => {
    if (li.innerText === decodeHTML(correct)) {
      li.style.backgroundColor = '#2ecc71'; // green
    } else if (li.innerText === decodeHTML(selected)) {
      li.style.backgroundColor = '#e74c3c'; // red
    }
  });

  nextBtn.classList.remove('hidden');
}


nextBtn.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
    nextBtn.classList.add('hidden');
  } else {
    showResult();
  }
});

function showResult() {
  quiz.classList.add('hidden');
  result.classList.remove('hidden');
  scoreEl.innerText = `You scored ${score} out of ${questions.length}`;
}

// Decode HTML Entities
function decodeHTML(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

fetchQuestions();
