const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const config = fs.readFileSync(path.join(root, 'js', 'config.js'), 'utf8');
const navigation = fs.readFileSync(path.join(root, 'js', 'navigation.js'), 'utf8');
const videoCatalog = fs.readFileSync(path.join(root, 'js', 'video-catalog.js'), 'utf8');
const packages = fs.existsSync(path.join(root, 'js', 'packages.js'))
  ? fs.readFileSync(path.join(root, 'js', 'packages.js'), 'utf8')
  : '';

function count(selector) {
  return (html.match(new RegExp(selector, 'g')) || []).length;
}

assert.equal(count('<section id="[^>]+" class="section-slide refresh-section[^\"]*"'), 8,
  'media kit should have eight focused sections');
assert.equal(count('class="side-nav-dot'), 8,
  'side navigation should match the eight sections');
assert.match(html, /class="[^"]*hero-stat-strip[^"]*"/, 'hero should surface proof metrics');
assert.match(html, /class="[^"]*hero-primary-cta[^"]*"/, 'hero should have a primary conversion CTA');
assert.match(html, /id="cases"[\s\S]*class="[^"]*v1-brand-item[^"]*active[^"]*"/, 'case showcase should remain interactive');
assert.match(html, /class="[^"]*pricing-card-featured[^"]*"/, 'featured package should remain visible');
assert.doesNotMatch(html, /mailto:/i, 'the refreshed media kit should not add email contact');
assert.match(html, /t\.me\/denys_tsy/, 'Telegram should remain the primary contact route');
assert.ok(html.indexOf('js/slide4_1.js') < html.indexOf('js/app.js'),
  'performance animation module should load before app bootstrap');
assert.ok(html.indexOf('js/video-catalog.js') < html.indexOf('js/app.js'),
  'video catalogue module should load before app bootstrap');
assert.equal((config.match(/id: '[0-9]+', url:/g) || []).length, 12,
  'case metrics config should include twelve videos');
for (const id of [
  '7681689198004391189', '7680939390176120085', '7679505692327267604',
  '7678020032286215444', '7678259066111528213', '7677199513466981652',
  '7674668351829970197'
]) {
  assert.match(config, new RegExp(id), `case config should include video ${id}`);
}
assert.match(html, /class="video-catalog-toolbar[^"]*"/, 'cases should have a filter toolbar');
assert.match(html, /data-video-filter="all"/, 'cases should have an all filter');
assert.match(html, /data-video-filter="beauty"/, 'cases should have a beauty filter');
assert.match(html, /class="[^"]*video-catalog-grid[^"]*"/, 'cases should use a compact video grid');
assert.equal(count('class="[^\"]*video-catalog-card[^\"]*"'), 12,
  'video catalog should render twelve cards');
assert.match(html, /class="selected-work-toolbar[^"]*"/, 'selected work should have a dedicated sorting toolbar');
assert.match(html, /data-video-sort="newest"/, 'selected work should default to newest-first sorting');
assert.match(html, /data-video-sort="views"/, 'selected work should offer sorting by views');
assert.match(html, /class="selected-work-timeline[^"]*"/, 'selected work should expose a chronological timeline');
assert.match(html, /class="[^"]*pricing-cards-3grid[^"]*"/, 'packages should use a compact 3-grid layout');
assert.match(html, /class="[^"]*pricing-custom-banner[^"]*"/, 'packages should provide negotiable VIP custom banner');
assert.match(navigation, /addEventListener\(['"]wheel['"],\s*onWheel,\s*\{\s*passive:\s*false\s*\}\)/,
  'navigation should listen for wheel boundaries to advance sections');
assert.match(navigation, /function canAdvanceAtBoundary/, 'navigation should detect section boundaries before snapping');
assert.match(navigation, /scrollToSlide\(currentSlideIndex \+ 1\)/,
  'downward boundary scroll should advance to the next section');
assert.match(navigation, /scrollToSlide\(currentSlideIndex - 1\)/,
  'upward boundary scroll should return to the previous section');
assert.match(navigation, /touchstart/, 'touch navigation should track swipe start');
assert.match(navigation, /touchend/, 'touch navigation should support boundary swipes');
assert.match(navigation, /preventDefault\(\)/, 'boundary snap should be allowed to consume only the triggering gesture');
assert.match(navigation, /function bindSectionLinks/, 'in-page section links should use the snap navigation flow');
assert.match(navigation, /history\.replaceState/, 'in-page section links should not create a back-button jump to the top');
assert.match(navigation, /pagehide/, 'navigation should save position before leaving the page');
assert.match(navigation, /pageshow/, 'navigation should restore position when returning to the page');
assert.match(navigation, /sessionStorage/, 'navigation should persist the last scroll position for page returns');
assert.match(navigation, /SCROLL_POSITION_PENDING_KEY/, 'navigation should mark a saved position as restorable');
assert.match(navigation, /saveScrollPosition\(\);\s*\n\s*updateCurrentIndexFromViewport\(\);/,
  'navigation should save position during the throttled scroll update');
assert.match(navigation, /IntersectionObserver/, 'scroll spy should use viewport-aware section observation');
assert.match(videoCatalog, /data-video-sort/, 'video catalogue should support sorting controls');
assert.match(packages, /data-package-goal/, 'packages should support goal-based selection');
assert.match(packages, /is-goal-muted/, 'packages should visually de-emphasize non-matching goals');
assert.match(html, /js\/packages\.js/, 'packages module should be loaded by the page');

assert.match(videoCatalog, /sortCards\('newest'\)/, 'selected work should default to newest-first sorting');
assert.match(videoCatalog, /data-video-published/, 'selected work should sort by publication date');
for (const views of ['7705', '19200', '2951', '8763', '5883', '17200', '10800', '30600', '20500', '14200', '25200', '13400']) {
  assert.match(config, new RegExp(`viewsCount: ${views}`), `case config should include current views ${views}`);
}

assert.match(html, /assets\/images\/top-content-1\.jpg/, 'proof should use authentic top content thumbnail 1');
assert.match(html, /assets\/images\/top-content-2\.jpg/, 'proof should use authentic top content thumbnail 2');
assert.match(html, /assets\/images\/top-content-3\.jpg/, 'proof should use authentic top content thumbnail 3');
assert.match(html, /assets\/images\/top-content-4\.jpg/, 'proof should use authentic top content thumbnail 4');

const imgMatches = html.matchAll(/<img[^>]+src=["'](assets\/images\/[^"']+)["']/g);
for (const match of imgMatches) {
  const filePath = path.join(root, match[1].replace(/\//g, path.sep));
  assert.ok(fs.existsSync(filePath), `referenced image ${match[1]} must exist on disk`);
}

assert.doesNotMatch(config, /likes:\s*["']—/, 'all cases should have real extracted like counts');
assert.equal((config.match(/likes:\s*["'][0-9]+(?:\.[0-9]+)?[Kk]?\s+Лайків["']/g) || []).length, 12,
  'all 12 cases must have authentic formatted like counts');

const refreshCss = fs.readFileSync(path.join(root, 'css', 'refresh.css'), 'utf8');
assert.match(refreshCss, /\.v1-hero-img\s*\{[^}]*position:\s*absolute/s,
  'hero image should be absolutely positioned inside the phone frame');
assert.match(refreshCss, /\.hero-stats-bar-vertical\s*\{[^}]*position:\s*absolute/s,
  'hero stats bar must float directly on top of the photo');

console.log('site smoke tests passed');
