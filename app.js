(() => {
  const welcome = document.querySelector('#welcome');
  const quiz = document.querySelector('#quiz');
  const result = document.querySelector('#result');
  const form = document.querySelector('#start-form');
  const content = document.querySelector('#question-content');
  let name = '', selected = [], answers = {}, current = 0, previousSet = '';

  function shuffle(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  function begin(count) {
    let pool = shuffle(window.QUESTIONS);
    let ids = pool.slice(0, count).map(q => q.text).sort().join('|');
    if (ids === previousSet) pool = shuffle(window.QUESTIONS);
    selected = pool.slice(0, count).map(q => ({...q, order: shuffle([0,1,2,3,4])}));
    previousSet = selected.map(q => q.text).sort().join('|');
    answers = {}; current = 0;
    welcome.classList.add('hidden'); result.classList.add('hidden'); quiz.classList.remove('hidden');
    document.querySelector('#student-greeting').textContent = `Boa prova, ${name}!`;
    render(); window.scrollTo({top:0,behavior:'smooth'});
  }
  function render() {
    const q = selected[current];
    document.querySelector('#progress-label').textContent = `Questão ${current + 1} de ${selected.length}`;
    document.querySelector('#progress-bar').style.width = `${((current + 1) / selected.length) * 100}%`;
    const options = q.order.map((original, index) => `<label class="answer"><input type="radio" name="answer" value="${original}" ${answers[current] === original ? 'checked' : ''}><span class="letter">${'ABCDE'[index]})</span><span>${q.options[original]}</span></label>`).join('');
    content.innerHTML = `<p class="question-number">${q.topic}</p><p class="question-text">${q.text}</p><div class="answers">${options}</div>`;
    content.querySelectorAll('input').forEach(input => input.addEventListener('change', () => { answers[current] = Number(input.value); }));
    document.querySelector('#previous-button').disabled = current === 0;
    document.querySelector('#next-button').textContent = current === selected.length - 1 ? 'Finalizar prova ✓' : 'Próxima →';
  }
  function finish() {
    const correct = selected.reduce((total, q, i) => total + (answers[i] === q.answer ? 1 : 0), 0);
    quiz.classList.add('hidden'); result.classList.remove('hidden');
    document.querySelector('#result-name').textContent = name;
    document.querySelector('#score-number').textContent = `${correct}/${selected.length}`;
    document.querySelector('#score-detail').textContent = `${Math.round(correct / selected.length * 100)}% de acertos`;
    document.querySelector('#result-message').textContent = correct === selected.length ? 'Excelente resultado! Continue praticando para manter esse ritmo.' : correct >= selected.length * .7 ? 'Bom trabalho! Revise as questões abaixo e siga praticando.' : 'A prática ajuda a avançar. Confira as respostas e tente novamente.';
    document.querySelector('#answer-review').innerHTML = selected.map((q, i) => {
      const ok = answers[i] === q.answer;
      const chosen = answers[i] === undefined ? 'Não respondida' : `${'ABCDE'[q.order.indexOf(answers[i])]}) ${q.options[answers[i]]}`;
      const right = `${'ABCDE'[q.order.indexOf(q.answer)]}) ${q.options[q.answer]}`;
      return `<div class="review-item"><strong>Questão ${i + 1} · ${q.topic}</strong><br><span class="${ok ? 'correct' : 'incorrect'}">${ok ? 'Acertou' : 'Sua resposta: ' + chosen}</span>${ok ? '' : `<br>Resposta correta: ${right}`}</div>`;
    }).join('');
    window.scrollTo({top:0,behavior:'smooth'});
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    name = document.querySelector('#student-name').value.trim();
    const count = Number(new FormData(form).get('count'));
    if (name) begin(count);
  });
  document.querySelector('#previous-button').addEventListener('click', () => { if (current > 0) { current--; render(); } });
  document.querySelector('#next-button').addEventListener('click', () => {
    if (answers[current] === undefined) {
      content.querySelector('.answers').scrollIntoView({behavior:'smooth',block:'center'});
      content.querySelector('.answers').style.outline = '2px solid #b85448';
      setTimeout(() => content.querySelector('.answers')?.style.removeProperty('outline'), 1200);
      return;
    }
    if (current === selected.length - 1) finish(); else { current++; render(); }
  });
  document.querySelector('#retry-button').addEventListener('click', () => { result.classList.add('hidden'); welcome.classList.remove('hidden'); window.scrollTo({top:0,behavior:'smooth'}); });
})();
