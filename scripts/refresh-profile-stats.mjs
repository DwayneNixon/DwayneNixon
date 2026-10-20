import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const LOGIN = 'DwayneNixon';
const FEATURED = [
  ['LUMEN-Visual-Navigation-Assistant', 'LUMEN', 'ASSISTIVE COMPUTER VISION'],
  ['unified-nl-interface', 'UNIFIED NL INTERFACE', 'NLP + DEVOPS AUTOMATION'],
  ['Re.volAlert', 'RE.VOLALERT', 'FINANCIAL NEWS SENTIMENT'],
  ['road_rescue_app', 'ROAD RESCUE', 'FLUTTER MOBILE APPLICATION'],
  ['Resumatic', 'RESUMATIC', 'AUTOMATED RESUME BUILDER'],
  ['CompsDeptWebsite', 'COMPS DEPT WEBSITE', 'DEPARTMENT WEB DEVELOPMENT'],
];
const C = { cyan: '#00eaff', pink: '#ff3fa4', purple: '#a66bff', text: '#e9f4ff', muted: '#a4b4d6', navy: '#0b132b', border: '#33466f', green: '#c8fb70' };
const escapeXML = (v) => String(v ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
const txt = (x,y,value,size=18,color=C.text,weight=600,spacing=0) => `<text x="${x}" y="${y}" font-family="'Arial Narrow','Segoe UI',Arial,sans-serif" font-size="${size}" fill="${color}" font-weight="${weight}" letter-spacing="${spacing}">${escapeXML(value)}</text>`;
const code = (x,y,value,size=14,color=C.cyan,spacing=1) => `<text x="${x}" y="${y}" font-family="'Courier New',monospace" font-size="${size}" fill="${color}" font-weight="bold" letter-spacing="${spacing}">${escapeXML(value)}</text>`;
const frame = (w,h,content) => `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Live GitHub telemetry"><defs><linearGradient id="back" x2="1" y2="1"><stop stop-color="#080d20"/><stop offset="1" stop-color="#1b103a"/></linearGradient><linearGradient id="neon" x2="1" y2="0"><stop stop-color="${C.cyan}"/><stop offset=".57" stop-color="${C.purple}"/><stop offset="1" stop-color="${C.pink}"/></linearGradient><pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" fill="none" stroke="#233758" stroke-width=".8" opacity=".5"/></pattern></defs><rect width="${w}" height="${h}" rx="12" fill="url(#back)"/><rect width="${w}" height="${h}" fill="url(#grid)"/><rect x="2" y="2" width="${w-4}" height="${h-4}" rx="10" fill="none" stroke="${C.border}" stroke-width="2"/><path d="M24 18H196" stroke="url(#neon)" stroke-width="4"/>${content}</svg>\n`;
const number = (n) => Number.isFinite(n) ? n.toLocaleString('en-GB') : '—';
const timestamp = (date) => new Intl.DateTimeFormat('en-GB',{year:'numeric',month:'short',day:'2-digit',timeZone:'UTC',hour:'2-digit',minute:'2-digit',hour12:false}).format(date) + ' UTC';
const safeDate = (value) => value ? String(value).slice(0,10) : 'NO PUSH DATA';

export function telemetrySVG({ user, repos, contributions, syncedAt }) {
  const publicRepos = Number(user.public_repos);
  const followers = Number(user.followers);
  const originalPublic = repos.filter(r => !r.fork && !r.private);
  const stars = originalPublic.reduce((sum,r) => sum + Number(r.stargazers_count || 0), 0);
  // Every telemetry value comes from GitHub API responses; no hard-coded counts.
  const forks = originalPublic.reduce((sum,r) => sum + Number(r.forks_count || 0), 0);
  const fourth = Number.isInteger(contributions?.totalContributions) ?
    { value: contributions.totalContributions, label: 'CONTRIBUTIONS / YEAR', note: 'GITHUB CALENDAR' } :
    { value: forks, label: 'REPOSITORY FORKS', note: 'ORIGINAL PUBLIC REPOS' };
  const cards = [
    { label: 'PUBLIC REPOSITORIES',value:publicRepos,note:'GITHUB ACCOUNT',accent:C.cyan },
    { label: 'STARS EARNED',value:stars,note:'ORIGINAL PUBLIC REPOS',accent:C.pink },
    { label: 'FOLLOWERS',value:followers,note:'GITHUB ACCOUNT',accent:C.purple },
    { ...fourth,accent:C.green },
  ];
  const parts=[code(36,50,'LIVE TELEMETRY // GITHUB API',17,C.cyan,2),code(795,49,'SYNCED '+timestamp(syncedAt),13,C.muted,0)];
  cards.forEach((card,i)=>{
    const x = 30 + i*288;
    parts.push(`<rect x="${x}" y="79" width="276" height="195" rx="7" fill="#121a35" stroke="${C.border}" stroke-width="2"/>`);
    parts.push(`<path d="M${x+16} 98h100" stroke="${card.accent}" stroke-width="5"/>`);
    parts.push(code(x+16,126,card.label,13,card.accent,1));
    parts.push(txt(x+16,212,number(card.value),74,C.text,900,1));
    parts.push(code(x+16,249,card.note,12,C.muted,0));
  });
  parts.push(`<path d="M32 294H1167" stroke="${C.border}" stroke-width="2"/>`);
  parts.push(code(37,321,"PUBLIC METRICS  //  GITHUB SOURCE DATA  //  REFRESH: EVERY 6 HOURS",15,C.cyan,1));
  return frame(1200,346,parts.join(''));
}

export function projectsSVG({ featured, syncedAt }) {
  const H=604;
  const parts=[code(36,48,'REPOSITORY SIGNALS  //  VERIFIED PERSONAL PROJECTS',17,C.cyan,1.8),code(878,49,'UPDATED '+timestamp(syncedAt).slice(0,11),12,C.muted,0)];
  featured.forEach((obj,i)=>{
    const y=70+i*82;
    parts.push(`<rect x="27" y="${y}" width="1146" height="73" rx="5" fill="${i%2===0?'#111b37':'#0c1631'}" stroke="${C.border}"/>`);
    parts.push(`<rect x="27" y="${y}" width="6" height="73" fill="${i%2===0?C.cyan:C.pink}"/>`);
    parts.push(code(49,y+30,String(i+1).padStart(2,'0'),24,C.cyan,1));
    parts.push(txt(110,y+29,obj.name,24,C.text,800,1));
    parts.push(code(110,y+54,obj.description,12,C.muted,1));
    parts.push(code(745,y+30,'STARS',13,C.pink,1));
    parts.push(txt(747,y+58,number(obj.stars),25,C.text,900,1));
    parts.push(code(870,y+30,'FORKS',13,C.purple,1));
    parts.push(txt(870,y+58,number(obj.forks),25,C.text,900,1));
    parts.push(code(981,y+28,'LAST PUSH',12,C.cyan,1));
    parts.push(code(981,y+55,safeDate(obj.pushed_at),16,C.text,0));
  });
  parts.push(code(36,587,'TRACKING VERIFIED REPOSITORIES  //  ALL METRICS FETCHED FROM GITHUB',14,C.cyan,1));
  return frame(1200,H,parts.join(''));
}

export function calendarSVG({ contributions, syncedAt }) {
  const header=[code(35,46,'PUBLIC CONTRIBUTION CALENDAR // LAST 12 MONTHS',18,C.cyan,1.6),code(875,46,'SYNC: '+timestamp(syncedAt).slice(0,11),13,C.muted,0)];
  if (!contributions?.weeks?.length) {
    return frame(1200,214,[...header,txt(45,107,'CALENDAR OFFLINE — GITHUB API DID NOT RETURN ACTIVITY',23,C.text,800,0),code(45,147,'CHECK YOUR GITHUB CONTRIBUTIONS TAB FOR LIVE ACTIVITY',15,C.pink,1),code(45,188,'OTHER TELEMETRY PANELS STILL UPDATE FROM GITHUB REST',13,C.muted,0)].join(''));
  }
  const weeks=contributions.weeks.slice(-53);
  const days=weeks.flatMap(w=>w.contributionDays||[]).map(v=>Number(v.contributionCount)||0);
  const max=Math.max(1,...days);
  const colors=['#172345','#195a73','#138da7',C.cyan,C.pink];
  for(let wi=0;wi<weeks.length;wi++)for(const d of weeks[wi].contributionDays||[]){
    const dow = new Date(d.date+'T00:00:00Z').getUTCDay();
    const count=Math.max(0,Number(d.contributionCount)||0);
    const level = !count?0:Math.min(4,Math.max(1,Math.ceil(count/max*4)));
    const x = 62+wi*20, y=78+dow*22;
    header.push(`<rect x="${x}" y="${y}" width="15" height="15" rx="3" fill="${colors[level]}" stroke="#223252" stroke-width=".4"><title>${escapeXML(d.date)}: ${count} contributions</title></rect>`);
  }
  header.push(code(39,259,'GITHUB-REPORTED TOTAL: '+number(contributions.totalContributions),15,C.green,1));
  header.push(code(760,258,'LESS',12,C.muted,1));
  colors.forEach((c,i)=>header.push(`<rect x="${810+i*20}" y="244" width="14" height="14" rx="2" fill="${c}"/>`));
  header.push(code(918,258,'MORE',12,C.muted,1));
  header.push(code(41,291,'PUBLIC CONTRIBUTION VISIBILITY FOLLOWS GITHUB ACCOUNT SETTINGS',12,C.muted,0));
  return frame(1200,313,header.join(''));
}

async function rest(path,token){
  const r=await fetch('https://api.github.com/'+path,{headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',...(token?{Authorization:`Bearer ${token}`}:{})},signal:AbortSignal.timeout(20000)});
  if(!r.ok)throw new Error(`GitHub REST ${r.status}: ${path}: ${(await r.text()).slice(0,300)}`);
  return r.json();
}
async function getPublicRepos(token){
  const all=[];
  for(let page=1;page<=20;page++){
    const chunk=await rest(`users/${LOGIN}/repos?per_page=100&page=${page}&type=owner`,token);
    if(!Array.isArray(chunk))throw new Error('Invalid repositories response');
    all.push(...chunk.filter(r=>r.owner?.login?.toLowerCase()===LOGIN.toLowerCase()&&!r.private));
    if(chunk.length<100)break;
  }
  return all;
}
async function getCalendar(token){
  if(!token)return null;
  const q=`query($login:String!) { user(login:$login) { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } } } } }`;
  const r=await fetch('https://api.github.com/graphql',{method:'POST',headers:{Accept:'application/vnd.github+json','Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({query:q,variables:{login:LOGIN}}),signal:AbortSignal.timeout(20000)});
  if(!r.ok)throw new Error('GitHub GraphQL '+r.status);
  const data=await r.json();
  if(data.errors?.length)throw new Error(JSON.stringify(data.errors));
  return data.data?.user?.contributionsCollection?.contributionCalendar||null;
}
export async function main(){
  const token=process.env.GITHUB_TOKEN||'';
  if(!token)throw new Error('GITHUB_TOKEN not provided');
  const [user,repos]=await Promise.all([rest(`users/${LOGIN}`,token),getPublicRepos(token)]);
  if(user.login?.toLowerCase()!==LOGIN.toLowerCase())throw new Error('Unexpected account returned by API');
  let contributions=null;
  try{contributions=await getCalendar(token);}catch(e){console.warn('Contribution calendar unavailable:',e.message);}
  const featured = FEATURED.map(([repo,name,description])=>{
    const item=repos.find(r=>r.name.toLowerCase()===repo.toLowerCase());
    if(!item)throw new Error(`Public, credited repository not found: ${repo}`);
    return {name,description,stars:item.stargazers_count,forks:item.forks_count,pushed_at:item.pushed_at};
  });
  const syncedAt=new Date();
  mkdirSync('assets',{recursive:true});
  writeFileSync('assets/telemetry-board.svg',telemetrySVG({user,repos,contributions,syncedAt}));
  writeFileSync('assets/repository-signals.svg',projectsSVG({featured,syncedAt}));
  writeFileSync('assets/contribution-activity.svg',calendarSVG({contributions,syncedAt}));
  console.log(`Updated: ${user.public_repos} public repos, ${featured.length} verified projects, ${user.followers} followers; GraphQL calendar ${contributions?'OK':'unavailable'}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url)===process.argv[1]) {
  main().catch(e=>{console.error(e);process.exitCode=1;});
}
