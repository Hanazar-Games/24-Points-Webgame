// Test simplification logic
function tokenize(s) {
    const r = [];
    for (const c of s.replace(/\s/g, '')) {
        if (/\d/.test(c)) { if (r.length && /^\d/.test(r[r.length-1])) r[r.length-1]+=c; else r.push(c); }
        else r.push(c);
    }
    return r;
}
function parseExpr(t) { return parseAddSub(t); }
function parseAddSub(t) {
    let left = parseMulDiv(t);
    if (!left) return null;
    while (t.length && (t[0]==='+'||t[0]==='-')) {
        const op = t.shift();
        const right = parseMulDiv(t);
        if (!right) return null;
        left = {type: op, left, right};
    }
    return left;
}
function parseMulDiv(t) {
    let left = parsePrimary(t);
    if (!left) return null;
    while (t.length && (t[0]==='*'||t[0]==='/')) {
        const op = t.shift();
        const right = parsePrimary(t);
        if (!right) return null;
        left = {type: op, left, right};
    }
    return left;
}
function parsePrimary(t) {
    if (t[0]==='(') { t.shift(); const e = parseExpr(t); if (!e || t.shift()!==')') return null; return e; }
    if (/^\d/.test(t[0])) return {type: 'num', value: parseFloat(t.shift())};
    return null;
}
function fmt(n) { return Math.abs(n - Math.round(n)) < 1e-9 ? String(Math.round(n)) : String(n); }
function needsParens(isRight, parent, child) { return child < parent || (isRight && child === parent); }
function toStr(parentPrec, isRight, e) {
    if (e.type === 'num') return fmt(e.value);
    const prec = e.type === '+' || e.type === '-' ? 1 : 2;
    const s = toStr(prec, false, e.left) + e.type + toStr(prec, e.type==='-'||e.type==='/', e.right);
    return needsParens(isRight, parentPrec, prec) ? '(' + s + ')' : s;
}
function simplify(s) {
    const t = [...tokenize(s)];
    const e = parseExpr(t);
    return e && t.length === 0 ? toStr(1, false, e) : s;
}
const tests = [
    '(8/(3-(8/3)))',
    '(((10*10)-4)/4)',
    '((5-(1/5))*5)',
    '(6/(1-(3/4)))',
    '((2+4)*3)',
    '(((2+4)*3)+6)'
];
for (const t of tests) {
    console.log(t, '->', simplify(t));
}
