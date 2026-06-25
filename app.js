// ============================================
// PRODE MUNDIAL 2026
// Marta la Tarta vs Rabbit.6028148
// ============================================

const PLAYERS   = ['Marta la Tarta', 'Rabbit.6028148', 'Julieta', 'Juanse', 'Regi', 'Fran'];
const DAYS_ES   = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

// ── Argentina = UTC-3 ──────────────────────
function getArgDate(utcStr) {
  const ms = new Date(utcStr).getTime() - 3*60*60*1000;
  return new Date(ms).toISOString().slice(0,10);
}
function getArgTimeStr(utcStr) {
  const ms = new Date(utcStr).getTime() - 3*60*60*1000;
  const d  = new Date(ms);
  return String(d.getUTCHours()).padStart(2,'0')+':'+String(d.getUTCMinutes()).padStart(2,'0');
}
function formatDayLabel(iso) {
  const d = new Date(iso+'T12:00Z');
  return DAYS_ES[d.getUTCDay()]+' '+d.getUTCDate()+'/'+(d.getUTCMonth()+1);
}
function formatDayTitle(iso) {
  const full =['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const mes  =['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const d = new Date(iso+'T12:00Z');
  return full[d.getUTCDay()]+' '+d.getUTCDate()+' de '+mes[d.getUTCMonth()];
}
function getMatchDays() {
  const s = new Set(
    MATCHES.filter(m=>m.type==='group'&&m.kickoff_utc).map(m=>getArgDate(m.kickoff_utc))
  );
  return [...s].sort();
}
function getDefaultDay() {
  const days   = getMatchDays();
  const nowArg = new Date(Date.now()-3*60*60*1000).toISOString().slice(0,10);
  if (nowArg < days[0]) return days[0];
  if (nowArg > days[days.length-1]) return days[days.length-1];
  return days.find(d=>d>=nowArg)||days[days.length-1];
}
function isLocked(match) {
  if (!match.kickoff_utc) return false;
  return Date.now() >= new Date(match.kickoff_utc).getTime()-60*60*1000;
}
function timeUntilLock(match) {
  if (!match.kickoff_utc) return null;
  const diff = new Date(match.kickoff_utc).getTime()-60*60*1000-Date.now();
  if (diff<=0||diff>24*3600*1000) return null;
  const h=Math.floor(diff/3600000), m=Math.floor((diff%3600000)/60000);
  return h>0?`cierra en ${h}h ${m}m`:`cierra en ${m}m`;
}

// ============================================
// MATCH DATA — horarios oficiales FIFA (Infobae/El Destape, abril 2026)
// kickoff_utc en UTC = hora ARG + 3h
// ============================================
const MATCHES = [
  // ── GRUPO A ─────────────────────────────
  {id:'A1', type:'group', group:'A', home:'México',          away:'Sudáfrica',      kickoff_utc:'2026-06-11T19:00Z'},  // 16:00 ARG
  {id:'A2', type:'group', group:'A', home:'Corea del Sur',   away:'Chequia',        kickoff_utc:'2026-06-12T02:00Z'},  // 23:00 ARG 11/6
  {id:'A3', type:'group', group:'A', home:'Chequia',         away:'Sudáfrica',      kickoff_utc:'2026-06-18T16:00Z'},  // 13:00 ARG
  {id:'A4', type:'group', group:'A', home:'México',          away:'Corea del Sur',  kickoff_utc:'2026-06-19T01:00Z'},  // 22:00 ARG 18/6
  {id:'A5', type:'group', group:'A', home:'Chequia',         away:'México',         kickoff_utc:'2026-06-25T01:00Z'},  // 22:00 ARG 24/6
  {id:'A6', type:'group', group:'A', home:'Sudáfrica',       away:'Corea del Sur',  kickoff_utc:'2026-06-25T01:00Z'},  // 22:00 ARG 24/6
  // ── GRUPO B ─────────────────────────────
  {id:'B1', type:'group', group:'B', home:'Canadá',          away:'Bosnia',         kickoff_utc:'2026-06-12T19:00Z'},  // 16:00 ARG
  {id:'B2', type:'group', group:'B', home:'Qatar',           away:'Suiza',          kickoff_utc:'2026-06-13T19:00Z'},  // 16:00 ARG
  {id:'B3', type:'group', group:'B', home:'Suiza',           away:'Bosnia',         kickoff_utc:'2026-06-18T19:00Z'},  // 16:00 ARG
  {id:'B4', type:'group', group:'B', home:'Canadá',          away:'Qatar',          kickoff_utc:'2026-06-18T22:00Z'},  // 19:00 ARG
  {id:'B5', type:'group', group:'B', home:'Suiza',           away:'Canadá',         kickoff_utc:'2026-06-24T19:00Z'},  // 16:00 ARG
  {id:'B6', type:'group', group:'B', home:'Bosnia',          away:'Qatar',          kickoff_utc:'2026-06-24T19:00Z'},  // 16:00 ARG
  // ── GRUPO C ─────────────────────────────
  {id:'C1', type:'group', group:'C', home:'Brasil',          away:'Marruecos',      kickoff_utc:'2026-06-13T22:00Z'},  // 19:00 ARG
  {id:'C2', type:'group', group:'C', home:'Haití',           away:'Escocia',        kickoff_utc:'2026-06-14T01:00Z'},  // 22:00 ARG 13/6
  {id:'C3', type:'group', group:'C', home:'Escocia',         away:'Marruecos',      kickoff_utc:'2026-06-19T22:00Z'},  // 19:00 ARG
  {id:'C4', type:'group', group:'C', home:'Brasil',          away:'Haití',          kickoff_utc:'2026-06-20T01:00Z'},  // 22:00 ARG 19/6
  {id:'C5', type:'group', group:'C', home:'Escocia',         away:'Brasil',         kickoff_utc:'2026-06-24T22:00Z'},  // 19:00 ARG
  {id:'C6', type:'group', group:'C', home:'Marruecos',       away:'Haití',          kickoff_utc:'2026-06-24T22:00Z'},  // 19:00 ARG
  // ── GRUPO D ─────────────────────────────
  {id:'D1', type:'group', group:'D', home:'EE.UU.',          away:'Paraguay',       kickoff_utc:'2026-06-13T01:00Z'},  // 22:00 ARG 12/6
  {id:'D2', type:'group', group:'D', home:'Australia',       away:'Turquía',        kickoff_utc:'2026-06-14T04:00Z'},  // 01:00 ARG 14/6
  {id:'D3', type:'group', group:'D', home:'EE.UU.',          away:'Australia',      kickoff_utc:'2026-06-19T19:00Z'},  // 16:00 ARG
  {id:'D4', type:'group', group:'D', home:'Turquía',         away:'Paraguay',       kickoff_utc:'2026-06-20T04:00Z'},  // 01:00 ARG 20/6
  {id:'D5', type:'group', group:'D', home:'Turquía',         away:'EE.UU.',         kickoff_utc:'2026-06-26T02:00Z'},  // 23:00 ARG 25/6
  {id:'D6', type:'group', group:'D', home:'Paraguay',        away:'Australia',      kickoff_utc:'2026-06-26T02:00Z'},  // 23:00 ARG 25/6
  // ── GRUPO E ─────────────────────────────
  {id:'E1', type:'group', group:'E', home:'Alemania',        away:'Curazao',        kickoff_utc:'2026-06-14T17:00Z'},  // 14:00 ARG
  {id:'E2', type:'group', group:'E', home:'Costa de Marfil', away:'Ecuador',        kickoff_utc:'2026-06-14T23:00Z'},  // 20:00 ARG
  {id:'E3', type:'group', group:'E', home:'Alemania',        away:'Costa de Marfil',kickoff_utc:'2026-06-20T20:00Z'},  // 17:00 ARG
  {id:'E4', type:'group', group:'E', home:'Ecuador',         away:'Curazao',        kickoff_utc:'2026-06-21T00:00Z'},  // 21:00 ARG 20/6
  {id:'E5', type:'group', group:'E', home:'Ecuador',         away:'Alemania',       kickoff_utc:'2026-06-25T20:00Z'},  // 17:00 ARG
  {id:'E6', type:'group', group:'E', home:'Curazao',         away:'Costa de Marfil',kickoff_utc:'2026-06-25T20:00Z'},  // 17:00 ARG
  // ── GRUPO F ─────────────────────────────
  {id:'F1', type:'group', group:'F', home:'Países Bajos',    away:'Japón',          kickoff_utc:'2026-06-14T20:00Z'},  // 17:00 ARG
  {id:'F2', type:'group', group:'F', home:'Suecia',          away:'Túnez',          kickoff_utc:'2026-06-15T02:00Z'},  // 23:00 ARG 14/6
  {id:'F3', type:'group', group:'F', home:'Países Bajos',    away:'Suecia',         kickoff_utc:'2026-06-20T17:00Z'},  // 14:00 ARG
  {id:'F4', type:'group', group:'F', home:'Túnez',           away:'Japón',          kickoff_utc:'2026-06-21T04:00Z'},  // 01:00 ARG 21/6
  {id:'F5', type:'group', group:'F', home:'Japón',           away:'Suecia',         kickoff_utc:'2026-06-25T23:00Z'},  // 20:00 ARG
  {id:'F6', type:'group', group:'F', home:'Túnez',           away:'Países Bajos',   kickoff_utc:'2026-06-25T23:00Z'},  // 20:00 ARG
  // ── GRUPO G ─────────────────────────────
  {id:'G1', type:'group', group:'G', home:'Bélgica',         away:'Egipto',         kickoff_utc:'2026-06-15T19:00Z'},  // 16:00 ARG
  {id:'G2', type:'group', group:'G', home:'Irán',            away:'Nueva Zelanda',  kickoff_utc:'2026-06-16T01:00Z'},  // 22:00 ARG 15/6
  {id:'G3', type:'group', group:'G', home:'Bélgica',         away:'Irán',           kickoff_utc:'2026-06-21T19:00Z'},  // 16:00 ARG
  {id:'G4', type:'group', group:'G', home:'Nueva Zelanda',   away:'Egipto',         kickoff_utc:'2026-06-22T01:00Z'},  // 22:00 ARG 21/6
  {id:'G5', type:'group', group:'G', home:'Egipto',          away:'Irán',           kickoff_utc:'2026-06-27T03:00Z'},  // 00:00 ARG 27/6
  {id:'G6', type:'group', group:'G', home:'Nueva Zelanda',   away:'Bélgica',        kickoff_utc:'2026-06-27T03:00Z'},  // 00:00 ARG 27/6
  // ── GRUPO H ─────────────────────────────
  {id:'H1', type:'group', group:'H', home:'España',          away:'Cabo Verde',     kickoff_utc:'2026-06-15T16:00Z'},  // 13:00 ARG
  {id:'H2', type:'group', group:'H', home:'Arabia Saudita',  away:'Uruguay',        kickoff_utc:'2026-06-15T22:00Z'},  // 19:00 ARG
  {id:'H3', type:'group', group:'H', home:'España',          away:'Arabia Saudita', kickoff_utc:'2026-06-21T16:00Z'},  // 13:00 ARG
  {id:'H4', type:'group', group:'H', home:'Uruguay',         away:'Cabo Verde',     kickoff_utc:'2026-06-21T22:00Z'},  // 19:00 ARG
  {id:'H5', type:'group', group:'H', home:'Cabo Verde',      away:'Arabia Saudita', kickoff_utc:'2026-06-27T00:00Z'},  // 21:00 ARG 26/6
  {id:'H6', type:'group', group:'H', home:'Uruguay',         away:'España',         kickoff_utc:'2026-06-27T00:00Z'},  // 21:00 ARG 26/6
  // ── GRUPO I ─────────────────────────────
  {id:'I1', type:'group', group:'I', home:'Francia',         away:'Senegal',        kickoff_utc:'2026-06-16T19:00Z'},  // 16:00 ARG
  {id:'I2', type:'group', group:'I', home:'Irak',            away:'Noruega',        kickoff_utc:'2026-06-16T22:00Z'},  // 19:00 ARG
  {id:'I3', type:'group', group:'I', home:'Francia',         away:'Irak',           kickoff_utc:'2026-06-22T21:00Z'},  // 18:00 ARG
  {id:'I4', type:'group', group:'I', home:'Noruega',         away:'Senegal',        kickoff_utc:'2026-06-23T00:00Z'},  // 21:00 ARG 22/6
  {id:'I5', type:'group', group:'I', home:'Noruega',         away:'Francia',        kickoff_utc:'2026-06-26T19:00Z'},  // 16:00 ARG
  {id:'I6', type:'group', group:'I', home:'Senegal',         away:'Irak',           kickoff_utc:'2026-06-26T19:00Z'},  // 16:00 ARG
  // ── GRUPO J ─────────────────────────────
  {id:'J1', type:'group', group:'J', home:'Argentina',       away:'Argelia',        kickoff_utc:'2026-06-17T01:00Z'},  // 22:00 ARG 16/6
  {id:'J2', type:'group', group:'J', home:'Austria',         away:'Jordania',       kickoff_utc:'2026-06-17T04:00Z'},  // 01:00 ARG 17/6
  {id:'J3', type:'group', group:'J', home:'Argentina',       away:'Austria',        kickoff_utc:'2026-06-22T17:00Z'},  // 14:00 ARG
  {id:'J4', type:'group', group:'J', home:'Jordania',        away:'Argelia',        kickoff_utc:'2026-06-23T03:00Z'},  // 00:00 ARG 23/6
  {id:'J5', type:'group', group:'J', home:'Argelia',         away:'Austria',        kickoff_utc:'2026-06-28T02:00Z'},  // 23:00 ARG 27/6
  {id:'J6', type:'group', group:'J', home:'Jordania',        away:'Argentina',      kickoff_utc:'2026-06-28T02:00Z'},  // 23:00 ARG 27/6
  // ── GRUPO K ─────────────────────────────
  {id:'K1', type:'group', group:'K', home:'Portugal',        away:'R.D. Congo',     kickoff_utc:'2026-06-17T17:00Z'},  // 14:00 ARG
  {id:'K2', type:'group', group:'K', home:'Uzbekistán',      away:'Colombia',       kickoff_utc:'2026-06-18T02:00Z'},  // 23:00 ARG 17/6
  {id:'K3', type:'group', group:'K', home:'Portugal',        away:'Uzbekistán',     kickoff_utc:'2026-06-23T17:00Z'},  // 14:00 ARG
  {id:'K4', type:'group', group:'K', home:'Colombia',        away:'R.D. Congo',     kickoff_utc:'2026-06-24T02:00Z'},  // 23:00 ARG 23/6
  {id:'K5', type:'group', group:'K', home:'Colombia',        away:'Portugal',       kickoff_utc:'2026-06-27T23:30Z'},  // 20:30 ARG
  {id:'K6', type:'group', group:'K', home:'R.D. Congo',      away:'Uzbekistán',     kickoff_utc:'2026-06-27T23:30Z'},  // 20:30 ARG
  // ── GRUPO L ─────────────────────────────
  {id:'L1', type:'group', group:'L', home:'Inglaterra',      away:'Croacia',        kickoff_utc:'2026-06-17T20:00Z'},  // 17:00 ARG
  {id:'L2', type:'group', group:'L', home:'Ghana',           away:'Panamá',         kickoff_utc:'2026-06-17T23:00Z'},  // 20:00 ARG
  {id:'L3', type:'group', group:'L', home:'Inglaterra',      away:'Ghana',          kickoff_utc:'2026-06-23T20:00Z'},  // 17:00 ARG
  {id:'L4', type:'group', group:'L', home:'Panamá',          away:'Croacia',        kickoff_utc:'2026-06-23T23:00Z'},  // 20:00 ARG
  {id:'L5', type:'group', group:'L', home:'Panamá',          away:'Inglaterra',     kickoff_utc:'2026-06-27T21:00Z'},  // 18:00 ARG
  {id:'L6', type:'group', group:'L', home:'Croacia',         away:'Ghana',          kickoff_utc:'2026-06-27T21:00Z'},  // 18:00 ARG
  // ── RONDA DE 32 — horarios FIFA confirmados ──
  {id:'R32_1',  type:'r32', label:'R32 · 2A vs 2B',        kickoff_utc:'2026-06-28T19:00Z', home:'Por definir', away:'Por definir'},  // 16:00 ARG
  {id:'R32_4',  type:'r32', label:'R32 · 1C vs 2F',        kickoff_utc:'2026-06-29T17:00Z', home:'Por definir', away:'Por definir'},  // 14:00 ARG
  {id:'R32_2',  type:'r32', label:'R32 · 1E vs 3er mejor', kickoff_utc:'2026-06-29T20:30Z', home:'Por definir', away:'Por definir'},  // 17:30 ARG
  {id:'R32_3',  type:'r32', label:'R32 · 1F vs 2C',        kickoff_utc:'2026-06-30T01:00Z', home:'Por definir', away:'Por definir'},  // 22:00 ARG 29/6
  {id:'R32_6',  type:'r32', label:'R32 · 2E vs 2I',        kickoff_utc:'2026-06-30T17:00Z', home:'Por definir', away:'Por definir'},  // 14:00 ARG
  {id:'R32_5',  type:'r32', label:'R32 · 1I vs 3er mejor', kickoff_utc:'2026-06-30T21:00Z', home:'Por definir', away:'Por definir'},  // 18:00 ARG
  {id:'R32_7',  type:'r32', label:'R32 · 1A vs 3er mejor', kickoff_utc:'2026-07-01T01:00Z', home:'Por definir', away:'Por definir'},  // 22:00 ARG 30/6
  {id:'R32_8',  type:'r32', label:'R32 · 1L vs 3er mejor', kickoff_utc:'2026-07-01T16:00Z', home:'Por definir', away:'Por definir'},  // 13:00 ARG
  {id:'R32_10', type:'r32', label:'R32 · 1G vs 3er mejor', kickoff_utc:'2026-07-01T20:00Z', home:'Por definir', away:'Por definir'},  // 17:00 ARG
  {id:'R32_9',  type:'r32', label:'R32 · 1D vs 3er mejor', kickoff_utc:'2026-07-02T00:00Z', home:'Por definir', away:'Por definir'},  // 21:00 ARG 1/7
  {id:'R32_11', type:'r32', label:'R32 · 2K vs 2L',        kickoff_utc:'2026-07-02T17:00Z', home:'Por definir', away:'Por definir'},  // 14:00 ARG
  {id:'R32_12', type:'r32', label:'R32 · 1H vs 2J',        kickoff_utc:'2026-07-02T21:00Z', home:'Por definir', away:'Por definir'},  // 18:00 ARG
  {id:'R32_13', type:'r32', label:'R32 · 1B vs 3er mejor', kickoff_utc:'2026-07-03T01:00Z', home:'Por definir', away:'Por definir'},  // 22:00 ARG 2/7
  {id:'R32_16', type:'r32', label:'R32 · 2D vs 2G',        kickoff_utc:'2026-07-03T18:00Z', home:'Por definir', away:'Por definir'},  // 15:00 ARG
  {id:'R32_14', type:'r32', label:'R32 · 1J vs 2H',        kickoff_utc:'2026-07-03T22:00Z', home:'Por definir', away:'Por definir'},  // 19:00 ARG
  {id:'R32_15', type:'r32', label:'R32 · 1K vs 3er mejor', kickoff_utc:'2026-07-04T01:30Z', home:'Por definir', away:'Por definir'},  // 22:30 ARG 3/7
  // ── OCTAVOS ─────────────────────────────
  {id:'R16_1', type:'r16', label:'Octavos P1', kickoff_utc:'2026-07-04T17:00Z', home:'Por definir', away:'Por definir'},  // 14:00 ARG
  {id:'R16_2', type:'r16', label:'Octavos P2', kickoff_utc:'2026-07-04T21:00Z', home:'Por definir', away:'Por definir'},  // 18:00 ARG
  {id:'R16_3', type:'r16', label:'Octavos P3', kickoff_utc:'2026-07-05T20:00Z', home:'Por definir', away:'Por definir'},  // 17:00 ARG
  {id:'R16_4', type:'r16', label:'Octavos P4', kickoff_utc:'2026-07-06T00:00Z', home:'Por definir', away:'Por definir'},  // 21:00 ARG 5/7
  {id:'R16_5', type:'r16', label:'Octavos P5', kickoff_utc:'2026-07-06T19:00Z', home:'Por definir', away:'Por definir'},  // 16:00 ARG
  {id:'R16_6', type:'r16', label:'Octavos P6', kickoff_utc:'2026-07-07T00:00Z', home:'Por definir', away:'Por definir'},  // 21:00 ARG 6/7
  {id:'R16_7', type:'r16', label:'Octavos P7', kickoff_utc:'2026-07-07T16:00Z', home:'Por definir', away:'Por definir'},  // 13:00 ARG
  {id:'R16_8', type:'r16', label:'Octavos P8', kickoff_utc:'2026-07-07T20:00Z', home:'Por definir', away:'Por definir'},  // 17:00 ARG
  // ── CUARTOS ─────────────────────────────
  {id:'QF_1', type:'qf', label:'Cuartos P1', kickoff_utc:'2026-07-09T20:00Z', home:'Por definir', away:'Por definir'},   // 17:00 ARG
  {id:'QF_2', type:'qf', label:'Cuartos P2', kickoff_utc:'2026-07-10T19:00Z', home:'Por definir', away:'Por definir'},   // 16:00 ARG
  {id:'QF_3', type:'qf', label:'Cuartos P3', kickoff_utc:'2026-07-11T21:00Z', home:'Por definir', away:'Por definir'},   // 18:00 ARG
  {id:'QF_4', type:'qf', label:'Cuartos P4', kickoff_utc:'2026-07-12T01:00Z', home:'Por definir', away:'Por definir'},   // 22:00 ARG 11/7
  // ── SEMIFINALES ─────────────────────────
  {id:'SF_1', type:'sf', label:'Semifinal 1', kickoff_utc:'2026-07-14T19:00Z', home:'Por definir', away:'Por definir'},  // 16:00 ARG
  {id:'SF_2', type:'sf', label:'Semifinal 2', kickoff_utc:'2026-07-15T19:00Z', home:'Por definir', away:'Por definir'},  // 16:00 ARG
  // ── TERCER PUESTO ───────────────────────
  {id:'BRONZE', type:'bronze', label:'Tercer Puesto', kickoff_utc:'2026-07-18T21:00Z', home:'Por definir', away:'Por definir'}, // 18:00 ARG
  // ── FINAL ───────────────────────────────
  {id:'FINAL',  type:'final',  label:'FINAL',          kickoff_utc:'2026-07-19T19:00Z', home:'Por definir', away:'Por definir'}, // 16:00 ARG
];

const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];

