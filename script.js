 const wordInput = document.getElementById('wordInput');
        const searchBtn = document.getElementById('searchBtn');
        const resultsDiv = document.getElementById('results');

        function toggleTheme() {
            document.body.classList.toggle('light-mode');
            document.body.classList.toggle('dark-mode');
        }

        async function fetchWord(word) {
            try {
                const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
                if (!response.ok) {
                    throw new Error('Word not found');
                }
                const data = await response.json();
                displayResults(data);
            } catch (error) {
                resultsDiv.style.display = 'block'; // Show results for error
                resultsDiv.innerHTML = `
                    <div class="error">
                        ${error.message === 'Word not found' ? 'Word not found. Please try another.' : 'An error occurred. Please try again.'}
                    </div>
                `;
            }
        }

        function displayResults(data) {
            resultsDiv.style.display = 'block'; // Show results
            resultsDiv.innerHTML = '';
            data.forEach(entry => {
                const word = entry.word;
                const phonetics = entry.phonetics.find(p => p.text) || {};
                 
                const meanings = entry.meanings;

                let html = `
                    <div class="result-card">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <h2>${word}</h2>
                           
                        </div>
                        ${phonetics.text ? `<p class="phonetic">${phonetics.text}</p>` : ''}
                    </div>
                `;

                meanings.forEach(meaning => {
                    html += `
                        <div class="result-card">
                            <h3 class="part-of-speech">${meaning.partOfSpeech}</h3>
                            <ul>
                                ${meaning.definitions.map(def => `
                                    <li>
                                        ${def.definition}
                                        ${def.example ? `<p class="example">Example: ${def.example}</p>` : ''}
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    `;
                });

                resultsDiv.innerHTML += html;
            });
        }

        function clearResults() {
            resultsDiv.style.display = 'none'; // Hide results
            resultsDiv.innerHTML = '';
        }

        searchBtn.addEventListener('click', () => {
            const word = wordInput.value.trim();
            if (word) {
                fetchWord(word);
            } else {
                clearResults();
            }
        });

        wordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const word = wordInput.value.trim();
                if (word) {
                    fetchWord(word);
                } else {
                    clearResults();
                }
            }
        });

        // Clear results on input change to empty
        wordInput.addEventListener('input', () => {
            if (!wordInput.value.trim()) {
                clearResults();
            }
        });