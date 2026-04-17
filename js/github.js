/**
 * github.js — Fetch GitHub public repos
 * Chamil Kulasingha Portfolio
 */

const GITHUB_USERNAME = 'CHaMiYa2'; // Update if username is different

async function fetchGitHubRepos() {
  const container = document.getElementById('github-repos');
  const countEl = document.getElementById('github-repo-count');
  if (!container) return;

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6&type=public`);
    if (!res.ok) throw new Error('GitHub API error');
    const repos = await res.json();

    if (countEl) {
      // Also fetch user info for total
      const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
      const user = await userRes.json();
      countEl.textContent = user.public_repos || repos.length;
    }

    // Filter out forks if desired
    const filtered = repos.filter(r => !r.fork).slice(0, 6);

    container.innerHTML = filtered.map(repo => `
      <a href="${repo.html_url}" target="_blank" rel="noopener" class="github-repo-card reveal">
        <div class="repo-top">
          <span class="repo-icon">📁</span>
          <span class="repo-name">${repo.name}</span>
        </div>
        <p class="repo-desc">${repo.description || 'No description provided.'}</p>
        <div class="repo-meta">
          ${repo.language ? `<span class="repo-lang"><span class="lang-dot"></span>${repo.language}</span>` : ''}
          <span class="repo-stars">⭐ ${repo.stargazers_count}</span>
          <span class="repo-forks">🍴 ${repo.forks_count}</span>
        </div>
      </a>
    `).join('');

    // Re-observe new elements
    document.querySelectorAll('.github-repo-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      setTimeout(() => {
        el.style.transition = 'all 0.5s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 100);
    });

  } catch (err) {
    console.warn('Could not fetch GitHub repos:', err.message);
    container.innerHTML = `<p style="color:var(--text-muted);font-size:0.9rem;text-align:center;grid-column:1/-1;">
      Could not load repositories. <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" style="color:var(--accent)">View on GitHub →</a>
    </p>`;
  }
}

document.addEventListener('DOMContentLoaded', fetchGitHubRepos);