// ============================================
// BRACKET R32 — fuente: Wikipedia (M73–M88)
// Slots: w=ganador, r=subcampeón, t=3er mejor
// ============================================
const R32_BRACKET = {
  'R32_1':  { home:{t:'r',g:'A'}, away:{t:'r',g:'B'} },
  'R32_4':  { home:{t:'w',g:'C'}, away:{t:'r',g:'F'} },
  'R32_2':  { home:{t:'w',g:'E'}, away:{t:'t',wg:'E'} },
  'R32_3':  { home:{t:'w',g:'F'}, away:{t:'r',g:'C'} },
  'R32_6':  { home:{t:'r',g:'E'}, away:{t:'r',g:'I'} },
  'R32_5':  { home:{t:'w',g:'I'}, away:{t:'t',wg:'I'} },
  'R32_7':  { home:{t:'w',g:'A'}, away:{t:'t',wg:'A'} },
  'R32_8':  { home:{t:'w',g:'L'}, away:{t:'t',wg:'L'} },
  'R32_10': { home:{t:'w',g:'G'}, away:{t:'t',wg:'G'} },
  'R32_9':  { home:{t:'w',g:'D'}, away:{t:'t',wg:'D'} },
  'R32_11': { home:{t:'r',g:'K'}, away:{t:'r',g:'L'} },
  'R32_13': { home:{t:'w',g:'B'}, away:{t:'t',wg:'B'} },
  'R32_15': { home:{t:'w',g:'K'}, away:{t:'t',wg:'K'} },
  'R32_16': { home:{t:'r',g:'D'}, away:{t:'r',g:'G'} },
  'R32_12': { home:{t:'w',g:'H'}, away:{t:'r',g:'J'} },
  'R32_14': { home:{t:'w',g:'J'}, away:{t:'r',g:'H'} },
};

