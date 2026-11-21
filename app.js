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
    {id:'HIINnCqY3HpMYudYQn', alt:'GIF de dança'},
    {id:'13hxeOYjoTWtK8', alt:'GIF de dança'},
    {id:'8m4R4pvViWtRzbloJ1', alt:'GIF de dança'},
    {id:'EJMyMO22UxP68', alt:'GIF de dança'},
    {id:'8pYMOn1sEb43EloTf8', alt:'GIF de dança'},
    {id:'5xaOcLGvzHxDKjufnLW', alt:'GIF de dança'},
    {id:'Bl10664xbIVkk', alt:'GIF de dança'},
    {id:'BSSfrKSIhnLnQirVeY', alt:'GIF de dança'},
    {id:'J93sVmfYBtsRi', alt:'GIF de dança'},
    {id:'blSTtZehjAZ8I', alt:'GIF de dança'},
    {id:'ujTVMASREzuRbH6zy5', alt:'GIF de dança'},
    {id:'aCB9UFwAw7Nio', alt:'GIF de dança'},
    {id:'atQF1zaSGq8s8', alt:'GIF de dança'},
    {id:'scpcMQTvUkA7STaA27', alt:'GIF de dança'},
    {id:'UZxzsNx1kpZZwTCSSp', alt:'GIF de dança'},
    {id:'y4PQTcLTYJwOI', alt:'GIF de dança'},
    {id:'scftgIpdF1V3eFED52', alt:'GIF de dança'},
    {id:'mFTIkcmQWTbNFrTp2O', alt:'GIF de dança'},
    {id:'RLcQGYmQU36d3FceiP', alt:'GIF de dança'},
    {id:'ybnrXkdf8jAxIkMuwr', alt:'GIF de dança'},
    {id:'pa37AAGzKXoek', alt:'GIF de dança'},
    {id:'iU0oAa9koDTTodFBsf', alt:'GIF de dança'},
    {id:'7sYgj8MHgrto9tZthQ', alt:'GIF de dança'},
    {id:'iWlY7z5YYOtHeSMx5K', alt:'GIF de dança'},
    {id:'DED9Io0FbQXCQq44NM', alt:'GIF de dança'},
    {id:'ckqDWRvXTYUWEhPJqj', alt:'GIF de dança'},
    {id:'VwLzSW0bPiuIuUQbcl', alt:'GIF de dança'},
    {id:'3ohc0ZorDPrDX46jIs', alt:'GIF de dança'},
    {id:'mBXgTu7kJFbZ4PJnBR', alt:'GIF de dança'},
    {id:'8RGjrot0ymGeMZJ9pM', alt:'GIF de dança'},
    {id:'RVk1nmWV5ZkarghgCy', alt:'GIF de dança'},
    {id:'8tViNlYfmCJ9syvQQj', alt:'GIF de dança'},
    {id:'vyfICe0OfKKMUvTx04', alt:'GIF de dança'},
    {id:'oYtVHSxngR3lC', alt:'GIF de surpresa'},
    {id:'5VKbvrjxpVJCM', alt:'GIF de surpresa'},
    {id:'PUBxelwT57jsQ', alt:'GIF de surpresa'},
    {id:'l3q2K5jinAlChoCLS', alt:'GIF de surpresa'},
    {id:'Sqfu14lSonVN219Zb6', alt:'GIF de surpresa'},
    {id:'dnMwfGJPdsqYEbmrD5', alt:'GIF de surpresa'},
    {id:'QenUl470OqVLRtkmdE', alt:'GIF de surpresa'},
    {id:'b8RfbQFaOs1rO10ren', alt:'GIF de surpresa'},
    {id:'QUENDfi6DEMLzQ0CKt', alt:'GIF de surpresa'},
    {id:'WuGSL4LFUMQU', alt:'GIF de surpresa'},
    {id:'jrutBd1N7ZhsINAPzs', alt:'GIF de surpresa'},
    {id:'aWPGuTlDqq2yc', alt:'GIF de surpresa'},
    {id:'lxxOGaDRk4f7R5TkBd', alt:'GIF de surpresa'},
    {id:'RLkcGcTtWc7QyQZqSM', alt:'GIF de surpresa'},
    {id:'vQqeT3AYg8S5O', alt:'GIF de surpresa'},
    {id:'xfu59Ydps8y6gLl5V3', alt:'GIF de surpresa'},
    {id:'M33UV4NDvkTHa', alt:'GIF de surpresa'},
    {id:'3oz8xPIblfyMdZwM8w', alt:'GIF de surpresa'},
    {id:'TIRlx3Fzi1A7L2d5z7', alt:'GIF de surpresa'},
    {id:'kxei1ibnxITFUvvtJU', alt:'GIF de surpresa'},
    {id:'zKBwU2TSfixfz70pJG', alt:'GIF de surpresa'},
    {id:'fpXxIjftmkk9y', alt:'GIF de surpresa'},
    {id:'l1J9FiGxR61OcF2mI', alt:'GIF de surpresa'},
    {id:'l3ih6qeGrTfPO', alt:'GIF de surpresa'},
    {id:'3XR0chfiSTtAI', alt:'GIF de surpresa'},
    {id:'e8kZWeeku0pmdWViJj', alt:'GIF de surpresa'},
    {id:'lsJCkIKV6AT28', alt:'GIF de comemoração'},
    {id:'BlVnrxJgTGsUw', alt:'GIF de comemoração'},
    {id:'l0MYt5jPR6QX5pnqM', alt:'GIF de comemoração'},
    {id:'BPJmthQ3YRwD6QqcVD', alt:'GIF de comemoração'},
    {id:'IwAZ6dvvvaTtdI8SD5', alt:'GIF de comemoração'},
    {id:'s2qXK8wAvkHTO', alt:'GIF de comemoração'},
    {id:'artj92V8o75VPL7AeQ', alt:'GIF de comemoração'},
    {id:'1PMVNNKVIL8Ig', alt:'GIF de comemoração'},
    {id:'Q7utFfqUn7Au5w8sAP', alt:'GIF de comemoração'},
    {id:'PklKBQ4bj7XXRHByqs', alt:'GIF de comemoração'},
    {id:'W6Lwg2xvTr6tJpuSTd', alt:'GIF de comemoração'},
    {id:'YTbZzCkRQCEJa', alt:'GIF de comemoração'},
    {id:'Na33dsU2umStO', alt:'GIF de comemoração'},
    {id:'axu6dFuca4HKM', alt:'GIF de comemoração'},
    {id:'doPrWYzSG1Vao', alt:'GIF de comemoração'},
    {id:'6JzM6pW8Sa8loWxBmt', alt:'GIF de comemoração'},
    {id:'acBIAKLh4eSCURd6pw', alt:'GIF de comemoração'},
    {id:'opDRL3H2A9iLNuvbOv', alt:'GIF de comemoração'},
    {id:'geslvCFM31sFW', alt:'GIF de comemoração'},
    {id:'AbM71atR2TJQq8c7vw', alt:'GIF de comemoração'},
    {id:'DJN88m7rzUwpi0pblu', alt:'GIF de comemoração'},
    {id:'c1AfqKTvATepFDTpnY', alt:'GIF de comemoração'},
    {id:'6oMKugqovQnjW', alt:'GIF de comemoração'},
    {id:'ePaw7nwYmSI1t389Sy', alt:'GIF de comemoração'},
    {id:'3o7abldj0b3rxrZUxW', alt:'GIF de comemoração'},
    {id:'Vpbfjm1wjl2bMwNAx1', alt:'GIF de comemoração'},
    {id:'0dKHpamGLycEt3Ffyg', alt:'GIF de comemoração'},
    {id:'K7sRvxEVDx1ypvk1E1', alt:'GIF de comemoração'},
    {id:'U0O22ihibGH3cfEawu', alt:'GIF de comemoração'},
    {id:'NSrjLatVjOB8CEJ3R7', alt:'GIF de comemoração'},
    {id:'MZrbYTN8Igeu26IubO', alt:'GIF de comemoração'},
    {id:'2Y8z33M0GB6EqIwnEE', alt:'GIF de comemoração'},
    {id:'PPT3zw7o6UcUOHu7jE', alt:'GIF de comemoração'},
    {id:'JWHKTOjqfV91wKdNmF', alt:'GIF de comemoração'},
    {id:'PAiVD8zhnQSoya1P6y', alt:'GIF de comemoração'},
    {id:'kF09SNtCbPYpePmFFZ', alt:'GIF de dança'},
    {id:'MSTqntEzXV7BmCrhA7', alt:'GIF de dança'},
    {id:'3ohhwAlGml7cvIjhks', alt:'GIF de dança'},
    {id:'cniIdOj3l8JfJjIT4i', alt:'GIF de surpresa'},
    {id:'4cUCFvwICarHq', alt:'GIF de surpresa'},
    {id:'vvjUbQlZc5KzkHKBTF', alt:'GIF de surpresa'},
    {id:'xThtadJ0MZ1rqlc3VS', alt:'GIF de comemoração'},
    {id:'cBUEZW2ZEVBCxqDTPS', alt:'GIF de comemoração'},
    {id:'JZLaL7vxYBMwOw4Vjd', alt:'GIF de comemoração'}
  ];
  const gifStorageKey = 'etecRosimeireGifCycle';
  const gifIds = reactionGifs.map(gif => gif.id);
  const legacyGifIds = ['kF09SNtCbPYpePmFFZ','MSTqntEzXV7BmCrhA7','3ohhwAlGml7cvIjhks','cniIdOj3l8JfJjIT4i','4cUCFvwICarHq','vvjUbQlZc5KzkHKBTF','xThtadJ0MZ1rqlc3VS','cBUEZW2ZEVBCxqDTPS','JZLaL7vxYBMwOw4Vjd'];
  let previousGifId = '';
  let gifDeck = [];
  let gifSeen = new Set();
  try {
    const savedGifState = JSON.parse(localStorage.getItem(gifStorageKey) || '{}');
    const availableIds = new Set(gifIds);
    previousGifId = availableIds.has(savedGifState.last) ? savedGifState.last : '';
    if (Array.isArray(savedGifState.catalog)) {
      gifSeen = new Set(Array.isArray(savedGifState.seen) ? savedGifState.seen.filter(id => availableIds.has(id)) : []);
      gifDeck = Array.isArray(savedGifState.deck) ? savedGifState.deck.filter(id => availableIds.has(id) && !gifSeen.has(id)) : [];
      const oldCatalog = new Set(savedGifState.catalog);
      const addedIds = gifIds.filter(id => !oldCatalog.has(id) && !gifSeen.has(id) && !gifDeck.includes(id));
      gifDeck = [...gifDeck, ...shuffle(addedIds)];
    } else if (Array.isArray(savedGifState.deck) || savedGifState.last) {
      const oldRemaining = new Set(Array.isArray(savedGifState.deck) ? savedGifState.deck : []);
      const oldIds = new Set(legacyGifIds);
      gifSeen = new Set(legacyGifIds.filter(id => !oldRemaining.has(id)));
      const remainingOld = [...oldRemaining].filter(id => availableIds.has(id) && !gifSeen.has(id));
      const newIds = gifIds.filter(id => !oldIds.has(id));
      gifDeck = shuffle([...remainingOld, ...newIds]);
    }
  } catch {
    // Continua com um ciclo aleatório em memória se o armazenamento do navegador estiver indisponível.
  }
  function showRandomGif() {
    if (!gifDeck.length) {
      const unseen = gifIds.filter(id => !gifSeen.has(id));
      const nextCycle = unseen.length ? unseen : gifIds;
      if (!unseen.length) gifSeen.clear();
      gifDeck = shuffle(nextCycle);
      if (gifDeck.length > 1 && gifDeck[0] === previousGifId) {
        [gifDeck[0], gifDeck[1]] = [gifDeck[1], gifDeck[0]];
      }
    }
    const gif = reactionGifs.find(item => item.id === gifDeck.shift());
    if (!gif) return;
    previousGifId = gif.id;
    gifSeen.add(gif.id);
    try {
      localStorage.setItem(gifStorageKey, JSON.stringify({catalog: gifIds, deck: gifDeck, seen: [...gifSeen], last: previousGifId}));
    } catch {
      // O ciclo em memória continua mesmo sem armazenamento local.
    }
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
