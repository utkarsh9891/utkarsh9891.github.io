(function () {
  "use strict";

  var grid = document.getElementById("app-grid");
  if (!grid) return;

  function origin() {
    if (typeof window === "undefined" || !window.location) return "";
    return window.location.origin;
  }

  function resolveUrl(item) {
    if (item.href) return item.href;
    var p = (item.path || "").replace(/^\//, "");
    return origin() + "/" + p;
  }

  function iconSvg(name) {
    var icons = {
      sync:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 18c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3zm0-14V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8z"/></svg>',
      github:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>',
      candle:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 20V10h3v10H4zm7 0V5h3v15h-3zm7 0V8h3v12h-3z"/></svg>',
    };
    return icons[name] || icons.github;
  }

  function card(item) {
    var isPlaceholder = item.status === "placeholder";
    var article = document.createElement("article");
    article.className = "app-card" + (isPlaceholder ? " app-card--placeholder" : " app-card--clickable");
    article.setAttribute("data-app-id", item.id || "");

    var inner = document.createElement("div");
    inner.className = "app-card__inner";

    var icon = document.createElement("div");
    icon.className = "app-card__icon";
    icon.innerHTML = iconSvg(item.icon || "github");

    var body = document.createElement("div");
    body.className = "app-card__body";

    var titleId = "app-card-title-" + (item.id || "item").replace(/[^a-z0-9-]/gi, "-");
    var title = document.createElement("h3");
    title.className = "app-card__title";
    title.id = titleId;
    title.textContent = item.title || "Untitled";

    var desc = document.createElement("p");
    desc.className = "app-card__desc";
    desc.textContent = item.description || "";

    var pathRow = document.createElement("p");
    pathRow.className = "app-card__path";
    if (item.href) {
      pathRow.textContent = item.href.replace(/^https?:\/\//, "");
    } else {
      pathRow.textContent = "/" + (item.path || "").replace(/^\//, "");
    }

    var tags = document.createElement("div");
    tags.className = "app-card__tags";
    (item.tags || []).forEach(function (t) {
      var span = document.createElement("span");
      span.className = "tag";
      span.textContent = t;
      tags.appendChild(span);
    });

    var footer = document.createElement("div");
    footer.className = "app-card__footer";

    var badge = document.createElement("span");
    badge.className =
      "app-card__badge" + (item.kind === "tool" ? " app-card__badge--tool" : "");
    badge.textContent =
      item.kind === "tool"
        ? "Tool I built"
        : item.kind === "link"
          ? "Profile"
          : "Mini app";

    var trail;
    if (isPlaceholder) {
      trail = document.createElement("span");
      trail.className = "app-card__status";
      trail.textContent = "Coming soon";
    } else {
      trail = document.createElement("span");
      trail.className = "app-card__hint";
      trail.setAttribute("aria-hidden", "true");
      trail.textContent = "Open →";
    }

    footer.appendChild(badge);
    footer.appendChild(trail);

    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(pathRow);
    if (tags.childNodes.length) body.appendChild(tags);

    inner.appendChild(icon);
    inner.appendChild(body);
    inner.appendChild(footer);

    if (isPlaceholder) {
      article.appendChild(inner);
      article.setAttribute("aria-label", (item.title || "App") + ", coming soon");
    } else {
      var url = resolveUrl(item);
      var link = document.createElement("a");
      link.className = "app-card__link";
      link.href = url;
      link.target = item.href ? "_blank" : "_self";
      link.rel = item.href ? "noopener noreferrer" : "";
      link.setAttribute("aria-labelledby", titleId);
      link.appendChild(inner);
      article.appendChild(link);
    }

    return article;
  }

  function render(data) {
    grid.innerHTML = "";
    var items = (data && data.items) || [];
    items.forEach(function (item) {
      grid.appendChild(card(item));
    });
  }

  function parseEmbedded() {
    var el = document.getElementById("app-manifest");
    if (!el || !el.textContent) return null;
    try {
      return JSON.parse(el.textContent.trim());
    } catch (e) {
      return null;
    }
  }

  /** GitHub Pages host only — ?local=1 is ignored here so production never swaps manifests. */
  function isGithubPagesHost() {
    var h = (window.location.hostname || "").toLowerCase();
    return h === "github.io" || h.slice(-10) === ".github.io";
  }

  /** Loopback, file://, RFC1918 LAN, or *.local — not public internet hostnames. */
  function isLikelyDevHost() {
    var h = (window.location.hostname || "").toLowerCase();
    if (
      h === "localhost" ||
      h === "127.0.0.1" ||
      h === "[::1]" ||
      h === "0.0.0.0" ||
      h === ""
    ) {
      return true;
    }
    if (h.length > 6 && h.slice(-6) === ".local") return true;
    if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
    if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
    var m = /^172\.(\d{1,3})\./.exec(h);
    if (m) {
      var n = parseInt(m[1], 10);
      if (n >= 16 && n <= 31) return true;
    }
    return false;
  }

  /** On a dev machine (not *.github.io), ?local=1 loads apps.local.json. */
  function wantsLocalManifest() {
    try {
      if (isGithubPagesHost()) return false;
      if (!isLikelyDevHost()) return false;
      var params = new URLSearchParams(window.location.search || "");
      var v = params.get("local");
      return v === "1" || v === "true";
    } catch (e) {
      return false;
    }
  }

  function manifestUrl() {
    return wantsLocalManifest() ? "apps.local.json" : "apps.json";
  }

  fetch(manifestUrl(), { cache: "no-store" })
    .then(function (r) {
      if (!r.ok) throw new Error(r.statusText);
      return r.json();
    })
    .then(render)
    .catch(function () {
      if (wantsLocalManifest()) {
        grid.innerHTML =
          '<p class="app-grid__error">Could not load <code>apps.local.json</code>. Add it next to <code>index.html</code> and hard-refresh (cache). If you opened an old tab, open <code>/?local=1</code> again.</p>';
        return;
      }
      var embedded = parseEmbedded();
      if (embedded && embedded.items && embedded.items.length) {
        render(embedded);
        return;
      }
      grid.innerHTML =
        '<p class="app-grid__error">Something went wrong loading the app list.</p>';
    });
})();