// Clusters: qué grupos 3ros pueden jugar contra cada ganador
const WINNER_CLUSTERS = {
  A:['C','E','F','H','I'],
  B:['E','F','G','I','J'],
  D:['B','E','F','I','J'],
  E:['A','B','C','D','F'],
  G:['A','E','H','I','J'],
  I:['C','D','F','G','H'],
  K:['D','E','I','J','L'],
  L:['E','H','I','J','K'],
};

// ============================================
// GROUP STANDINGS
// ============================================
function getGroupStandings(group) {
  const matches = MATCHES.filter(m => m.type==='group' && m.group===group);
  const teams = {};
  matches.forEach(m => {
    if (!teams[m.home]) teams[m.home]={name:m.home, pts:0,gf:0,ga:0,gd:0,w:0,d:0,l:0,played:0};
    if (!teams[m.away]) teams[m.away]={name:m.away, pts:0,gf:0,ga:0,gd:0,w:0,d:0,l:0,played:0};
  });
  matches.forEach(m => {
    const r = state.results[m.id];
    if (!r || r.home===null || r.away===null) return;
    const rH=parseInt(r.home), rA=parseInt(r.away);
    if (isNaN(rH)||isNaN(rA)) return;
    teams[m.home].gf+=rH; teams[m.home].ga+=rA; teams[m.home].played++;
    teams[m.away].gf+=rA; teams[m.away].ga+=rH; teams[m.away].played++;
    if (rH>rA){ teams[m.home].pts+=3; teams[m.home].w++; teams[m.away].l++; }
    else if (rH<rA){ teams[m.away].pts+=3; teams[m.away].w++; teams[m.home].l++; }
    else { teams[m.home].pts+=1; teams[m.home].d++; teams[m.away].pts+=1; teams[m.away].d++; }
  });
  Object.values(teams).forEach(t => t.gd=t.gf-t.ga);
  return Object.values(teams).sort((a,b)=>
    b.pts-a.pts || b.gd-a.gd || b.gf-a.gf || a.name.localeCompare(b.name)
  );
}

