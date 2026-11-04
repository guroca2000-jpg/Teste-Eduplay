// EduPlay — protótipo front-end. O armazenamento local será substituído pelo Supabase.
const STORAGE = {
  students: "eduplay_students_v2",
  current: "eduplay_current_v2",
  activities: "eduplay_teacher_activities_v2"
};
const getStudents = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE.students)) || []; }
  catch { return []; }
};
const saveStudents = students => localStorage.setItem(STORAGE.students, JSON.stringify(students));
const getActivities = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE.activities)) || []; }
  catch { return []; }
};
const saveActivities = activities => localStorage.setItem(STORAGE.activities, JSON.stringify(activities));
const getCurrent = () => localStorage.getItem(STORAGE.current) || "";
const getCurrentStudent = () => getStudents().find(s => s.email === getCurrent());
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function toast(message) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message; el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2600);
}
function refreshUser() {
  const student = getCurrentStudent();
  const nav = document.getElementById("navUser");
  if (nav) nav.textContent = student ? student.name : "Visitante";
  const avatar = document.querySelector(".avatar");
  if (avatar) avatar.textContent = student ? student.name.charAt(0).toUpperCase() : "A";
}
function awardXP(points) {
  const email = getCurrent();
  if (!email) { toast("Faça seu cadastro para registrar seus pontos."); return; }
  const students = getStudents();
  const student = students.find(s => s.email === email);
  if (!student) return;
  student.xp = (student.xp || 0) + points;
  saveStudents(students);
  toast(`Muito bem! Você ganhou ${points} XP.`);
}

// Cadastro — sem contas fictícias ou alunos de exemplo.
const modal = document.getElementById("loginModal");
document.getElementById("loginOpen")?.addEventListener("click", () => {
  if (!modal) return;
  modal.hidden = false;
  const student = getCurrentStudent();
  if (student) {
    document.getElementById("studentName").value = student.name;
    document.getElementById("studentEmail").value = student.email;
  }
});
document.getElementById("loginClose")?.addEventListener("click", () => modal.hidden = true);
modal?.addEventListener("click", e => { if (e.target === modal) modal.hidden = true; });
document.getElementById("loginForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("studentName").value.trim();
  const email = document.getElementById("studentEmail").value.trim().toLowerCase();
  if (!name || !email) return;
  const students = getStudents();
  const existing = students.find(s => s.email === email);
  if (existing) {
    existing.name = name;
    saveStudents(students);
  } else {
    students.push({ name, email, xp: 0, createdAt: new Date().toISOString() });
    saveStudents(students);
  }
  localStorage.setItem(STORAGE.current, email);
  modal.hidden = true;
  refreshUser();
  toast(existing ? "Cadastro atualizado." : "Cadastro realizado! Bem-vindo ao EduPlay.");
});
document.getElementById("mobileMenu")?.addEventListener("click", () => document.querySelector(".nav-links")?.classList.toggle("open"));
document.querySelectorAll("[data-start-quiz]").forEach(b => b.addEventListener("click", () => document.getElementById("quiz")?.scrollIntoView({behavior:"smooth"})));
document.getElementById("missionBtn")?.addEventListener("click", () => toast("Missão: revise o conteúdo de Química e anote 3 conceitos importantes."));
document.getElementById("groupBtn")?.addEventListener("click", () => toast("Atividades em grupo: recurso em desenvolvimento."));

