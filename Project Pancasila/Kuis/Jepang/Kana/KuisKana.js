async function fetchTextFile(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .catch(error => {
      console.error('There was a problem fetching the text file:', error);
    });
}

const csv2json = (str, delimiter = ';') => {
  const titles = str.slice(0, str.indexOf('\n')).split(delimiter);
  const rows = str.slice(str.indexOf('\n') + 1).split('\n');
  return rows.map(row => {
    const values = row.split(delimiter);
    return titles.reduce((object, curr, i) => (object[curr] = values[i], object), {})
  });
};

const csv = './SoalKana.txt';

const questionElement = document.getElementById("question");
const optionsElements = document.getElementById("options");
const scoreElement = document.getElementById("score");
let questionNumber = 0;
let currentQuestion = Math.floor(Math.random()*66);
let score = 0;

async function showQuestion() {
  let quizData = await fetchTextFile(csv)
  .then(text => {
    return csv2json(text, ";");
  });
  console.log(quizData);
  console.log(currentQuestion);

  const question = quizData[currentQuestion];
  let pattern = Math.floor(Math.random()*4);
  console.log(pattern);
  let opsi = [" ", " ", " ", " "];
  if (pattern==0){
    questionElement.innerText = question.hiragana;
    opsi = [quizData[Math.floor(Math.random()*66)].romaji,quizData[Math.floor(Math.random()*66)].romaji,quizData[Math.floor(Math.random()*66)].romaji,quizData[Math.floor(Math.random()*66)].romaji];
    opsi[Math.floor(Math.random()*4)] = question.romaji;
  }
  else if (pattern==1){
    questionElement.innerText = question.katakana;
    opsi = [quizData[Math.floor(Math.random()*66)].romaji,quizData[Math.floor(Math.random()*66)].romaji,quizData[Math.floor(Math.random()*66)].romaji,quizData[Math.floor(Math.random()*66)].romaji];
    opsi[Math.floor(Math.random()*4)] = question.romaji;
  }
  else if (pattern==2){
    questionElement.innerText = question.romaji;
    opsi = [quizData[Math.floor(Math.random()*66)].hiragana,quizData[Math.floor(Math.random()*66)].hiragana,quizData[Math.floor(Math.random()*66)].hiragana,quizData[Math.floor(Math.random()*66)].hiragana];
    opsi[Math.floor(Math.random()*4)] = question.hiragana;
  }
  else{
    questionElement.innerText = question.romaji;
    opsi = [quizData[Math.floor(Math.random()*66)].katakana,quizData[Math.floor(Math.random()*66)].katakana,quizData[Math.floor(Math.random()*66)].katakana,quizData[Math.floor(Math.random()*66)].katakana];
    opsi[Math.floor(Math.random()*4)] = question.katakana;
  }

  //const question = quizData[currentQuestion];
  // const options = [question.option1, question.option2, question.option3, question.option4];
  // questionElement.innerText = question.question;

  optionsElements.innerHTML = "";
  opsi.forEach(option => {
    const button = document.createElement("button");
    button.innerText = option;
    optionsElements.appendChild(button);
    button.addEventListener("click", selectAnswer);
    button.myParam = quizData;
  });
}

function selectAnswer(e) {
  const selectedButton = e.target;
  const quizData = e.target.myParam;
  // let answer = quizData[currentQuestion].answer.charAt(0);
  // switch (answer) {
  //   case "1": answer = quizData[currentQuestion].option1;
  //   break;
  //   case "2": answer = quizData[currentQuestion].option2;
  //   break;
  //   case "3": answer = quizData[currentQuestion].option3;
  //   break;
  //   default: answer = quizData[currentQuestion].option4;
  //   break;
  // }

  if (selectedButton.innerText === quizData[currentQuestion].hiragana ||selectedButton.innerText===quizData[currentQuestion].katakana|| selectedButton.innerText===quizData[currentQuestion].romaji) {
    score++;
  }

  currentQuestion = Math.floor(Math.random() * quizData.length);
  questionNumber++;

  if (questionNumber < 5) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() { 
  questionElement.innerText = "Kuis Selesai"; 
  
  scoreElement.innerHTML="Skor kamu: " +score+" / 5";
  optionsElements.innerHTML = "";
  const button = document.createElement("button");
  button.innerText = "Coba lagi";
  optionsElements.appendChild(button);
  button.addEventListener("click", tryAgain);
}

function tryAgain(){
  questionNumber = 0;
  score=0;
  scoreElement.innerHTML="";
  showQuestion();
}

showQuestion();