function getBestThirdPlaceTeams() {
  const thirds = GROUPS.map(g => {
    const s = getGroupStandings(g);
    return s.length>=3 ? {...s[2], group:g} : null;
  }).filter(Boolean);
  return thirds.sort((a,b)=>b.pts-a.pts||b.gd-a.gd||b.gf-a.gf||a.name.localeCompare(b.name)).slice(0,8);
}

// Backtracking: asigna 3ros a ganadores según sus clusters
function assignThirdPlace(qualifying3rdGroups) {
  const winners = ['A','B','D','E','G','I','K','L'];
  const avail = new Set(qualifying3rdGroups);
  const asgn  = {};
  function bt(i) {
    if (i===winners.length) return true;
    const w = winners[i];
    for (const g of WINNER_CLUSTERS[w]) {
      if (avail.has(g)) {
        avail.delete(g); asgn[w]=g;
        if (bt(i+1)) return true;
        avail.add(g); delete asgn[w];
      }
    }
    return false;
  }
  return bt(0) ? asgn : null;
}

// ============================================
// AUTO-COMPLETAR R32
// ============================================
function autoFillR32() {
  // Verificar que TODOS los resultados de grupos estén ingresados
  const groupMatches = MATCHES.filter(m=>m.type==='group');
  const missing = groupMatches.filter(m=>{
    const r=state.results[m.id];
    return !r || r.home===null || r.away===null || isNaN(parseInt(r.home)) || isNaN(parseInt(r.away));
  });
  if (missing.length>0) {
    return { ok:false, msg:`Faltan ${missing.length} resultados de fase de grupos.` };
  }

  const standings = {};
  GROUPS.forEach(g => { standings[g]=getGroupStandings(g); });

  const best3rd = getBestThirdPlaceTeams();
  const q3Groups = best3rd.map(t=>t.group);
  const asgn    = assignThirdPlace(q3Groups);
  if (!asgn) return { ok:false, msg:'Error calculando la asignación de 3ros.' };

  // Resuelve un slot a nombre de equipo
  function resolve(slot) {
    if (slot.t==='w') return standings[slot.g][0]?.name || 'Por definir';
    if (slot.t==='r') return standings[slot.g][1]?.name || 'Por definir';
    if (slot.t==='t') {
      const g3 = asgn[slot.wg];
      return best3rd.find(t=>t.group===g3)?.name || 'Por definir';
    }
    return 'Por definir';
  }

  Object.entries(R32_BRACKET).forEach(([id, bracket]) => {
    state.knockoutTeams[id] = {
      home: resolve(bracket.home),
      away: resolve(bracket.away),
    };
  });

  saveState();

  const terceros = best3rd.map(t=>`${t.name} (Gr.${t.group} · ${t.pts}pts)`).join(', ');
  return {
    ok: true,
    msg: `✅ Ronda de 32 completada.\n8 terceros clasificados:\n${terceros}`
  };
}

function groupStageComplete() {
  return MATCHES.filter(m=>m.type==='group').every(m=>{
    const r=state.results[m.id];
    return r && r.home!==null && r.away!==null && !isNaN(parseInt(r.home)) && !isNaN(parseInt(r.away));
  });
}

// ============================================
// SUPABASE CONFIG
// ============================================
const SB_URL     = 'https://fmzegjktsbbvbodygrze.supabase.co';
const SB_KEY     = 'sb_publishable_BRigkzakgH6Rh_1ZwDtJGQ_LXYbqKH0';
const SB_HEADERS = {
  'Content-Type': 'application/json',
  'apikey':        SB_KEY,
  'Authorization': `Bearer ${SB_KEY}`,
};
const SB_ROW = 'game1';
let saveDebounce = null;

// Quién soy YO en este dispositivo (guardado local, no en Supabase)
let myPlayerIndex = null;

function loadMyPlayer() {
  const saved = localStorage.getItem('myPlayerIndex');
  if (saved !== null) myPlayerIndex = parseInt(saved);
}

function saveMyPlayer(idx) {
  myPlayerIndex = idx;
  localStorage.setItem('myPlayerIndex', idx);
}


// ============================================
// SISTEMA DE JUGADOR + PIN
// ============================================

function showPlayerPicker() {
  if (myPlayerIndex !== null) return;
  renderPickerOverlay('select');
}

