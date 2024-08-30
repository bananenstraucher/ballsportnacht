const API_KEY = 'i3gUw4fhyaaViSabm3zSHFzWzq2xzMosxT485j6b';
const BASE_URL = 'https://api.challonge.com/v1';

// Funktion zum Abrufen der nächsten Matches für ein bestimmtes Turnier
async function getNextMatch(tournamentId) {
    const response = await fetch(`${BASE_URL}/tournaments/${tournamentId}/matches.json?api_key=${API_KEY}`);
    const matches = await response.json();

    let nextMatch = null;
    matches.forEach(matchData => {
        const match = matchData.match;
        if (match.state === 'open') {  // Offenes, nicht begonnenes Spiel
            if (!nextMatch || new Date(match.scheduled_time) < new Date(nextMatch.scheduled_time)) {
                nextMatch = match;
            }
        }
    });

    return nextMatch;
}

// Funktion zum Abrufen des nächsten Spiels aus mehreren Turnieren
async function getAllNextMatches(tournamentIds) {
    const nextMatches = [];

    for (const tournamentId of tournamentIds) {
        const match = await getNextMatch(tournamentId);
        if (match) {
            nextMatches.push(match);
        }
    }

    // Sortiere nach der Startzeit des Spiels
    nextMatches.sort((a, b) => new Date(a.scheduled_time) - new Date(b.scheduled_time));

    return nextMatches.length > 0 ? nextMatches[0] : null;
}

// Beispiel: Turnier-IDs abrufen und nächstes Spiel anzeigen
(async () => {
    const tournamentIds = ['12345', '67890'];  // Ersetze mit deinen Turnier-IDs
    const nextMatch = await getAllNextMatches(tournamentIds);

    if (nextMatch) {
        const player1 = nextMatch.player1_id;
        const player2 = nextMatch.player2_id;
        console.log(`Nächstes Spiel: ${player1} vs ${player2}`);

        // Beispiel: Spiel auf der Website anzeigen
        document.getElementById('next-match').textContent = `Nächstes Spiel: ${player1} vs ${player2}`;
    } else {
        console.log('Kein anstehendes Spiel gefunden.');
        document.getElementById('next-match').textContent = 'Kein anstehendes Spiel gefunden.';
    }
})();
