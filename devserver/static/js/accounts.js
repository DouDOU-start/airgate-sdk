// 账号列表、CRUD、连通测试

import { API, getBadgeStyle, getTypeLabel, maskKey, iconLetter } from './utils.js';
import { loadScheduler } from './scheduler.js';

/** 从 JWT 中解析 plan_type（不验签） */
function parsePlanFromJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return '';
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload?.['https://api.openai.com/auth']?.chatgpt_plan_type || '';
  } catch { return ''; }
}

export async function loadAccounts() {
  const res = await fetch(API + '/api/accounts');
  const accounts = await res.json();
  const el = document.getElementById('account-list');
  if (!accounts?.length) {
    el.innerHTML = '<div class="empty-state">暂无账号<small>点击「+ 添加」创建第一个账号</small></div>';
    return;
  }
  el.innerHTML = accounts.map(a => {
    const style = getBadgeStyle(a.account_type);
    const typeLabel = getTypeLabel(a.account_type);
    const credKeys = Object.keys(a.credentials || {});
    const credHint = credKeys.length > 0 ? maskKey(a.credentials[credKeys[0]]) : '';
    const weight = a.weight || 1;
    const planType = a.credentials?.plan_type || parsePlanFromJWT(a.credentials?.access_token || '');
    const planBadge = planType ? `<span class="acct-plan-badge acct-plan-${planType}">${planType}</span>` : '';
    return `<div class="acct-item">
      <div class="acct-avatar" style="background:${style.bg};color:${style.fg}">${iconLetter(a.name, a.account_type)}</div>
      <div class="acct-detail">
        <div class="acct-name">${a.name || '未命名'} ${planBadge}</div>
        <div class="acct-sub">
          <span class="acct-type-badge" style="background:${style.bg};color:${style.fg}">${typeLabel}</span>
          ${credHint ? `<span>${credHint}</span>` : ''}
        </div>
        <div id="usage-${a.id}" class="acct-usage" style="display:none"></div>
      </div>
      <span id="test-result-${a.id}" class="acct-test-result" style="display:none"></span>
      <span class="acct-weight-tag" title="权重（点击修改）" data-id="${a.id}" data-weight="${weight}">W:${weight}</span>
      <div class="acct-ops">
        <button class="btn-sm" id="test-btn-${a.id}" data-action="test" data-id="${a.id}" title="连通测试">⚡</button>
        <button class="btn-sm" data-action="edit" data-id="${a.id}" title="编辑">✎</button>
        <button class="btn-sm danger" data-action="delete" data-id="${a.id}" title="删除">✕</button>
      </div>
    </div>`;
  }).join('');
  // 异步加载每个账号的用量
  accounts.forEach(a => loadAccountUsage(a.id));
}

export function editWeight(event, id, current) {
  event.stopPropagation();
  const el = event.currentTarget;
  const input = document.createElement('input');
  input.className = 'weight-edit';
  input.type = 'number';
  input.min = '0';
  input.value = current;
  el.replaceWith(input);
  input.focus();
  input.select();
  async function commit() {
    const val = parseInt(input.value) || 1;
    await fetch(API + '/api/scheduler/weight/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weight: val })
    });
    loadAccounts();
    loadScheduler();
  }
  input.addEventListener('blur', commit);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') input.blur(); });
}

export async function testAccount(id) {
  const btn = document.getElementById('test-btn-' + id);
  const result = document.getElementById('test-result-' + id);
  btn.classList.add('testing');
  result.style.display = 'inline-block';
  result.className = 'acct-test-result loading';
  result.textContent = '测试中...';
  try {
    const res = await fetch(API + '/api/accounts/test/' + id, { method: 'POST' });
    const data = await res.json();
    if (data.ok) {
      result.className = 'acct-test-result ok';
      result.textContent = '✓ ' + data.duration;
    } else {
      result.className = 'acct-test-result fail';
      result.textContent = '✗ ' + (data.error || '失败');
      result.title = data.error || '';
    }
  } catch {
    result.className = 'acct-test-result fail';
    result.textContent = '✗ 网络错误';
  }
  btn.classList.remove('testing');
  setTimeout(() => { result.style.display = 'none'; }, 8000);
}

export async function deleteAccount(id) {
  if (!confirm('确定删除此账号？')) return;
  await fetch(API + '/api/accounts/' + id, { method: 'DELETE' });
  loadAccounts();
  loadScheduler();
}

/** 查询并展示账号用量（Codex 速率限制） */
export async function loadAccountUsage(id) {
  const el = document.getElementById('usage-' + id);
  if (!el) return;
  try {
    const res = await fetch(API + '/api/accounts/usage/' + id);
    const data = await res.json();
    if (!data.available || !data.usage) {
      el.style.display = 'none';
      return;
    }
    const u = data.usage;
    const parts = [];
    const wl = (min) => min >= 1440 ? Math.round(min / 1440) + 'd' : min >= 60 ? Math.round(min / 60) + 'h' : min + 'm';
    const bar = (label, pct) => `<span class="usage-label">${label}</span><span class="usage-bar"><span class="usage-fill ${usageColor(pct)}" style="width:${Math.max(Math.min(pct, 100), 1)}%"></span></span><span class="usage-pct">${pct.toFixed(1)}%</span>`;
    // 总限制（primary_window_minutes > 0 表示头存在）
    if (u.primary_window_minutes > 0) parts.push(bar(wl(u.primary_window_minutes), u.primary_used_percent));
    if (u.secondary_window_minutes > 0) parts.push(bar(wl(u.secondary_window_minutes), u.secondary_used_percent));
    // 模型子限制（bengalfox）
    // 从 limit_name 提取短名，如 "GPT-5.3-Codex-Spark" → "Spark"
    const shortLimit = (u.limit_name || '').split('-').pop() || 'model';
    if (u.bengalfox_primary_window_minutes > 0) {
      parts.push(bar(shortLimit + ' ' + wl(u.bengalfox_primary_window_minutes), u.bengalfox_primary_used_percent));
    }
    if (u.bengalfox_secondary_window_minutes > 0) {
      parts.push(bar(shortLimit + ' ' + wl(u.bengalfox_secondary_window_minutes), u.bengalfox_secondary_used_percent));
    }
    if (parts.length === 0) {
      el.style.display = 'none';
      return;
    }
    el.innerHTML = parts.join('');
    el.style.display = 'flex';
  } catch {
    el.style.display = 'none';
  }
}

function usageColor(pct) {
  if (pct >= 90) return 'usage-danger';
  if (pct >= 70) return 'usage-warn';
  return 'usage-ok';
}