function renderPickerOverlay(step, selectedIdx) {
  let existing = document.getElementById('player-picker');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'player-picker';

  if (step === 'select') {
    overlay.innerHTML = `
      <div class="picker-box">
        <div class="picker-title">⚽ ¿Quién sos?</div>
        <div class="picker-sub">Elegí tu jugador para este dispositivo</div>
        <div class="picker-btns">
          ${PLAYERS.map((name, i) => `
            <button class="picker-btn p${i+1}" onclick="renderPickerOverlay('create-pin', ${i})">
              ${name}
            </button>`).join('')}
        </div>
      </div>`;
  }

  else if (step === 'create-pin') {
    const name = PLAYERS[selectedIdx];
    overlay.innerHTML = `
      <div class="picker-box">
        <div class="picker-title">🔐 Creá tu PIN</div>
        <div class="picker-sub">Hola <strong>${name}</strong> — elegí un PIN de 4 dígitos.<br>Lo vas a necesitar cada vez que abras la app.</div>
        <input class="pin-input" id="pin1" type="password" inputmode="numeric" maxlength="4" placeholder="PIN">
        <div class="picker-sub" style="margin-top:12px">Confirmá tu PIN</div>
        <input class="pin-input" id="pin2" type="password" inputmode="numeric" maxlength="4" placeholder="Repetir PIN">
        <div class="pin-error" id="pin-error"></div>
        <button class="picker-confirm" onclick="confirmCreatePin(${selectedIdx})">Confirmar</button>
        <button class="picker-back" onclick="renderPickerOverlay('select')">← Volver</button>
      </div>`;
  }

  else if (step === 'login') {
    // Si no hay PIN guardado todavía, ir a crear uno
    if (!localStorage.getItem('pin_' + selectedIdx)) {
      renderPickerOverlay('create-pin', selectedIdx);
      return;
    }
    const name = PLAYERS[selectedIdx];
    overlay.innerHTML = `
      <div class="picker-box">
        <div class="picker-title">🔐 Ingresá tu PIN</div>
        <div class="picker-sub">Bienvenido/a <strong>${name}</strong></div>
        <input class="pin-input" id="pin-login" type="password" inputmode="numeric" maxlength="4" placeholder="PIN de 4 dígitos" autofocus>
        <div class="pin-error" id="pin-error"></div>
        <button class="picker-confirm" onclick="confirmLogin(${selectedIdx})">Entrar</button>
        <div class="picker-sub" style="margin-top:16px;font-size:11px">¿Olvidaste tu PIN? Contactá al admin (rabbit2026)</div>
      </div>`;
    // Allow Enter key
    setTimeout(() => {
      const inp = document.getElementById('pin-login');
      if (inp) inp.addEventListener('keydown', e => { if (e.key==='Enter') confirmLogin(selectedIdx); });
    }, 100);
  }

  else if (step === 'change') {
    overlay.innerHTML = `
      <div class="picker-box">
        <div class="picker-title">👤 Cambiar jugador</div>
        <div class="picker-sub">¿Quién sos?</div>
        <div class="picker-btns">
          ${PLAYERS.map((name, i) => `
            <button class="picker-btn p${i+1}" onclick="loginAs(${i})">
              ${name}
            </button>`).join('')}
        </div>
        <button class="picker-back" onclick="document.getElementById('player-picker').remove()">← Cancelar</button>
      </div>`;
  }

  document.body.appendChild(overlay);
}

function confirmCreatePin(idx) {
  const p1 = document.getElementById('pin1')?.value;
  const p2 = document.getElementById('pin2')?.value;
  const err = document.getElementById('pin-error');
  if (!p1 || p1.length !== 4 || !/^\d{4}$/.test(p1)) {
    err.textContent = 'El PIN debe ser de 4 dígitos numéricos.'; return;
  }
  if (p1 !== p2) {
    err.textContent = 'Los PINs no coinciden. Intentá de nuevo.'; return;
  }
  // Save PIN hashed (simple, not cryptographic — just obfuscation)
  const hash = btoa(p1 + '_' + idx);
  localStorage.setItem('pin_' + idx, hash);
  saveMyPlayer(idx);
  state.currentPlayer = idx;
  document.getElementById('player-picker')?.remove();
  render();
}

function loginAs(idx) {
  const stored = localStorage.getItem('pin_' + idx);
  if (!stored) {
    // No PIN set yet — create one
    renderPickerOverlay('create-pin', idx);
  } else {
    renderPickerOverlay('login', idx);
  }
}

function confirmLogin(idx) {
  const inp = document.getElementById('pin-login');
  const val = inp?.value;
  const err = document.getElementById('pin-error');
  const stored = localStorage.getItem('pin_' + idx);
  const expected = btoa(val + '_' + idx);
  if (expected === stored) {
    saveMyPlayer(idx);
    state.currentPlayer = idx;
    document.getElementById('player-picker')?.remove();
    render();
  } else {
    err.textContent = 'PIN incorrecto. Intentá de nuevo.';
    inp.value = '';
    inp.focus();
  }
}

function changePlayer() {
  renderPickerOverlay('change');
}

// Admin: resetear PIN de un jugador
function adminResetPin(idx) {
  if (!state.adminMode) return;
  localStorage.removeItem('pin_' + idx);
  localStorage.removeItem('myPlayerIndex');
  myPlayerIndex = null;
  showToast('PIN reseteado para ' + PLAYERS[idx]);
}

// ============================================
// AUTO-RESULTS
// Primario: worldcup26.ir (gratis, sin auth)
// Backup:   football-data.org
// ============================================
const FD_KEY = 'be5fd40eeb9c47c0a7a4d79b9c4cd978';
// Netlify Function — proxy interno, sin CORS
const RESULTS_URL = '/api/results';

// Mapa de nombres en inglés → español (nuestro sistema)
// Team mapping now handled server-side in netlify/functions/results.js


// ============================================
// APPLY RESULT — protege resultados manuales
// ============================================
function applyResult(match, homeScore, awayScore) {
  if (!match) return false;
  const h = parseInt(homeScore), a = parseInt(awayScore);
  if (isNaN(h) || isNaN(a)) return false;
  const existing = state.results[match.id];
  if (existing && !existing.auto) return false; // resultado manual: no tocar
  if (existing && existing.home === h && existing.away === a) return false; // mismo, no cambiar
  state.results[match.id] = { home: h, away: a, auto: true };
  return true;
}

async function fetchAutoResults() {
  let updated = false;
  try {
    const res = await fetch(RESULTS_URL);
    if (!res.ok) { console.warn('[API] status:', res.status); return; }
    const { matches } = await res.json();
    console.log('[API] partidos terminados:', matches?.length);
    (matches || []).forEach(m => {
      // Nombres ya en español — match directo
      const match = MATCHES.find(x =>
        (x.home === m.home || x.home === m.hs) &&
        (x.away === m.away || x.away === m.as)
      );
      if (!match) { console.warn('[API] sin match:', m.home, 'vs', m.away); return; }
      if (applyResult(match, m.hg, m.ag)) {
        console.log('[API] ✓', match.id, m.hg, '-', m.ag);
        updated = true;
      }
    });
    if (updated) { saveState(); render(); showToast('⚽ Resultados actualizados'); }
  } catch(e) { console.warn('[API] error:', e.message); }
}




// Toast de notificación
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = 'toast show';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ============================================
// STATE
// ============================================
let state = {
  currentPlayer:  0,
  currentSection: 'groups',
  currentDay:     null,
  adminMode:      false,
  predictions:    [{}, {}],
  results:        {},
  knockoutTeams:  {},
};

