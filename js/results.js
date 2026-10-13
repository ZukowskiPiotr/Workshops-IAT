IAT.renderResults = (element, result) => {
 const descriptions={A:'KOBIETA + NAUKI HUMANISTYCZNE / MĘŻCZYZNA + NAUKI ŚCISŁE',B:'KOBIETA + NAUKI ŚCISŁE / MĘŻCZYZNA + NAUKI HUMANISTYCZNE'};
 const format = n => n.toLocaleString('pl-PL',{minimumFractionDigits:2,maximumFractionDigits:2});
 const direction = result.valid ? result.d>0 ? 'W tej sesji względnie szybciej łączono kobietę z naukami humanistycznymi, a mężczyznę z naukami ścisłymi.' : result.d<0 ? 'W tej sesji względnie szybciej łączono kobietę z naukami ścisłymi, a mężczyznę z naukami humanistycznymi.' : 'W tej sesji nie było różnicy między mapowaniami.' : result.reason;
 element.innerHTML=`<section class="sheet results"><p class="eyebrow">DEMONSTRACJA · TWÓJ WYNIK</p><h1>${result.valid?'Wskaźnik IAT D':'Wynik niedostępny'}</h1>
 ${result.valid?`<div class="score">${format(result.d)}</div><p class="muted">D1 · wskaźnik bez jednostki</p>`:''}<p>${direction}</p>
 ${result.valid?`<h2>Czas kategoryzacji</h2><p class="muted">Średnie czasy do poprawnej odpowiedzi, wraz z korektą błędów, w zachowanych próbach bloków łączonych. To czasy w ms, a nie wskaźnik D.</p>
 ${['A','B'].map(m=>`<div class="comparison"><p>${descriptions[m]}</p><strong>${Math.round(result.times[m])} ms</strong><div class="bar-track"><div class="bar ${m}" style="width:${100*result.times[m]/Math.max(...Object.values(result.times))}%"></div></div></div>`).join('')}
 <p class="muted">Zachowano ${result.retained}/120 prób. Błędy pierwszej odpowiedzi: ${Math.round(result.errorRate*100)}%.</p>`:''}
 <h2>Co mierzy to zadanie?</h2><p>IAT porównuje łatwość dwóch sposobów łączenia kategorii w tej konkretnej sytuacji. Wynik zależy również od uwagi, ćwiczenia, słów i urządzenia; pojedynczy pomiar może się zmieniać.</p><p class="notice">Wynik nie diagnozuje osobistych uprzedzeń, świadomych przekonań, zamiarów dyskryminacyjnych ani zachowania. Nie ujawnia „ukrytych poglądów”.</p><p>Materiały polskie są wersją pilotażową. Dwie kategorie płci są uproszczeniem tego zadania i nie opisują wszystkich tożsamości. Możesz omówić metodę z osobą prowadzącą bez ujawniania swojego wyniku.</p><button class="primary" id="restart">Rozpocznij od nowa</button><p class="muted">Nowa sesja ma nowe losowanie. Powtórzenie nie jest niezależnym pomiarem — działa efekt ćwiczenia.</p></section>`;
 element.querySelector('#restart').onclick=()=>location.reload();
};