// Banco inicial de perguntas de Química — sem perguntas de outras matérias.
const chemistryQuestions = [
 {q:"Qual é a fórmula química da água?",a:["CO₂","H₂O","O₂","NaCl"],c:1,e:"A água é formada por dois átomos de hidrogênio e um de oxigênio: H₂O."},
 {q:"Qual partícula possui carga elétrica negativa?",a:["Próton","Nêutron","Elétron","Núcleo"],c:2,e:"O elétron possui carga negativa. O próton é positivo e o nêutron não possui carga."},
 {q:"Qual é o símbolo químico do ouro?",a:["Ag","Au","Fe","O"],c:1,e:"O símbolo do ouro é Au, derivado do nome latino aurum."},
 {q:"Uma solução com pH 3 é considerada:",a:["Ácida","Neutra","Básica","Metálica"],c:0,e:"Valores de pH menores que 7 indicam soluções ácidas."},
 {q:"Qual é o gás mais abundante na atmosfera terrestre?",a:["Oxigênio","Gás carbônico","Nitrogênio","Hidrogênio"],c:2,e:"O nitrogênio corresponde a aproximadamente 78% do ar atmosférico."},
 {q:"Qual é o símbolo químico do sódio?",a:["S","So","Na","Sd"],c:2,e:"O símbolo do sódio é Na, do latim natrium."},
 {q:"Qual destes é um exemplo de mistura homogênea?",a:["Água e óleo","Areia e água","Água com sal dissolvido","Granito"],c:2,e:"Quando o sal se dissolve completamente, forma uma mistura homogênea, com uma única fase visível."},
 {q:"O número atômico de um elemento corresponde ao número de:",a:["Nêutrons","Prótons","Prótons + nêutrons","Camadas eletrônicas"],c:1,e:"O número atômico (Z) é a quantidade de prótons no núcleo do átomo."},
 {q:"Qual ligação química ocorre pelo compartilhamento de elétrons?",a:["Iônica","Covalente","Metálica","Nuclear"],c:1,e:"Na ligação covalente, os átomos compartilham pares de elétrons."},
 {q:"Qual é a fórmula do gás carbônico?",a:["CO","CO₂","CaO","C₂O"],c:1,e:"O dióxido de carbono possui um átomo de carbono e dois de oxigênio: CO₂."},
 {q:"A passagem do estado líquido para o gasoso é chamada de:",a:["Fusão","Solidificação","Condensação","Vaporização"],c:3,e:"Vaporização é a transformação do líquido em gás. Pode ocorrer por evaporação ou ebulição."},
 {q:"Qual é o principal componente do sal de cozinha?",a:["Cloreto de sódio","Bicarbonato de sódio","Carbonato de cálcio","Cloreto de potássio"],c:0,e:"O sal de cozinha é formado principalmente por cloreto de sódio (NaCl)."},
 {q:"Em uma reação química, os reagentes são:",a:["As substâncias formadas","As substâncias iniciais","Apenas os gases","Os catalisadores"],c:1,e:"Reagentes são as substâncias que participam inicialmente da reação e se transformam em produtos."},
 {q:"Qual é o valor aproximado da massa molar da água (H₂O)?",a:["10 g/mol","18 g/mol","28 g/mol","32 g/mol"],c:1,e:"H₂O: 2 × 1 g/mol do hidrogênio + 16 g/mol do oxigênio = 18 g/mol."},
 {q:"Qual destes elementos é um metal?",a:["Oxigênio","Enxofre","Ferro","Cloro"],c:2,e:"O ferro (Fe) é um elemento metálico, muito utilizado na fabricação de ligas como o aço."},
 {q:"O que indica uma fórmula química?",a:["A cor da substância","Os elementos e suas proporções","A temperatura de ebulição","A velocidade da reação"],c:1,e:"A fórmula química representa quais elementos formam a substância e a proporção entre seus átomos."},
 {q:"Qual é o símbolo químico do oxigênio?",a:["Ox","O","Og","Oi"],c:1,e:"O símbolo do elemento oxigênio é O."},
 {q:"Uma substância com pH 9 é:",a:["Ácida","Neutra","Básica","Radioativa"],c:2,e:"Valores de pH maiores que 7 indicam soluções básicas ou alcalinas."},
 {q:"Qual método pode separar areia da água?",a:["Filtração","Destilação fracionada","Imantação","Cromatografia"],c:0,e:"A filtração retém a areia no filtro e permite a passagem da água."},
 {q:"O que é um catalisador?",a:["Uma substância que altera a velocidade da reação sem ser consumida no processo global","Um produto final","Um tipo de átomo","Uma solução sempre ácida"],c:0,e:"O catalisador oferece um caminho de menor energia de ativação e não é consumido na reação global."},
 {q:"Qual é a carga elétrica de um próton?",a:["Negativa","Positiva","Neutra","Variável"],c:1,e:"O próton possui carga elétrica positiva."},
 {q:"Qual é o nome da transformação de sólido diretamente para gás?",a:["Condensação","Sublimação","Fusão","Solidificação"],c:1,e:"Sublimação é a passagem direta do estado sólido para o gasoso."},
 {q:"Qual é a fórmula do oxigênio molecular presente no ar?",a:["O","O₂","O₃","H₂O"],c:1,e:"O oxigênio que compõe grande parte do ar está principalmente na forma de moléculas O₂."},
 {q:"Qual equipamento é usado para medir o volume de líquidos com precisão em laboratório?",a:["Béquer comum","Proveta","Pinça","Espátula"],c:1,e:"A proveta é um instrumento graduado utilizado para medir volumes de líquidos."},
 {q:"Na tabela periódica, os elementos de uma mesma família geralmente possuem:",a:["O mesmo número de camadas","Propriedades químicas semelhantes","A mesma massa","O mesmo número de nêutrons"],c:1,e:"Elementos de uma mesma família têm configuração semelhante na camada de valência e, por isso, propriedades químicas parecidas."},
 {q:"Qual é o produto da reação entre um ácido e uma base, em uma neutralização comum?",a:["Sal e água","Apenas oxigênio","Metal e gás","Apenas água oxigenada"],c:0,e:"Em uma neutralização ácido-base comum, formam-se sal e água."},
 {q:"Qual é a unidade usada para quantidade de matéria no SI?",a:["Grama","Litro","Mol","Pascal"],c:2,e:"A unidade de quantidade de matéria no Sistema Internacional é o mol."},
 {q:"Qual destes valores representa uma solução neutra a 25 °C?",a:["pH 2","pH 5","pH 7","pH 12"],c:2,e:"A 25 °C, uma solução neutra apresenta pH igual a 7."},
 {q:"Qual é o nome do processo de separação baseado em diferentes pontos de ebulição?",a:["Destilação","Filtração","Decantação","Peneiração"],c:0,e:"A destilação separa componentes aproveitando diferenças em seus pontos de ebulição."},
 {q:"O que acontece com os átomos durante uma reação química comum?",a:["São destruídos","Transformam-se em energia e desaparecem","Reorganizam-se formando novas substâncias","Perdem todos os prótons"],c:2,e:"Em reações químicas comuns, os átomos são reorganizados; não são criados nem destruídos."}
];
let questions = [...chemistryQuestions];
let qIndex = 0, answered = false, correctCount = 0;
function renderQuestion() {
  const q = questions[qIndex]; if (!q) return;
  answered = false;
  document.getElementById("questionText").textContent = q.q;
  document.getElementById("questionCount").textContent = `${String(qIndex+1).padStart(2,"0")} / ${String(questions.length).padStart(2,"0")}`;
  document.getElementById("quizProgress").style.width = `${(qIndex+1)/questions.length*100}%`;
  document.getElementById("quizHint").textContent = "Escolha uma alternativa para continuar.";
  document.getElementById("nextQuestion").disabled = true;
  document.getElementById("nextQuestion").textContent = qIndex === questions.length-1 ? "Finalizar ✓" : "Próxima →";
  document.getElementById("quizFeedback").hidden = true;
  const list = document.getElementById("answerList"); list.innerHTML = "";
  q.a.forEach((answer,i) => {
    const b = document.createElement("button"); b.className = "answer-option";
    b.innerHTML = `<span class="letter">${"ABCD"[i]}</span><span>${escapeHTML(answer)}</span>`;
    b.addEventListener("click", () => chooseAnswer(i,b)); list.appendChild(b);
  });
}
function chooseAnswer(i, button) {
  if (answered) return;
  answered = true;
  const q = questions[qIndex], feedback = document.getElementById("quizFeedback");
  const buttons = [...document.querySelectorAll(".answer-option")];
  buttons.forEach((b,n) => { b.disabled = true; if (n === q.c) b.classList.add("correct"); });
  if (i === q.c) { correctCount++; feedback.textContent = "Resposta correta! " + q.e; feedback.className = "quiz-feedback"; awardXP(10); }
  else { button.classList.add("wrong"); feedback.textContent = "Vamos aprender: " + q.e; feedback.className = "quiz-feedback wrong-feedback"; }
  feedback.hidden = false;
  document.getElementById("quizHint").textContent = "Resposta registrada.";
  document.getElementById("nextQuestion").disabled = false;
}
document.getElementById("nextQuestion")?.addEventListener("click", () => {
  if (qIndex < questions.length-1) { qIndex++; renderQuestion(); return; }
  const area = document.getElementById("questionArea");
  area.innerHTML = `<div class="empty-state"><div style="font-size:38px">🧪</div><h3>Atividade concluída!</h3><p>Você acertou ${correctCount} de ${questions.length} perguntas.</p><button class="btn btn-primary btn-small" id="restartQuiz">Refazer atividade</button></div>`;
  document.getElementById("quizFeedback").hidden = true;
  document.querySelector(".quiz-panel-foot").style.display = "none";
  document.getElementById("restartQuiz").addEventListener("click", () => {
    qIndex = 0; correctCount = 0; questions = [...chemistryQuestions];
    document.querySelector(".quiz-panel-foot").style.display = "flex";
    area.innerHTML = '<h3 id="questionText"></h3><div class="answer-list" id="answerList"></div>';
    renderQuestion();
  });
});
refreshUser();
if (document.getElementById("questionText")) renderQuestion();

