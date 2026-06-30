// Vercel Serverless Function — proxy + traducción de nombres al español
// Usa score de 90 minutos para partidos de eliminatorias (Opción A acordada)

const NAME_MAP = {
  'Mexico':'México', 'South Africa':'Sudáfrica',
  'South Korea':'Corea del Sur', 'Korea Republic':'Corea del Sur', 'Korea Rep.':'Corea del Sur',
  'Czech Republic':'Chequia', 'Czechia':'Chequia', 'Czech Rep.':'Chequia',
  'Canada':'Canadá',
  'Bosnia and Herzegovina':'Bosnia', 'Bosnia-H.':'Bosnia',
  'Bosnia & Herz.':'Bosnia', 'Bosnia-Herz.':'Bosnia',
  'Qatar':'Qatar', 'Switzerland':'Suiza',
  'Brazil':'Brasil', 'Morocco':'Marruecos', 'Haiti':'Haití', 'Scotland':'Escocia',
  'United States':'EE.UU.', 'USA':'EE.UU.', 'USMNT':'EE.UU.',
  'Paraguay':'Paraguay', 'Australia':'Australia',
  'Türkiye':'Turquía', 'Turkey':'Turquía', 'Turkiye':'Turquía',
  'Germany':'Alemania',
  'Curaçao':'Curazao', 'Curacao':'Curazao',
  "Ivory Coast":'Costa de Marfil', "Côte d'Ivoire":'Costa de Marfil',
  "Cote d'Ivoire":'Costa de Marfil',
  'Ecuador':'Ecuador', 'Netherlands':'Países Bajos',
  'Japan':'Japón', 'Sweden':'Suecia', 'Tunisia':'Túnez',
  'Belgium':'Bélgica', 'Egypt':'Egipto', 'Iran':'Irán', 'New Zealand':'Nueva Zelanda',
  'Spain':'España', 'Cape Verde':'Cabo Verde', 'Saudi Arabia':'Arabia Saudita',
  'Uruguay':'Uruguay', 'France':'Francia', 'Senegal':'Senegal',
  'Iraq':'Irak', 'Norway':'Noruega', 'Argentina':'Argentina', 'Algeria':'Argelia',
  'Austria':'Austria', 'Jordan':'Jordania', 'Portugal':'Portugal',
  'DR Congo':'R.D. Congo', 'Congo DR':'R.D. Congo',
  'Democratic Republic of Congo':'R.D. Congo',
  'Uzbekistan':'Uzbekistán', 'Colombia':'Colombia',
  'England':'Inglaterra', 'Croatia':'Croacia', 'Ghana':'Ghana', 'Panama':'Panamá',
  'Switzerland':'Suiza', 'Algeria':'Argelia',
};

function tr(name) { return NAME_MAP[name] || name; }

function getScore(m) {
  // Opción A: siempre usar resultado de 90 minutos (tiempo reglamentario)
  // Para partidos que van a prórroga/penales, fullTime = 90 min, regularTime también
  // football-data.org usa:
  //   duration: REGULAR | EXTRA_TIME | PENALTY_SHOOTOUT
  //   regularTime: score at 90 min (if available)
  //   fullTime: score at end of regular play (90 min for REGULAR, 90 min base for ET/PSO)
  
  const duration = m.score?.duration;
  
  if (duration === 'REGULAR') {
    // Normal match — use fullTime
    return {
      home: m.score?.fullTime?.home,
      away: m.score?.fullTime?.away,
    };
  } else {
    // Extra time or penalties — use regularTime (90 min score)
    // If regularTime not available, fall back to fullTime
    const regHome = m.score?.regularTime?.home;
    const regAway = m.score?.regularTime?.away;
    if (regHome !== null && regHome !== undefined && regAway !== null && regAway !== undefined) {
      return { home: regHome, away: regAway };
    }
    // Fallback: fullTime
    return {
      home: m.score?.fullTime?.home,
      away: m.score?.fullTime?.away,
    };
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  try {
    const apiRes = await fetch(
      'https://api.football-data.org/v4/competitions/WC/matches?season=2026',
      { headers: { 'X-Auth-Token': 'be5fd40eeb9c47c0a7a4d79b9c4cd978' } }
    );

    if (!apiRes.ok) {
      res.status(apiRes.status).json({ error: `API ${apiRes.status}` });
      return;
    }

    const data = await apiRes.json();
    const matches = (data.matches || [])
      .filter(m => m.status === 'FINISHED')
      .map(m => {
        const score = getScore(m);
        return {
          home: tr(m.homeTeam?.name),
          hs:   tr(m.homeTeam?.shortName),
          away: tr(m.awayTeam?.name),
          as:   tr(m.awayTeam?.shortName),
          hg:   score.home,
          ag:   score.away,
          dur:  m.score?.duration,  // para debug
        };
      });

    res.status(200).json({ matches });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
