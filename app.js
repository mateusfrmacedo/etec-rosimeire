(() => {
  const welcome = document.querySelector('#welcome');
  const quiz = document.querySelector('#quiz');
  const result = document.querySelector('#result');
  const form = document.querySelector('#start-form');
  const content = document.querySelector('#question-content');
  let name = '', selected = [], answers = {}, current = 0, previousSet = new Set(), activeDifficulty = 'facil';
  const usedByLevel = {facil: new Set(), medio: new Set(), dificil: new Set()};

  function shuffle(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  function begin(count) {
    const bank = shuffle(window.QUESTIONS.filter(q => q.level === activeDifficulty));
    const used = usedByLevel[activeDifficulty];
    count = Math.min(count, bank.length);
    if (used.size === bank.length) used.clear();
    let chosen = shuffle(bank.filter(q => !used.has(q.text) && !previousSet.has(q.text))).slice(0, count);
    if (chosen.length < count) {
      const chosenTexts = new Set(chosen.map(q => q.text));
      const recycled = shuffle(bank.filter(q => used.has(q.text) && !previousSet.has(q.text) && !chosenTexts.has(q.text)));
      chosen = [...chosen, ...recycled.slice(0, count - chosen.length)];
    }
    if (chosen.length < count) {
      used.clear();
      chosen = shuffle(bank.filter(q => !previousSet.has(q.text))).slice(0, count);
    }
    selected = chosen.map(q => ({...q, order: shuffle([0,1,2,3,4])}));
    selected.forEach(q => used.add(q.text));
    previousSet = new Set(selected.map(q => q.text));
    answers = {}; current = 0;
    welcome.classList.add('hidden'); result.classList.add('hidden'); quiz.classList.remove('hidden');
    document.querySelector('#student-greeting').textContent = `Boa prova, ${name}! · ${activeDifficulty[0].toUpperCase()+activeDifficulty.slice(1)}`;
    render(); window.scrollTo({top:0,behavior:'smooth'});
  }
  function render() {
    const q = selected[current];
    document.querySelector('#progress-label').textContent = `Questão ${current + 1} de ${selected.length}`;
    document.querySelector('#progress-bar').style.width = `${((current + 1) / selected.length) * 100}%`;
    const options = q.order.map((original, index) => `<label class="answer"><input type="radio" name="answer" value="${original}" ${answers[current] === original ? 'checked' : ''}><span class="letter">${'ABCDE'[index]})</span><span>${q.options[original]}</span></label>`).join('');
    const provenance = q.sourceType === 'adaptada'
      ? `Adaptada do ${q.sourceExam || 'Vestibulinho ETEC'}${q.sourceQuestion ? ` · questão ${q.sourceQuestion}` : ''}`
      : 'Questão autoral · prática no padrão ETEC';
    content.innerHTML = `<p class="question-number">${q.topic.split('·')[0].trim()}</p><p class="question-source">${provenance}</p><p class="question-text">${q.text}</p><div class="answers">${options}</div>`;
    content.querySelectorAll('input').forEach(input => input.addEventListener('change', () => { answers[current] = Number(input.value); }));
    document.querySelector('#previous-button').disabled = current === 0;
    document.querySelector('#next-button').textContent = current === selected.length - 1 ? 'Finalizar prova ✓' : 'Próxima →';
  }
  const reactionGifs = [
    {id:'kF09SNtCbPYpePmFFZ', alt:'Dançando de alegria'},
    {id:'MSTqntEzXV7BmCrhA7', alt:'Dança da vitória'},
    {id:'3ohhwAlGml7cvIjhks', alt:'Dança feliz'},
    {id:'cniIdOj3l8JfJjIT4i', alt:'Surpresa e espanto'},
    {id:'4cUCFvwICarHq', alt:'Reação de surpresa'},
    {id:'vvjUbQlZc5KzkHKBTF', alt:'Uau!'},
    {id:'xThtadJ0MZ1rqlc3VS', alt:'Comemoração'},
    {id:'cBUEZW2ZEVBCxqDTPS', alt:'Festa e comemoração'},
    {id:'JZLaL7vxYBMwOw4Vjd', alt:'Comemoração colorida'}
  ];
  let previousGifId = '';
  function showRandomGif() {
    const options = reactionGifs.filter(gif => gif.id !== previousGifId);
    const gif = options[Math.floor(Math.random() * options.length)];
    previousGifId = gif.id;
    document.querySelector('#gif-frame').innerHTML = `<img src="https://media.giphy.com/media/${gif.id}/giphy.gif" alt="${gif.alt}" loading="lazy" referrerpolicy="no-referrer">`;
  }
  function finish() {
    const correct = selected.reduce((total, q, i) => total + (answers[i] === q.answer ? 1 : 0), 0);
    quiz.classList.add('hidden'); result.classList.remove('hidden');
    document.querySelector('#result-name').textContent = name;
    document.querySelector('#score-number').textContent = `${correct}/${selected.length}`;
    document.querySelector('#score-detail').textContent = `${Math.round(correct / selected.length * 100)}% de acertos`;
    const percentage = correct / selected.length * 100;
    const feedback = percentage === 100
      ? 'Excelente. Você é demais!!!'
      : percentage > 80
        ? 'Parabéns, está no caminho certo!'
        : percentage > 50
          ? 'Está indo bem! Muito bem, vamos continuar estudando.'
          : 'Não desanime, vamos continuar estudando!';
    document.querySelector('#result-message').textContent = feedback;
    document.querySelector('#motivation').textContent = window.MOTIVATIONS[Math.floor(Math.random() * window.MOTIVATIONS.length)];
    showRandomGif();
    document.querySelector('#answer-review').innerHTML = selected.map((q, i) => {
      const ok = answers[i] === q.answer;
      const chosen = answers[i] === undefined ? 'Não respondida' : `${'ABCDE'[q.order.indexOf(answers[i])]}) ${q.options[answers[i]]}`;
      const right = `${'ABCDE'[q.order.indexOf(q.answer)]}) ${q.options[q.answer]}`;
      const stem = q.text;
      const alternatives = q.order.map((idx, oi) => `${'ABCDE'[oi]}) ${q.options[idx]}`).join('<br>');
      const sourceLabel = q.sourceType === 'adaptada' ? `Adaptada do ${q.sourceExam || 'Vestibulinho ETEC'}${q.sourceQuestion ? ` · questão ${q.sourceQuestion}` : ''}` : 'Questão autoral · prática no padrão ETEC';
      return `<div class="review-item"><strong>Questão ${i + 1} · ${q.topic.split('·')[0].trim()}</strong><p class="question-source">${sourceLabel}</p><p>${stem}</p><p>${alternatives}</p><span class="${ok ? 'correct' : 'incorrect'}">${ok ? 'Sua resposta: ' + chosen + ' · Acertou' : 'Sua resposta: ' + chosen}</span>${ok ? '' : `<br>Resposta correta: ${right}`}</div>`;
    }).join('');
    window.scrollTo({top:0,behavior:'smooth'});
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    name = document.querySelector('#student-name').value.trim();
    const values = new FormData(form);
    const count = Number(values.get('count'));
    activeDifficulty = values.get('difficulty');
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
  document.querySelector('#download-button').addEventListener('click', () => {
    document.querySelector('#exam-date').textContent = new Date().toLocaleDateString('pt-BR');
    window.print();
  });
  function updateAvailableCounts() {
    const level = new FormData(form).get('difficulty');
    const available = window.QUESTIONS.filter(q => q.level === level).length;
    form.querySelectorAll('input[name="count"]').forEach(input => {
      input.disabled = Number(input.value) > available;
      if (input.disabled && input.checked) {
        const fallback = form.querySelector('input[name="count"]:not(:disabled)');
        if (fallback) fallback.checked = true;
      }
    });
    document.querySelector('#pool-note').textContent = `Banco: ${window.QUESTIONS.length} questões · ${available} no nível ${level}.`;
  }
  form.querySelectorAll('input[name="difficulty"]').forEach(input => input.addEventListener('change', updateAvailableCounts));
  updateAvailableCounts();
  document.querySelector('#retry-button').addEventListener('click', () => { result.classList.add('hidden'); welcome.classList.remove('hidden'); window.scrollTo({top:0,behavior:'smooth'}); });
})();