async function loadState() {
  try {
    const res = await fetch(
      `${SB_URL}/rest/v1/prode_state?id=eq.${SB_ROW}&select=data`,
      { headers: SB_HEADERS }
    );
    if (res.ok) {
      const rows = await res.json();
      if (rows.length > 0 && rows[0].data) {
        applyData(rows[0].data);
        localStorage.setItem('prode_mundial_2026', JSON.stringify(rows[0].data));
      }
      setSyncStatus('ok'); // Supabase OK aunque no haya datos aún
      return;
    }
  } catch (e) {
    console.warn('Supabase no disponible, usando cache local:', e);
  }
  // Sin conexión: usar localStorage
  try {
    const saved = localStorage.getItem('prode_mundial_2026');
    if (saved) applyData(JSON.parse(saved));
  } catch (e) {}
  setSyncStatus('offline');
}

function applyData(d) {
  const preds = d.predictions || [];
  // Asegurar que haya un objeto por cada jugador
  while (preds.length < PLAYERS.length) preds.push({});
  state.predictions   = preds;
  state.results       = d.results       || {};
  state.knockoutTeams = d.knockoutTeams || {};
}

function saveState() {
  const data = {
    predictions:   state.predictions,
    results:       state.results,
    knockoutTeams: state.knockoutTeams,
  };
  try { localStorage.setItem('prode_mundial_2026', JSON.stringify(data)); } catch(e) {}
  clearTimeout(saveDebounce);
  saveDebounce = setTimeout(() => pushToSupabase(data), 400);
}

async function pushToSupabase(data) {
  setSyncStatus('saving');
  try {
    const res = await fetch(`${SB_URL}/rest/v1/prode_state`, {
      method:  'POST',
      headers: { ...SB_HEADERS, 'Prefer': 'resolution=merge-duplicates' },
      body: JSON.stringify({
        id:         SB_ROW,
        data:       data,
        updated_at: new Date().toISOString(),
      }),
    });
    setSyncStatus(res.ok ? 'ok' : 'error');
  } catch (e) {
    setSyncStatus('error');
    console.warn('Error guardando en Supabase:', e);
  }
}

async function syncNow() {
  setSyncStatus('saving');
  await loadState();
  render();
}

function setSyncStatus(status) {
  const btn = document.getElementById('sync-btn');
  if (!btn) return;
  const icons = { ok:'\u2601\ufe0f', saving:'\u23f3', error:'\u26a0\ufe0f', offline:'\U0001f4f5' };
  const tips  = { ok:'Sincronizado', saving:'Guardando...', error:'Error al guardar', offline:'Sin conexion' };
  btn.textContent = status==='ok'?'☁️':status==='saving'?'⏳':status==='error'?'⚠️':'📵';
  btn.title       = tips[status] || '';
  btn.className   = `sync-btn sync-${status}`;
}

// ============================================
// POINTS LOGIC
// ============================================

function winner(home, away) {
  if (home > away) return 'H';
  if (home < away) return 'A';
  return 'D';
}

function calculatePoints(matchId, playerIndex) {
  const result = state.results[matchId];
  const pred   = state.predictions[playerIndex]?.[matchId];

  if (!result || result.home === null || result.away === null) return null;
  if (!pred   || pred.home   === ''   || pred.away   === '')   return null;

  const rH = parseInt(result.home), rA = parseInt(result.away);
  const pH = parseInt(pred.home),   pA = parseInt(pred.away);

  if (isNaN(rH) || isNaN(rA) || isNaN(pH) || isNaN(pA)) return null;

  if (rH === pH && rA === pA) return 5;                          // Exacto

  if (winner(rH, rA) === winner(pH, pA)) {
    return (rH - rA) === (pH - pA) ? 3 : 1;                     // Ganador ✓ + dif / solo ganador
  }

  return 0;
}

function getTotalPoints(playerIndex) {
  return MATCHES.reduce((sum, m) => {
    const pts = calculatePoints(m.id, playerIndex);
    return sum + (pts !== null ? pts : 0);
  }, 0);
}

function countFilledPredictions(playerIndex, matchType) {
  const matches = matchType
    ? MATCHES.filter(m => m.type === matchType)
    : MATCHES;

  return matches.filter(m => {
    const pred = state.predictions[playerIndex]?.[m.id];
    return pred && pred.home !== '' && pred.away !== '' &&
           !isNaN(parseInt(pred.home)) && !isNaN(parseInt(pred.away));
  }).length;
}

// ============================================
// MATCH TEAM RESOLUTION
// ============================================

function getTeams(match) {
  if (match.type === 'group') return { home: match.home, away: match.away };
  const ko = state.knockoutTeams[match.id];
  return {
    home: (ko && ko.home) ? ko.home : match.home,
    away: (ko && ko.away) ? ko.away : match.away,
  };
}

function teamsSet(match) {
  const t = getTeams(match);
  return t.home !== 'Por definir' && t.away !== 'Por definir';
}

// ============================================
// RENDER HELPERS
// ============================================

function pts_class(pts) {
  if (pts === 5) return 'pts-5';
  if (pts === 3) return 'pts-3';
  if (pts === 1) return 'pts-1';
  if (pts === 0) return 'pts-0';
  return '';
}

function renderMatchCard(match) {
  const p          = state.currentPlayer;
  const teams      = getTeams(match);
  const pred       = state.predictions[p]?.[match.id] || { home:'', away:'' };
  const result     = state.results[match.id];
  const pts        = calculatePoints(match.id, p);
  const defined    = teamsSet(match);
  const timeLocked = isLocked(match);
  // Admin puede editar pronósticos aunque haya pasado el tiempo límite
  // PERO no puede cambiar pronósticos si ya hay resultado cargado (eso sería trampa)
  const locked = (result != null) || (!state.adminMode && timeLocked);
  const urgency    = !locked ? timeUntilLock(match) : null;
  const timeStr    = match.kickoff_utc ? getArgTimeStr(match.kickoff_utc) : (match.date || '');
  const isFinal    = match.type === 'final';
  const homeVal    = (pred.home!==''&&pred.home!==undefined) ? pred.home : '';
  const awayVal    = (pred.away!==''&&pred.away!==undefined) ? pred.away : '';

  return `
    <div class="match-card ${result!=null?'has-result':''} ${isFinal?'is-final':''} ${timeLocked&&!result?'time-locked':''}">
      <div class="match-meta">
        ${match.group ? `<span class="group-badge">GR. ${match.group}</span>` : ''}
        ${match.label ? `<span class="match-label">${match.label}</span>` : ''}
        <span class="match-time">${timeStr} ARG</span>
        ${urgency          ? `<span class="urgency-badge">⏳ ${urgency}</span>` : ''}
        ${timeLocked&&!result ? `<span class="lock-badge">🔒 cerrado</span>` : ''}
        ${pts !== null     ? `<span class="match-pts ${pts_class(pts)}">${pts} pts</span>` : ''}
      </div>
      <div class="match-row">
        <span class="team-name home">${teams.home}</span>
        <div class="score-inputs">
          ${defined ? (() => {
            // Ocultar pronósticos ajenos mientras el partido no tiene resultado
            const isMyTab = (myPlayerIndex === null) || (myPlayerIndex === state.currentPlayer);
            const hide    = !isMyTab && !result && !state.adminMode;
            // Admin can edit predictions if no result yet (recovery mode)
            const hv = hide ? "" : homeVal;
            const av = hide ? "" : awayVal;
            const ph = hide ? 'placeholder="?"' : "";
            const hc = hide ? "score-input hidden-pred" : (homeVal!==""?"score-input filled":"score-input");
            const ac = hide ? "score-input hidden-pred" : (awayVal!==""?"score-input filled":"score-input");
            return `
              <input type="number" min="0" max="30" inputmode="numeric"
                     class="${hc}" value="${hv}" ${locked?"readonly":""} ${ph}
                     oninput="savePrediction('${match.id}','home',this.value)">
              <span class="vs">:</span>
              <input type="number" min="0" max="30" inputmode="numeric"
                     class="${ac}" value="${av}" ${locked?"readonly":""} ${ph}
                     oninput="savePrediction('${match.id}','away',this.value)">`;
          })() : `<span class="tbd-label">equipos por definir</span>`}
        </div>
        <span class="team-name away">${teams.away}</span>
      </div>
      ${result ? `
        <div class="real-result">
          Resultado: <strong>${teams.home} ${result.home} – ${result.away} ${teams.away}</strong>
          ${result.auto ? '<span class="auto-badge">auto</span>' : ''}
        </div>` : ''}
      ${timeLocked && !result && (homeVal===''||homeVal===undefined) && !state.adminMode ? `
        <div class="no-pred-tip">🔒 ¿No llegaste a cargar tu pronóstico? Contactá al admin</div>` : ''}
      ${state.adminMode ? renderAdminRow(match, teams, result) : ''}
    </div>
  `;
}