// Página do aluno
if (document.getElementById("studentGreeting")) {
  const student = getCurrentStudent();
  document.getElementById("studentGreeting").textContent = student ? `Olá, ${student.name}!` : "Olá, visitante!";
  document.getElementById("studentXP").textContent = `${(student?.xp || 0).toLocaleString("pt-BR")} XP acumulados`;
}

// Ranking: somente cadastros reais feitos neste protótipo. Sem alunos fictícios.
if (document.getElementById("rankingRows")) {
  const students = getStudents().sort((a,b) => (b.xp||0) - (a.xp||0));
  const podium = document.getElementById("podium");
  const medals = ["🥇","🥈","🥉"], order = [1,0,2];
  podium.innerHTML = order.map(i => students[i] ? `<div class="podium-card ${i===0?"first":""}"><div class="podium-medal">${medals[i]}</div><b>${escapeHTML(students[i].name)}</b><small>${students[i].xp||0} XP</small></div>` : "").join("");
  document.getElementById("studentCount").textContent = `${students.length} aluno(s) cadastrado(s)`;
  document.getElementById("rankingRows").innerHTML = students.map((s,i) =>
    `<div class="ranking-row"><div class="rank-number">${i+1}º</div><div class="rank-student"><span class="rank-avatar">${escapeHTML(s.name.charAt(0).toUpperCase())}</span>${escapeHTML(s.name)} ${s.email===getCurrent()?"(você)":""}</div><div class="rank-points">${(s.xp||0).toLocaleString("pt-BR")} XP</div></div>`
  ).join("") || '<div class="empty-state">Ainda não há alunos cadastrados. O ranking aparecerá quando os alunos criarem suas contas.</div>';
}

