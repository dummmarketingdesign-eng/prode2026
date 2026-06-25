// Vercel Serverless Function — proxy + traducción de nombres al español
// /api/results

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
};

function tr(name) { return NAME_MAP[name] || name; }

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
      .map(m => ({
        home: tr(m.homeTeam?.name),
        hs:   tr(m.homeTeam?.shortName),
        away: tr(m.awayTeam?.name),
        as:   tr(m.awayTeam?.shortName),
        hg:   m.score?.fullTime?.home,
        ag:   m.score?.fullTime?.away,
      }));

    res.status(200).json({ matches });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