function renderAdminRow(match, teams, result) {
  const rHome = result ? result.home : '';
  const rAway = result ? result.away : '';
  const ko    = state.knockoutTeams[match.id] || {};
  const isKO  = match.type !== 'group';

  return `
    <div class="admin-row">
      ${isKO ? `
        <label>Equipo local:</label>
        <input type="text" class="admin-team-input"
               placeholder="${teams.home}"
               id="ath-${match.id}"
               value="${(ko.home && ko.home !== 'Por definir') ? ko.home : ''}">
        <label>Visitante:</label>
        <input type="text" class="admin-team-input"
               placeholder="${teams.away}"
               id="ata-${match.id}"
               value="${(ko.away && ko.away !== 'Por definir') ? ko.away : ''}">
        <button class="admin-confirm-btn" onclick="saveKnockoutTeams('${match.id}')" title="Guardar equipos">✓</button>
      ` : ''}
      <label>Resultado:</label>
      <input type="number" min="0" max="30" inputmode="numeric" class="admin-score"
             id="ares-h-${match.id}" value="${rHome}" placeholder="L">
      <span class="admin-sep">–</span>
      <input type="number" min="0" max="30" inputmode="numeric" class="admin-score"
             id="ares-a-${match.id}" value="${rAway}" placeholder="V">
      <button class="admin-confirm-btn" onclick="submitResult('${match.id}')" title="Confirmar resultado">✓</button>
      ${result ? `<button class="admin-clear-btn" onclick="clearResult('${match.id}')" title="Borrar resultado">✗</button>` : ''}
    </div>
  `;
}

// ============================================
// SECTION RENDERERS
// ============================================

function renderDay() {
  const day     = state.currentDay;
  const p       = state.currentPlayer;
  const matches = MATCHES
    .filter(m => m.type==='group' && m.kickoff_utc && getArgDate(m.kickoff_utc)===day)
    .sort((a,b) => new Date(a.kickoff_utc)-new Date(b.kickoff_utc));

  const filled = matches.filter(m => {
    const pr = state.predictions[p]?.[m.id];
    return pr && pr.home!=='' && pr.away!=='' && !isNaN(parseInt(pr.home)) && !isNaN(parseInt(pr.away));
  }).length;
  const pct = matches.length ? Math.round((filled/matches.length)*100) : 0;

  return `
    <div class="group-title day-title">${formatDayTitle(day)}</div>
    <div class="progress-bar-wrap">
      <div class="progress-label">
        <span>${PLAYERS[p]}</span>
        <span>${filled}/${matches.length} predicciones del día</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
    </div>
    <div class="matches-list">${matches.map(renderMatchCard).join('')}</div>
  `;
}

function renderKnockout() {
  const rounds = [
    { key:'r32',   label:'Ronda de 32',     cls:'r32' },
    { key:'r16',   label:'Octavos de Final', cls:'r16' },
    { key:'qf',    label:'Cuartos de Final', cls:'qf' },
    { key:'sf',    label:'Semifinales',      cls:'sf' },
    { key:'bronze',label:'Tercer Puesto',    cls:'bronze' },
    { key:'final', label:'⭐ FINAL',          cls:'final-title' },
  ];

  const complete = groupStageComplete();
  const autoBtn = state.adminMode ? `
    <div class="autofill-bar">
      <div class="autofill-info">
        ${complete
          ? '✅ Fase de grupos completa — podés auto-completar la Ronda de 32 desde los resultados reales.'
          : '⏳ Ingresá todos los resultados de grupos para habilitar el auto-completado.'}
      </div>
      ${complete ? `<button class="autofill-btn" onclick="triggerAutoFill()">⚡ Auto-completar R32</button>` : ''}
    </div>` : '';

  return autoBtn + rounds.map(round => {
    const matches = MATCHES.filter(m => m.type===round.key)
      .sort((a,b)=>(a.kickoff_utc&&b.kickoff_utc)?new Date(a.kickoff_utc)-new Date(b.kickoff_utc):0);
    if (!matches.length) return '';
    return `
      <div class="knockout-round">
        <div class="round-title ${round.cls}">${round.label}</div>
        <div class="matches-list">${matches.map(renderMatchCard).join('')}</div>
      </div>`;
  }).join('');
}

function triggerAutoFill() {
  const result = autoFillR32();
  alert(result.msg);
  if (result.ok) render();
}

function renderScoreboard() {
  const allPts = PLAYERS.map((_, i) => getTotalPoints(i));
  const maxPts = Math.max(...allPts, 0);

  const playerCards = PLAYERS.map((name, i) => {
    const pts    = allPts[i];
    const gPts   = MATCHES.filter(m => m.type==='group').reduce((s,m) => s+(calculatePoints(m.id,i)||0), 0);
    const kPts   = MATCHES.filter(m => m.type!=='group').reduce((s,m) => s+(calculatePoints(m.id,i)||0), 0);
    const filled = countFilledPredictions(i, 'group');
    const leader = pts === maxPts && pts > 0 ? 'leader' : '';
    return `
      <div class="player-total p${i+1}t ${leader}">
        <div class="sb-player-name">${name}</div>
        <div class="sb-total-pts">${pts}</div>
        <div class="sb-detail">Grupos: ${gPts} pts (${filled}/72)<br>Elim.: ${kPts} pts</div>
      </div>`;
  }).join('');

  const groupRows = GROUPS.map(g => {
    const ms   = MATCHES.filter(m => m.type==='group' && m.group===g);
    const gpts = PLAYERS.map((_,i) => ms.reduce((s,m) => s+(calculatePoints(m.id,i)||0), 0));
    const maxG = Math.max(...gpts, 0);
    const cols = gpts.map((p,i) => `<span class="t-p${i+1} ${p===maxG&&p>0?'leading':''}">${p}</span>`).join('');
    return `<div class="table-row" style="grid-template-columns:60px ${'1fr '.repeat(PLAYERS.length).trim()}">
      <span class="t-group">Gr.${g}</span>${cols}</div>`;
  }).join('');

  const koRounds = [
    {key:'r32',label:'R32'},{key:'r16',label:'Octavos'},{key:'qf',label:'Cuartos'},
    {key:'sf',label:'Semis'},{key:'bronze',label:'3er Pto'},{key:'final',label:'Final'},
  ];
  const koRows = koRounds.map(r => {
    const ms   = MATCHES.filter(m => m.type===r.key);
    const kpts = PLAYERS.map((_,i) => ms.reduce((s,m) => s+(calculatePoints(m.id,i)||0), 0));
    const maxK = Math.max(...kpts, 0);
    const cols = kpts.map((p,i) => `<span class="t-p${i+1} ${p===maxK&&p>0?'leading':''}">${p}</span>`).join('');
    return `<div class="table-row" style="grid-template-columns:60px ${'1fr '.repeat(PLAYERS.length).trim()}">
      <span class="t-group">${r.label}</span>${cols}</div>`;
  }).join('');

  const thCols = PLAYERS.map((n,i) => `<span class="th-p${i+1}">${n.split(' ')[0]}</span>`).join('');
  const thStyle = `grid-template-columns:60px ${'1fr '.repeat(PLAYERS.length).trim()}`;

  return `
    <div class="scoreboard">
      <div class="section-title">Marcador General</div>
      <div class="total-scores">${playerCards}</div>
      <div class="sub-title">Por Grupo</div>
      <div class="group-table">
        <div class="table-header" style="${thStyle}"><span>Grupo</span>${thCols}</div>
        ${groupRows}
      </div>
      <div class="sub-title">Eliminatorias</div>
      <div class="round-table group-table">
        <div class="table-header" style="${thStyle}"><span>Ronda</span>${thCols}</div>
        ${koRows}
      </div>
    </div>
  `;
}