// Painel do professor: criar perguntas de múltipla escolha ou resposta escrita (linha para responder).
if (document.getElementById("teacherQuestionForm")) {
  const form = document.getElementById("teacherQuestionForm");
  const type = document.getElementById("questionType");
  const choiceFields = document.getElementById("choiceFields");
  const activityList = document.getElementById("createdQuestions");
  function renderCreated() {
    const activities = getActivities();
    activityList.innerHTML = activities.length ? activities.map((a,i) =>
      `<div class="created-question"><b>${i+1}. ${escapeHTML(a.prompt)}</b><small>${a.type==="choice"?"Múltipla escolha":"Resposta escrita"} • ${escapeHTML(a.subject||"Química")}</small><button type="button" class="btn btn-ghost btn-small" data-remove-question="${i}">Excluir</button></div>`
    ).join("") : '<div class="empty-state">Você ainda não criou perguntas.</div>';
    activityList.querySelectorAll("[data-remove-question]").forEach(btn => btn.addEventListener("click", () => {
      const items = getActivities(); items.splice(Number(btn.dataset.removeQuestion),1); saveActivities(items); renderCreated();
    }));
  }
  type?.addEventListener("change", () => choiceFields.hidden = type.value !== "choice");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const prompt = document.getElementById("questionPrompt").value.trim();
    const subject = document.getElementById("questionSubject").value.trim() || "Química";
    if (!prompt) return;
    const item = {prompt, subject, type:type.value, createdAt:new Date().toISOString()};
    if (type.value === "choice") {
      item.options = [1,2,3,4].map(n => document.getElementById(`option${n}`).value.trim());
      item.correct = Number(document.getElementById("correctOption").value);
      if (item.options.some(x => !x)) { toast("Preencha as quatro alternativas."); return; }
    }
    const items = getActivities(); items.push(item); saveActivities(items);
    form.reset(); choiceFields.hidden = false; toast("Pergunta adicionada à lista do professor."); renderCreated();
  });
  document.getElementById("printCustomActivity")?.addEventListener("click", () => {
    const items = getActivities();
    if (!items.length) { toast("Crie pelo menos uma pergunta antes de imprimir."); return; }
    const title = document.getElementById("customActivityTitle").value.trim() || "Atividade de Química";
    const content = items.map((q,i) => {
      const options = q.type==="choice" ? `<ol type="A">${q.options.map(o=>`<li>${escapeHTML(o)}</li>`).join("")}</ol>` : '<div class="answer-line"></div><div class="answer-line"></div>';
      return `<li><p>${escapeHTML(q.prompt)}</p>${options}</li>`;
    }).join("");
    const w = window.open("", "_blank");
    if (!w) { toast("Permita pop-ups para gerar a atividade."); return; }
    w.document.write(`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>${escapeHTML(title)}</title><style>body{font:16px Arial;padding:35px;color:#222}h1{font-size:23px}li{margin:22px 0}.answer-line{height:32px;border-bottom:1px solid #999}ol[type=A] li{margin:7px 0}</style><body><h1>${escapeHTML(title)}</h1><p>Nome: __________________________________ Turma: __________ Data: ___/___/_____</p><ol>${content}</ol><script>window.onload=()=>window.print()<\/script></body></html>`);
    w.document.close();
  });
  renderCreated();
}