// ============================================
// HEADER & NAV
// ============================================

function renderHeader() {
  // Actualizar puntos del jugador activo
  const pts = document.getElementById('header-pts');
  if (pts) pts.textContent = getTotalPoints(state.currentPlayer) + ' pts';
  // Actualizar botones
  PLAYERS.forEach((_, i) => {
    const btn = document.getElementById(`btn-p${i}`);
    if (btn) btn.classList.toggle('active', state.currentPlayer === i);
  });
}

function renderDayTabs() {
  const container = document.getElementById('group-tabs');
  if (state.currentSection !== 'groups') { container.style.display='none'; return; }
  container.style.display = 'flex';
  container.innerHTML = getMatchDays().map(day =>
    `<button class="group-tab ${state.currentDay===day?'active':''}"
             onclick="switchDay('${day}')">${formatDayLabel(day)}</button>`
  ).join('');
  setTimeout(() => {
    const active = container.querySelector('.group-tab.active');
    if (active) active.scrollIntoView({ inline:'center', behavior:'smooth', block:'nearest' });
  }, 50);
}

function renderMain() {
  const el = document.getElementById('main-content');
  if      (state.currentSection==='groups')     el.innerHTML = renderDay();
  else if (state.currentSection==='knockout')   el.innerHTML = renderKnockout();
  else if (state.currentSection==='scoreboard') el.innerHTML = renderScoreboard();
}

function render() {
  renderHeader();
  renderDayTabs();
  renderMain();
}

// ============================================
// USER ACTIONS
// ============================================

function switchPlayer(idx) {
  state.currentPlayer = idx;
  render();
}

function switchDay(day) {
  state.currentDay = day;
  renderDayTabs();
  renderMain();
}

function showSection(section, btn) {
  state.currentSection = section;
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderDayTabs();
  renderHeader();
  renderMain();
}

function toggleAdmin() {
  if (!state.adminMode) {
    const pwd = prompt('Contraseña admin:');
    if (pwd === null) return;            // canceló
    if (pwd !== 'rabbit2026') {
      alert('Contraseña incorrecta.');
      return;
    }
  }
  state.adminMode = !state.adminMode;
  const btn = document.getElementById('admin-btn');
  btn.classList.toggle('active', state.adminMode);
  renderMain();
}

function savePrediction(matchId, side, value) {
  const p = state.currentPlayer;
  if (!state.predictions[p][matchId]) state.predictions[p][matchId] = {home:'',away:''};
  const val = parseInt(value);
  state.predictions[p][matchId][side] = (!isNaN(val)&&val>=0) ? val : '';
  saveState();
  renderHeader();
  if (state.currentSection === 'groups') {
    const day = state.currentDay;
    const dayMatches = MATCHES.filter(m=>m.type==='group'&&m.kickoff_utc&&getArgDate(m.kickoff_utc)===day);
    const filled = dayMatches.filter(m=>{
      const pr=state.predictions[p]?.[m.id];
      return pr&&pr.home!==''&&pr.away!==''&&!isNaN(parseInt(pr.home))&&!isNaN(parseInt(pr.away));
    }).length;
    const fill = document.querySelector('.progress-fill');
    if (fill) fill.style.width=`${Math.round((filled/dayMatches.length)*100)}%`;
    const lbl = document.querySelector('.progress-label span:last-child');
    if (lbl) lbl.textContent=`${filled}/${dayMatches.length} predicciones del día`;
  }
}

function submitResult(matchId) {
  const hEl = document.getElementById(`ares-h-${matchId}`);
  const aEl = document.getElementById(`ares-a-${matchId}`);
  if (!hEl || !aEl) return;

  const home = parseInt(hEl.value);
  const away = parseInt(aEl.value);

  if (isNaN(home) || isNaN(away) || home < 0 || away < 0) {
    alert('Ingresá ambos goles (local y visitante).');
    return;
  }

  state.results[matchId] = { home, away };
  saveState();
  render();
}

function clearResult(matchId) {
  delete state.results[matchId];
  saveState();
  render();
}

function saveKnockoutTeams(matchId) {
  const hEl = document.getElementById(`ath-${matchId}`);
  const aEl = document.getElementById(`ata-${matchId}`);
  if (!hEl || !aEl) return;

  const home = hEl.value.trim() || 'Por definir';
  const away = aEl.value.trim() || 'Por definir';

  state.knockoutTeams[matchId] = { home, away };
  saveState();
  render();
}

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  loadMyPlayer();
  initSplash();
  await loadState();
  state.currentDay = getDefaultDay();
  render();
  // Mostrar selector o login según el estado guardado
  setTimeout(() => {
    if (myPlayerIndex === null) {
      renderPickerOverlay('select');
    } else {
      const hasPIN = localStorage.getItem('pin_' + myPlayerIndex) !== null;
      if (hasPIN) {
        renderPickerOverlay('login', myPlayerIndex);
      } else {
        // Tiene jugador pero no PIN — crear PIN
        renderPickerOverlay('create-pin', myPlayerIndex);
      }
    }
  }, 3800); // después del splash
  setInterval(() => { if (state.currentSection==='groups') renderMain(); }, 60000);

  // Auto-resultados: chequea al cargar y cada 2 minutos
  fetchAutoResults();
  setInterval(fetchAutoResults, 2 * 60 * 1000);
  // También al volver a la pestaña
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) fetchAutoResults();
  });
});

// Guardar antes de que mobile cierre/suspenda la página
window.addEventListener('pagehide', () => {
  const data = {
    predictions:   state.predictions,
    results:       state.results,
    knockoutTeams: state.knockoutTeams,
  };
  try { localStorage.setItem('prode_mundial_2026', JSON.stringify(data)); } catch(e) {}
  // Supabase sync con sendBeacon (no bloquea cierre de página)
  const body = JSON.stringify({ id: SB_ROW, data, updated_at: new Date().toISOString() });
  navigator.sendBeacon &&
    navigator.sendBeacon(
      `${SB_URL}/rest/v1/prode_state`,
      new Blob([body], { type: 'application/json' })
    );
});

// ============================================
// SPLASH ANIMATION
// ============================================
function initSplash() {
  const splash  = document.getElementById('splash');
  const flash   = document.getElementById('splash-flash');
  if (!splash) return;

  const slides  = ['s-rabbit', 's-marta', 's-outro'];
  let current   = 0;

  function showSlide(idx) {
    // Flash blanco rápido
    flash.classList.add('on');
    setTimeout(() => {
      flash.classList.remove('on');
      // Quitar active anterior
      document.querySelectorAll('.splash-slide').forEach(s => s.classList.remove('active'));
      // Activar nuevo
      const el = document.getElementById(slides[idx]);
      if (el) el.classList.add('active');
      current = idx;
    }, 60);
  }

  // Secuencia: Rabbit → Marta → Outro → exit
  showSlide(0);                                    // 0s   → Rabbit
  setTimeout(() => showSlide(1), 1300);            // 1.3s → Marta
  setTimeout(() => showSlide(2), 2600);            // 2.6s → Outro
  setTimeout(() => {                               // 3.5s → Fade out
    splash.classList.add('splash-exit');
    setTimeout(() => { splash.remove(); }, 550);   // 4.0s → Remove
  }, 3500);
}
