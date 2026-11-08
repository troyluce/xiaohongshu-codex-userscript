// ==UserScript==
// @name         小红书 · Codex 桌面外观
// @namespace    xhs-codex-local
// @homepageURL  https://github.com/troyluce/xiaohongshu-codex-userscript
// @supportURL   https://github.com/troyluce/xiaohongshu-codex-userscript/issues
// @downloadURL  https://raw.githubusercontent.com/troyluce/xiaohongshu-codex-userscript/main/xiaohongshu-codex.user.js
// @updateURL    https://raw.githubusercontent.com/troyluce/xiaohongshu-codex-userscript/main/xiaohongshu-codex.user.js
// @version      1.2.0
// @description  将小红书网页版换成 Codex 桌面风格，智能体流程与源码双栏、行号和语法高亮，Worked for 评论过程、悬停图片缩略图，支持深浅主题及 Alt+Q 遮挡。
// @author       Troy, with Codex; inspired by czm15053
// @license      MIT
// @match        https://www.xiaohongshu.com/*
// @match        https://xiaohongshu.com/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @noframes
// ==/UserScript==

/*
Reference: https://github.com/czm15053/linuxdo-idea-ui
Adapted palette and host selectors from linuxdo-codex.user.js and xhs/src.
The MIT License (MIT)

Copyright (c) 2026 czm15053

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(() => {
  'use strict';
  const KEY = 'xhs-codex-preferences-v1';
  const CSS = "/* Palette derived from czm15053/linuxdo-idea-ui, MIT. */\nhtml[data-xc-enabled=\"true\"] {\n  --xc-side: 244px; --xc-bg: #f7f7f8; --xc-panel: #fff; --xc-rail: #eff0f1;\n  --xc-text: #1b1c1e; --xc-muted: #626367; --xc-line: #dedfe1; --xc-hover: #e4e5e7;\n  --xc-focus: #1670d8; --xc-code: #1c7d28; --xc-selection: #c5e1ff;\n  color-scheme: light; background: var(--xc-bg) !important;\n}\nhtml[data-xc-enabled=\"true\"][data-xc-theme=\"dark\"] {\n  --xc-bg: #1e1f20; --xc-panel: #262728; --xc-rail: #242526;\n  --xc-text: #ececec; --xc-muted: #b9b9b9; --xc-line: #3b3c3e; --xc-hover: #343536;\n  --xc-focus: #83c3fe; --xc-code: #78cf70; --xc-selection: #34506b; color-scheme: dark;\n}\nhtml[data-xc-enabled=\"true\"][data-xc-collapsed=\"true\"] { --xc-side: 0px; }\nhtml[data-xc-enabled=\"true\"] body { margin: 0 !important; color: var(--xc-text) !important; background: var(--xc-bg) !important; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif; }\nhtml[data-xc-enabled=\"true\"] ::selection { background: var(--xc-selection); color: var(--xc-text); }\nhtml[data-xc-enabled=\"true\"] :focus-visible { outline: 2px solid var(--xc-focus) !important; outline-offset: 3px; }\nhtml[data-xc-enabled=\"true\"] * { scrollbar-color: var(--xc-muted) var(--xc-bg); scrollbar-width: thin; }\n#xc-shell, #xc-shell *, #xc-restore { box-sizing: border-box; }\n#xc-shell { color: var(--xc-text); font: 14px/1.5 -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif; }\n#xc-shell svg { width: 18px; height: 18px; flex: 0 0 18px; vertical-align: middle; }\n#xc-shell button, #xc-shell a { font: inherit; color: inherit; cursor: pointer; text-decoration: none; }\n#xc-shell button { border: 0; background: transparent; }\n#xc-shell button:hover, #xc-shell a:hover { background: var(--xc-hover); }\n#xc-shell button:disabled { cursor: default; opacity: .5; }\n#xc-shell button[hidden], #xc-shell [hidden] { display: none !important; }\n#xc-shell .xc-icon { display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; padding: 0; border-radius: 8px; }\n#xc-topbar { position: fixed; inset: 0 0 auto 0; height: 53px; z-index: 100005; display: flex; align-items: center; gap: 10px; padding: 0 18px; background: var(--xc-bg); border-bottom: 1px solid var(--xc-line); }\n#xc-topbar .xc-brand { display: flex; align-items: center; gap: 9px; width: 187px; font-weight: 600; }\n#xc-topbar .xc-brand svg { width: 24px; height: 24px; }\n#xc-topbar .xc-crumb { color: var(--xc-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n#xc-topbar .xc-spacer { flex: 1; }\n#xc-topbar .xc-tool { display: inline-flex; align-items: center; gap: 7px; padding: 6px 10px; border-radius: 8px; white-space: nowrap; }\n#xc-sidebar { position: fixed; left: 0; top: 53px; bottom: 0; z-index: 100004; width: 244px; padding: 24px 14px 14px; background: var(--xc-rail); border-right: 1px solid var(--xc-line); display: flex; flex-direction: column; gap: 4px; }\nhtml[data-xc-collapsed=\"true\"] #xc-sidebar { display: none; }\n#xc-sidebar .xc-nav { display: flex; width: 100%; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; text-align: left; }\n#xc-sidebar .xc-nav[aria-current=\"page\"] { background: var(--xc-hover); font-weight: 500; }\n#xc-sidebar .xc-section { color: var(--xc-muted); font-size: 12px; margin: 26px 12px 7px; }\n#xc-sidebar .xc-project { font-weight: 500; }\n#xc-sidebar .xc-note { margin: 4px 0 4px 20px; padding-left: 12px; border-left: 1px solid var(--xc-line); }\n#xc-sidebar .xc-note a { display: block; padding: 8px 10px; border-radius: 6px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: var(--xc-muted); font-size: 12px; }\n#xc-recent-empty { display: block; padding: 8px 10px; color: var(--xc-muted); font-size: 12px; }\n#xc-sidebar .xc-bottom { margin-top: auto; padding-top: 24px; }\n#xc-sidebar kbd { margin-left: auto; font: 11px ui-monospace, Consolas, monospace; color: var(--xc-muted); }\n#xc-help { margin: 10px 12px 0; font-size: 11px; color: var(--xc-muted); }\n#xc-status { position: fixed; bottom: 0; right: 0; left: var(--xc-side); height: 27px; display: flex; align-items: center; justify-content: space-between; padding: 0 22px; z-index: 100003; border-top: 1px solid var(--xc-line); background: var(--xc-bg); font-size: 11px; color: var(--xc-muted); }\n#xc-status span { display: inline-flex; align-items: center; gap: 7px; }\n#xc-status svg { width: 13px; height: 13px; flex-basis: 13px; }\n#xc-restore { position: fixed; left: 16px; bottom: 16px; z-index: 2147483647; color: #fff; background: #262728; border: 1px solid #777; border-radius: 9px; padding: 9px 14px; cursor: pointer; font: 13px/1.5 sans-serif; }\nhtml[data-xc-enabled=\"true\"] #xc-restore { display: none; }\nhtml:not([data-xc-enabled=\"true\"]) #xc-shell { display: none; }\n/* Keep the original Vue nodes and event handlers in place. */\nhtml[data-xc-enabled=\"true\"] #global { width: 100% !important; max-width: none !important; min-width: 0 !important; margin: 0 !important; padding: 0 !important; background: var(--xc-bg) !important; }\nhtml[data-xc-enabled=\"true\"] #global > .main-container { display: block !important; width: 100% !important; padding: 0 !important; }\nhtml[data-xc-enabled=\"true\"] #global .side-bar, html[data-xc-enabled=\"true\"] #global .main-content > .footer, html[data-xc-enabled=\"true\"] .floating-btn-container, html[data-xc-enabled=\"true\"] .floating-btn-sets, html[data-xc-enabled=\"true\"] .back-top { display: none !important; }\nhtml[data-xc-enabled=\"true\"] #global .main-content { display: block !important; position: relative !important; width: auto !important; min-width: 0 !important; max-width: none !important; height: auto !important; overflow: visible !important; margin: 0 0 0 var(--xc-side) !important; padding: 0 38px !important; background: var(--xc-bg) !important; }\nhtml[data-xc-enabled=\"true\"] #global .feeds-page, html[data-xc-enabled=\"true\"] #global .search-page { width: 100% !important; max-width: 860px !important; min-width: 0 !important; margin: 0 auto !important; padding: 58px 0 30px !important; }\n.xc-intro { text-align: center; padding-top: 34px; margin-bottom: 130px; color: var(--xc-text); }\n.xc-intro h1 { font-size: 28px; line-height: 1.3; letter-spacing: -.025em; font-weight: 600; margin: 0; }\n.xc-intro p { font-size: 13px; color: var(--xc-muted); margin: 9px 0 0; }\nhtml[data-xc-enabled=\"true\"] #global .header-container { position: static !important; width: auto !important; height: 0 !important; min-height: 0 !important; background: transparent !important; border: 0 !important; box-shadow: none !important; }\nhtml[data-xc-enabled=\"true\"] #global .header-container > header { position: absolute !important; top: calc(166px - var(--xc-feed-scroll, 0px)) !important; left: calc(var(--xc-side) + (100% - var(--xc-side)) / 2) !important; transform: translateX(-50%) !important; display: block !important; width: min(700px, calc(100% - var(--xc-side) - 76px)) !important; min-width: 0 !important; height: 62px !important; padding: 0 !important; margin: 0 !important; border: 0 !important; box-shadow: none !important; background: transparent !important; z-index: 10 !important; }\nhtml[data-xc-enabled=\"true\"] #global .header-container > header > :not(.input-box) { display: none !important; }\nhtml[data-xc-enabled=\"true\"] #global header .input-box { box-sizing: border-box !important; display: flex !important; align-items: center; width: 100% !important; height: 62px !important; padding: 0 16px !important; border: 1px solid var(--xc-line) !important; border-radius: 14px !important; background: var(--xc-panel) !important; }\nhtml[data-xc-enabled=\"true\"] #global header .search-input { width: 100% !important; min-width: 0 !important; height: 100% !important; padding: 0 !important; color: var(--xc-text) !important; caret-color: var(--xc-text); font: inherit !important; font-size: 14px !important; background: transparent !important; }\nhtml[data-xc-enabled=\"true\"] #global header .search-input::placeholder { color: var(--xc-muted) !important; opacity: 1; }\nhtml[data-xc-enabled=\"true\"] #global header .search-icon { filter: grayscale(1); }\nhtml[data-xc-enabled=\"true\"][data-xc-theme=\"dark\"] #global header .search-icon { filter: grayscale(1) invert(1); }\nhtml[data-xc-enabled=\"true\"] #global .channel-container { position: sticky !important; top: 53px !important; z-index: 9 !important; width: 100% !important; margin: 0 !important; padding: 10px 0 !important; background: var(--xc-bg) !important; border-bottom: 1px solid var(--xc-line); }\nhtml[data-xc-enabled=\"true\"] #global #channel-container { width: 100% !important; height: 37px !important; padding: 0 !important; background: transparent !important; }\nhtml[data-xc-enabled=\"true\"] #global .channel { padding: 7px 12px !important; height: auto !important; margin: 0 3px 0 0 !important; border-radius: 7px !important; font-size: 12px !important; color: var(--xc-muted) !important; background: transparent !important; }\nhtml[data-xc-enabled=\"true\"] #global .channel.active { color: var(--xc-text) !important; background: var(--xc-hover) !important; font-weight: 500; }\nhtml[data-xc-enabled=\"true\"] #global .feeds-container { display: block !important; position: relative !important; width: 100% !important; height: auto !important; min-height: 140px; padding: 0 !important; margin: 0 !important; }\nhtml[data-xc-enabled=\"true\"] #global .feeds-container .note-item { display: block !important; position: relative !important; inset: auto !important; width: 100% !important; height: auto !important; transform: none !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; border-radius: 0 !important; border-bottom: 1px solid var(--xc-line); background: transparent !important; }\nhtml[data-xc-enabled=\"true\"] #global .note-item:hover { background: var(--xc-panel) !important; }\nhtml[data-xc-enabled=\"true\"] #global .note-item::before { content: ''; position: absolute; top: 23px; left: 9px; width: 11px; height: 11px; border: 1.5px solid var(--xc-muted); border-radius: 50%; pointer-events: none; }\nhtml[data-xc-enabled=\"true\"] #global .note-item .cover { display: none !important; }\nhtml[data-xc-enabled=\"true\"] #global .note-item .footer { padding: 16px 16px 14px 38px !important; margin: 0 !important; }\nhtml[data-xc-enabled=\"true\"] #global .note-item .title { display: block !important; margin: 0 0 7px !important; font-size: 14px !important; font-weight: 500 !important; line-height: 1.6 !important; color: var(--xc-text) !important; overflow: visible !important; overflow-wrap: anywhere; -webkit-line-clamp: unset !important; }\nhtml[data-xc-enabled=\"true\"] #global .note-item :is(.author-wrapper,.card-bottom-wrapper) { display: flex !important; width: 100% !important; margin: 0 !important; gap: 14px; font-size: 11px !important; line-height: 1.5 !important; color: var(--xc-muted) !important; }\nhtml[data-xc-enabled=\"true\"] #global .note-item .author { display: inline-flex !important; max-width: 75%; color: var(--xc-muted) !important; }\nhtml[data-xc-enabled=\"true\"] #global .note-item .author .name { font-size: 11px !important; color: var(--xc-muted) !important; }\nhtml[data-xc-enabled=\"true\"] #global .note-item .avatar-container, html[data-xc-enabled=\"true\"] #global .note-item .author-avatar { display: none !important; }\nhtml[data-xc-enabled=\"true\"] #global .note-item .like-wrapper { margin-left: auto; color: var(--xc-muted) !important; }\nhtml[data-xc-enabled=\"true\"] #global .note-item .like-wrapper svg { width: 12px; height: 12px; color: var(--xc-muted) !important; }\n/* Native detail keeps its comments, editor, follow, like and collect handlers. */\nhtml[data-xc-enabled=\"true\"] .note-detail-mask { position: fixed !important; inset: 53px 0 27px var(--xc-side) !important; width: auto !important; height: auto !important; background: var(--xc-bg) !important; display: flex !important; justify-content: center; z-index: 100000 !important; transition: none !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer { position: relative !important; display: flex !important; flex-direction: row !important; top: 0 !important; left: 0 !important; width: min(100%, 1100px) !important; height: 100% !important; max-height: none !important; min-width: 0 !important; transform: none !important; border-radius: 0 !important; box-shadow: none !important; background: var(--xc-bg) !important; color: var(--xc-text) !important; overflow: hidden !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer > .author { display: none !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .interaction-container { flex: 1 !important; width: 100% !important; min-width: 0 !important; max-width: 820px !important; margin: 0 auto !important; height: 100% !important; border: 0 !important; color: var(--xc-text) !important; background: var(--xc-bg) !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .note-scroller { padding: 12px 36px 26px !important; background: var(--xc-bg) !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .author-container { display: flex !important; padding: 20px 36px !important; height: auto !important; border-bottom: 1px solid var(--xc-line) !important; background: var(--xc-bg) !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer :is(.author-container,.comments-container) :is(.avatar,.avatar-container) { visibility: hidden; width: 12px !important; height: 12px !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer #detail-title { color: var(--xc-text) !important; font-size: 22px !important; line-height: 1.5 !important; margin-bottom: 20px !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer :is(.desc,.content,.name,.username) { color: var(--xc-text) !important; overflow-wrap: anywhere; }\nhtml[data-xc-enabled=\"true\"] #noteContainer :is(.date,.total,.bottom-container,.like-wrapper,.count,.note-text) { color: var(--xc-muted) !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .interactions.engage-bar { background: var(--xc-bg) !important; border-top: 1px solid var(--xc-line) !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .content-edit { background: var(--xc-panel) !important; color: var(--xc-text) !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer :is(.follow-button,.submit) { background: var(--xc-text) !important; border-color: var(--xc-text) !important; color: var(--xc-bg) !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer > .media-container { display: none !important; }\nhtml[data-xc-enabled=\"true\"][data-xc-media=\"show\"] #noteContainer > .media-container { display: block !important; flex: 0 0 48%; width: 48% !important; min-width: 0 !important; height: 100% !important; background: var(--xc-panel) !important; }\n\nhtml[data-xc-enabled=\"true\"] .note-detail-mask :is(.close-circle,.close-box) { display: none !important; }\nhtml[data-xc-enabled=\"true\"] .note-detail-mask :is(.divider,.interaction-divider) { background: var(--xc-line) !important; }\nhtml[data-xc-enabled=\"true\"] #global .user-page { width: 100% !important; max-width: 860px !important; min-width: 0 !important; margin: 0 auto !important; padding-top: 250px !important; color: var(--xc-text); }\nhtml[data-xc-enabled=\"true\"] #global .user-page :is(img,.user-image,.user-avatar) { visibility: hidden; }\n/* Login and verification remain above the camouflage UI. */\nhtml[data-xc-enabled=\"true\"] :is(.login-modal,.reds-modal-open,.captcha-mask,.captcha-container) { z-index: 100100 !important; }\n#xc-panic { display: none; position: fixed; inset: 53px 0 27px var(--xc-side); z-index: 100002; background: var(--xc-bg); align-items: center; justify-content: center; flex-direction: column; }\n#xc-panic h1 { font-size: 28px; font-weight: 500; letter-spacing: -.025em; margin: 18px 0 8px; }\n#xc-panic p { color: var(--xc-muted); font-size: 13px; margin: 0; }\n#xc-panic pre { margin-top: 36px; padding: 22px 30px; color: var(--xc-muted); background: var(--xc-panel); border-radius: 12px; font: 13px/1.8 ui-monospace, Consolas, monospace; max-width: calc(100% - 32px); overflow: auto; }\nhtml[data-xc-panic=\"true\"] body > :not(#xc-shell) { visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; }\nhtml[data-xc-panic=\"true\"] #xc-panic { display: flex; }\nhtml[data-xc-panic=\"true\"] :is(#xc-recent,#xc-back,#xc-media,#xc-count) { visibility: hidden; }\nhtml[data-xc-panic=\"true\"] #xc-sidebar .xc-project { font-size: 0; }\nhtml[data-xc-panic=\"true\"] #xc-sidebar .xc-project::after { content: 'workspace'; font-size: 14px; }\n@media (max-width: 900px) {\n  html[data-xc-enabled=\"true\"] { --xc-side: 0px; }\n  #xc-topbar .xc-brand { width: auto; }\n  #xc-sidebar { width: 244px; box-shadow: 12px 4px 32px rgba(0,0,0,.15); }\n  html[data-xc-collapsed=\"false\"] #xc-sidebar { display: flex; }\n  html[data-xc-enabled=\"true\"] #global .main-content { padding-right: 22px !important; padding-left: 22px !important; }\n  html[data-xc-enabled=\"true\"] #global .header-container { position: static !important; width: auto !important; height: 0 !important; min-height: 0 !important; background: transparent !important; border: 0 !important; box-shadow: none !important; }\nhtml[data-xc-enabled=\"true\"] #global .header-container > header { width: calc(100% - 44px) !important; }\n}\n@media (max-width: 540px) {\n  #xc-topbar { gap: 6px; padding: 0 10px; }\n  #xc-topbar .xc-crumb, #xc-topbar .xc-tool span { display: none; }\n  #xc-topbar .xc-tool { padding: 7px; }\n  #xc-status { padding: 0 12px; }\n  #xc-status span:last-child { display: none; }\n  .xc-intro h1 { font-size: 24px; }\n  html[data-xc-enabled=\"true\"] #global .main-content { padding-right: 14px !important; padding-left: 14px !important; }\n  html[data-xc-enabled=\"true\"] #global .header-container { position: static !important; width: auto !important; height: 0 !important; min-height: 0 !important; background: transparent !important; border: 0 !important; box-shadow: none !important; }\nhtml[data-xc-enabled=\"true\"] #global .header-container > header { width: calc(100% - 28px) !important; }\n  html[data-xc-enabled=\"true\"] #noteContainer { flex-direction: column !important; overflow: auto !important; }\n  html[data-xc-enabled=\"true\"][data-xc-media=\"show\"] #noteContainer > .media-container { flex: 0 0 42vh; width: 100% !important; height: 42vh !important; }\n  html[data-xc-enabled=\"true\"] #noteContainer .interaction-container { flex: 1 0 75vh !important; }\n  html[data-xc-enabled=\"true\"] #noteContainer .note-scroller { padding: 12px 18px 24px !important; }\n  html[data-xc-enabled=\"true\"] #noteContainer .author-container { display: flex !important; padding: 16px 18px !important; }\n}\n@media (prefers-reduced-motion: reduce) { #xc-shell *, .xc-intro { animation: none !important; transition: none !important; } }\n\nhtml[data-xc-enabled=\"true\"] #global .feeds-container .note-item[hidden] { display: none !important; }\n\n/* Preserve the native feed scrolling target used by lazy loading. */\nhtml[data-xc-enabled=\"true\"] #global :is(.feeds-page,.search-page) { box-sizing: border-box !important; height: calc(100vh - 27px) !important; overflow-y: auto !important; overflow-x: hidden !important; padding-bottom: 54px !important; }\n\nhtml[data-xc-enabled=\"true\"] #channel-container { scrollbar-width: none !important; }\nhtml[data-xc-enabled=\"true\"] #channel-container::-webkit-scrollbar { display: none; }\n\nhtml[data-xc-enabled=\"true\"] #global .note-item .name-time-wrapper { display: flex; align-items: center; gap: 10px; }\nhtml[data-xc-enabled=\"true\"] #global .note-item .time { font-size: 11px !important; color: var(--xc-muted) !important; }\nhtml[data-xc-enabled=\"true\"] #global :is(.tag-search-page-sticky,.tag-search-page-sticky .reds-sticky,.tab-scroll-container) { background: var(--xc-bg) !important; }\nhtml[data-xc-enabled=\"true\"] #global .tab-scroll-container { scrollbar-width: none !important; padding: 8px 0 12px; }\nhtml[data-xc-enabled=\"true\"] #global .tab-scroll-container::-webkit-scrollbar { display: none; }\nhtml[data-xc-enabled=\"true\"] #global .tab-scroll-container .tab { color: var(--xc-muted) !important; background: transparent !important; font-size: 12px !important; border-radius: 7px !important; height: 32px !important; padding: 4px 12px !important; }\nhtml[data-xc-enabled=\"true\"] #global .tab-scroll-container .tab.active { color: var(--xc-text) !important; background: var(--xc-hover) !important; }\n\nhtml[data-xc-enabled=\"true\"] #global .search-layout__top .filter,\nhtml[data-xc-enabled=\"true\"] #global .search-layout__top .filter span,\nhtml[data-xc-enabled=\"true\"] #global header .close-icon { color: var(--xc-text) !important; }\nhtml[data-xc-enabled=\"true\"] #global .search-layout__top .filter svg,\nhtml[data-xc-enabled=\"true\"] #global header .close-icon svg { color: var(--xc-text) !important; fill: currentColor !important; }\nhtml[data-xc-enabled=\"true\"][data-xc-media=\"hide\"] #pagination-teleport-container { display: none !important; }\n\n/* Codex split workspace: conversation on the left, real project source on the right. */\nhtml[data-xc-enabled=\"true\"] {\n  --xc-side: 276px;\n  --xc-editor-size: clamp(360px, 38vw, 760px);\n  --xc-editor-width: var(--xc-editor-size);\n  --xc-tab: #ebebed;\n  --xc-code-text: #33363b;\n  --xc-code-comment: #70756f;\n  --xc-code-keyword: #a94c0a;\n  --xc-code-string: #267235;\n  --xc-code-number: #734fb0;\n  --xc-code-property: #246ba1;\n  --xc-gutter: #787c80;\n  --xc-rail-strip: #e4e5e7;\n  --xc-mono: ui-monospace, \"SFMono-Regular\", Consolas, \"Liberation Mono\", monospace;\n}\nhtml[data-xc-enabled=\"true\"][data-xc-theme=\"dark\"] {\n  --xc-tab: #171819;\n  --xc-code-text: #cfcfcf;\n  --xc-code-comment: #96a18f;\n  --xc-code-keyword: #f0954e;\n  --xc-code-string: #90ce83;\n  --xc-code-number: #bb8fe4;\n  --xc-code-property: #83c3fe;\n  --xc-gutter: #929599;\n  --xc-rail-strip: #1a1b1c;\n}\nhtml[data-xc-editor=\"false\"] { --xc-editor-width: 0px; }\nhtml[data-xc-collapsed=\"true\"] { --xc-side: 40px; }\n#xc-topbar { left: 40px; right: var(--xc-editor-width); padding: 0 12px; height: 45px; font-size: 12px; }\n#xc-topbar .xc-brand { width: 184px; }\n#xc-topbar .xc-tool { padding: 6px; gap: 5px; }\n#xc-topbar .xc-brand svg { width: 18px; height: 18px; }\n#xc-sidebar { top: 45px; left: 40px; width: 236px; padding-top: 14px; font-size: 12px; }\n#xc-sidebar .xc-nav { padding: 8px 10px; }\n#xc-sidebar .xc-note a { font-size: 11px; }\n#xc-sidebar .xc-section { margin-top: 20px; }\n#xc-activity-rail { position: fixed; inset: 0 auto 0 0; width: 40px; padding: 8px 3px; background: var(--xc-rail-strip); display: flex; align-items: center; flex-direction: column; gap: 10px; z-index: 100008; border-right: 1px solid var(--xc-line); }\n#xc-activity-rail .xc-icon { width: 32px; height: 32px; border-radius: 7px; }\n#xc-editor { position: fixed; inset: 0 0 27px auto; width: var(--xc-editor-width); display: flex; flex-direction: column; min-width: 0; border-left: 1px solid var(--xc-line); background: var(--xc-bg); z-index: 100006; }\nhtml[data-xc-editor=\"false\"] #xc-editor { display: none; }\n#xc-file-tabs { display: flex; flex-shrink: 0; height: 45px; align-items: end; gap: 2px; padding: 0 8px; background: var(--xc-tab); border-bottom: 1px solid var(--xc-line); overflow: hidden; }\n#xc-file-tabs > button[role=\"tab\"] { min-width: 0; flex-shrink: 1; padding: 8px 10px; height: 36px; color: var(--xc-muted); font: 11px/1.5 var(--xc-mono); border-radius: 7px 7px 0 0; white-space: nowrap; }\n#xc-file-tabs > button[aria-selected=\"true\"] { color: var(--xc-text); background: var(--xc-bg); }\n#xc-file-tabs > #xc-editor-close { margin: 0 0 4px auto; flex-shrink: 0; }\n#xc-code-crumb { display: flex; align-items: center; gap: 6px; min-height: 37px; padding: 0 10px 0 15px; border-bottom: 1px solid var(--xc-line); color: var(--xc-muted); font-size: 11px; }\n#xc-code-crumb > span:first-child { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n#xc-code-crumb b { font-weight: 400; color: var(--xc-text); }\n#xc-code-crumb .xc-spacer { flex: 1; }\n#xc-code-wrap { padding: 4px 7px; font-size: 10px !important; border-radius: 5px; white-space: nowrap; }\n#xc-code-wrap[aria-pressed=\"true\"] { background: var(--xc-hover); color: var(--xc-text); }\n#xc-code-crumb .xc-icon { width: 26px; height: 26px; }\n#xc-code-crumb svg { width: 14px; height: 14px; }\n#xc-code-body { flex: 1; min-height: 0; overflow: auto; padding: 12px 0 30px; color: var(--xc-code-text); background: var(--xc-bg); font: 11.5px/1.85 var(--xc-mono); tab-size: 2; }\n.xc-source-line { display: flex; min-width: max-content; }\n.xc-source-line:hover { background: var(--xc-hover); }\n.xc-line-number { display: block; flex: 0 0 46px; width: 46px; text-align: right; padding-right: 14px; color: var(--xc-gutter); font-variant-numeric: tabular-nums; user-select: none; }\n.xc-line-code { display: block; flex: 1; padding-right: 24px; min-height: 1.85em; white-space: pre; }\n.xc-code-wrapped .xc-source-line { min-width: 0; }\n.xc-code-wrapped .xc-line-code { white-space: pre-wrap; overflow-wrap: anywhere; min-width: 0; }\n.xc-token-keyword { color: var(--xc-code-keyword); }\n.xc-token-string { color: var(--xc-code-string); }\n.xc-token-comment { color: var(--xc-code-comment); }\n.xc-token-number { color: var(--xc-code-number); }\n.xc-token-property { color: var(--xc-code-property); }\n#xc-code-footer { display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; height: 26px; padding: 0 14px; border-top: 1px solid var(--xc-line); color: var(--xc-muted); font: 10px/1.5 var(--xc-mono); }\nhtml[data-xc-enabled=\"true\"] #global .main-content { margin-right: var(--xc-editor-width) !important; padding: 0 24px !important; }\nhtml[data-xc-enabled=\"true\"] #global :is(.feeds-page,.search-page) { padding-top: 72px !important; padding-bottom: 160px !important; }\nhtml[data-xc-enabled=\"true\"] #global .channel-container { top: 45px !important; }\nhtml[data-xc-enabled=\"true\"] #global .channel { padding: 5px 9px !important; font-size: 11px !important; }\n.xc-agent-flow { text-align: left; padding: 0; margin: 0 0 30px; color: var(--xc-text); }\n.xc-agent-heading { display: flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 400; color: var(--xc-muted); margin-bottom: 12px; }\n.xc-agent-heading svg { width: 14px; height: 14px; fill: none; stroke: var(--xc-focus); stroke-width: 1.5; }\n.xc-agent-flow p, .xc-agent-step p { margin: 0 0 12px; color: var(--xc-muted); font: 12px/1.7 -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif; }\n.xc-flow-code { box-sizing: border-box; max-width: 100%; overflow: auto; background: var(--xc-panel); color: var(--xc-code-text); border-radius: 9px; margin: 0 0 12px; padding: 12px 14px; font: 11px/1.85 var(--xc-mono); tab-size: 2; }\n.xc-flow-code code { font: inherit; color: inherit; background: transparent; padding: 0; white-space: pre; }\n.xc-flow-code-small { border-radius: 0; padding: 2px 0; background: transparent; margin-bottom: 10px; }\n.xc-flow-summary { color: var(--xc-muted); font-size: 10px; line-height: 1.6; }\nhtml[data-xc-enabled=\"true\"] #global .feeds-container .note-item { border-bottom: 0; margin-bottom: 30px !important; }\nhtml[data-xc-enabled=\"true\"] #global .note-item:hover { background: transparent !important; }\nhtml[data-xc-enabled=\"true\"] #global .note-item::before { display: none; }\nhtml[data-xc-enabled=\"true\"] #global .note-item .footer { padding: 0 !important; }\nhtml[data-xc-enabled=\"true\"] #global .note-item .title { font-size: 13px !important; font-weight: 400 !important; margin-bottom: 8px !important; }\nhtml[data-xc-enabled=\"true\"] #global .header-container > header { position: fixed !important; top: auto !important; bottom: 46px !important; left: calc(var(--xc-side) + (100% - var(--xc-side) - var(--xc-editor-width)) / 2) !important; width: min(500px, calc(100% - var(--xc-side) - var(--xc-editor-width) - 48px)) !important; height: 80px !important; z-index: 100002 !important; }\nhtml[data-xc-enabled=\"true\"] #global header .input-box { height: 80px !important; padding: 0 16px 18px !important; border-radius: 14px !important; background: var(--xc-panel) !important; box-shadow: 0 10px 28px rgba(0,0,0,.08); }\nhtml[data-xc-enabled=\"true\"] #global header .input-box::after { content: 'Local workspace  ·  Enter 搜索'; position: absolute; left: 16px; bottom: 10px; color: var(--xc-muted); font: 10px/1.4 var(--xc-mono); pointer-events: none; }\nhtml[data-xc-enabled=\"true\"] #global header .search-input { font-size: 12px !important; }\nhtml[data-xc-enabled=\"true\"] .note-detail-mask { top: 45px !important; right: var(--xc-editor-width) !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .author-container { padding: 15px 24px !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .note-scroller { padding: 20px 24px 110px !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer #detail-title { font-size: 17px !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .note-content { font-size: 13px !important; line-height: 1.85 !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .interactions.engage-bar { position: relative; z-index: 100003; }\n#xc-panic { top: 45px; right: var(--xc-editor-width); }\n@media (max-width: 1300px) { #xc-topbar .xc-brand { width: auto; } #xc-topbar .xc-crumb { display: none; } }\n@media (max-width: 1200px) { #xc-topbar .xc-tool span { display: none; } }\n@media (max-width: 1100px) {\n  html[data-xc-enabled=\"true\"], html[data-xc-collapsed=\"true\"] { --xc-side: 0px; }\n  #xc-activity-rail { display: none; }\n  #xc-sidebar { left: 0; width: 244px; }\n  #xc-topbar { left: 0; }\n  html[data-xc-collapsed=\"false\"] #xc-sidebar { display: flex; }\n}\n@media (max-width: 1000px) {\n  html[data-xc-enabled=\"true\"] { --xc-editor-width: 0px; }\n  #xc-editor { display: none; }\n  html[data-xc-editor-overlay=\"true\"] #xc-editor { display: flex; top: 45px; width: 100%; }\n  #xc-topbar { right: 0; }\n}\n@media (max-width: 540px) {\n  html[data-xc-enabled=\"true\"] #global .main-content { padding: 0 18px !important; }\n  html[data-xc-enabled=\"true\"] #global .header-container > header { width: calc(100% - 36px) !important; bottom: 42px !important; }\n  #xc-code-crumb { font-size: 10px; }\n  #xc-code-body { font-size: 11px; }\n  html[data-xc-enabled=\"true\"] #noteContainer .note-scroller { padding: 18px 18px 115px !important; }\n}\n\nhtml[data-xc-enabled=\"true\"][data-xc-collapsed=\"true\"] { --xc-side: 40px; }\n@media (max-width: 1100px) { html[data-xc-enabled=\"true\"][data-xc-collapsed=\"true\"] { --xc-side: 0px; } }\n\n/* The detail page uses its own native comment composer. */\nhtml[data-xc-enabled=\"true\"][data-xc-detail=\"true\"] #global .header-container > header { display: none !important; }\n@media (min-width: 541px) and (max-width: 1500px) {\n  html[data-xc-enabled=\"true\"][data-xc-editor=\"true\"][data-xc-media=\"show\"] #noteContainer { flex-direction: column !important; }\n  html[data-xc-enabled=\"true\"][data-xc-editor=\"true\"][data-xc-media=\"show\"] #noteContainer > .media-container { flex: 0 0 32%; width: 100% !important; height: 32% !important; }\n  html[data-xc-enabled=\"true\"][data-xc-editor=\"true\"][data-xc-media=\"show\"] #noteContainer .interaction-container { flex: 1 1 0 !important; height: 0 !important; min-height: 0 !important; }\n}\n\n/* Constrain the native reader so the comment bar stays in the visible column. */\nhtml[data-xc-enabled=\"true\"] #noteContainer .interaction-container { display: flex !important; flex-direction: column !important; min-height: 0 !important; overflow: hidden !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .author-container { position: relative !important; flex: 0 0 auto !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .note-scroller { flex: 1 1 0 !important; min-height: 0 !important; overflow-y: auto !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .interactions.engage-bar { flex: 0 0 auto !important; min-height: 72px !important; box-sizing: border-box !important; }\n/* Native mobile navigation yields to the workspace controls while enabled. */\nhtml[data-xc-enabled=\"true\"] #app .bottom-menu { display: none !important; }\n\n/* Comment reasoning uses the thread's prose rhythm while preserving native replies. */\nhtml[data-xc-enabled=\"true\"] #noteContainer .comment-item .right { min-width: 0; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .comment-item .author-wrapper { margin-bottom: 12px; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .comment-item .content { color: var(--xc-text) !important; font-size: 13px !important; line-height: 1.85 !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .comment-item .info { margin-top: 12px; color: var(--xc-muted) !important; }\n.xc-comment-workflow { margin: 8px 0 14px; color: var(--xc-muted); font: 12px/1.8 -apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif; }\n.xc-comment-workflow summary { display: flex; align-items: center; gap: 8px; width: fit-content; list-style: none; cursor: pointer; color: var(--xc-muted); }\n.xc-comment-workflow summary::-webkit-details-marker { display: none; }\n.xc-comment-workflow summary > svg { width: 14px; height: 14px; fill: none; stroke: var(--xc-focus); stroke-width: 1.8; }\n.xc-work-chevron { display: inline-flex; }\n.xc-work-chevron svg { width: 10px; height: 10px; fill: none; stroke: currentColor; stroke-width: 1.6; }\n.xc-comment-workflow:not([open]) .xc-work-chevron { transform: rotate(-90deg); }\n.xc-comment-process { border-left: 1px solid var(--xc-line); padding-left: 14px; margin-top: 10px; }\n.xc-comment-process p { margin: 0 0 18px; color: var(--xc-muted); }\n.xc-comment-process p:last-child { margin-bottom: 0; }\n/* Compact file-like image attachments; the original full-media view remains available. */\n.xc-media-thumbnails { display: flex; gap: 8px; overflow-x: auto; margin: 12px 0; padding-bottom: 4px; max-width: 100%; }\n.xc-thumbnail { flex: 0 0 168px; width: 168px; padding: 0; overflow: hidden; border: 1px solid var(--xc-line); border-radius: 8px; background: var(--xc-panel); color: var(--xc-muted); cursor: zoom-in; text-align: left; font: 10px/1.6 var(--xc-mono); }\n.xc-thumbnail img { display: block !important; visibility: visible !important; width: 100% !important; height: 84px !important; object-fit: contain !important; background: var(--xc-tab); }\n.xc-thumbnail-caption { display: block; padding: 3px 7px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.xc-thumbnail:hover { border-color: var(--xc-focus); }\n.xc-thumbnail-error { border-style: dashed; }\n.xc-feed-thumbnails .xc-thumbnail { flex-basis: 108px; width: 108px; }\n.xc-feed-thumbnails .xc-thumbnail img { height: 55px !important; }\n.xc-inline-thumbnails { display: inline-flex; vertical-align: top; }\n.xc-inline-thumbnails .xc-thumbnail { flex-basis: 148px; width: 148px; }\nhtml[data-xc-enabled=\"true\"][data-xc-media=\"hide\"] #noteContainer img[data-xc-thumb-source] { display: none !important; }\nhtml[data-xc-enabled=\"true\"][data-xc-media=\"hide\"] #noteContainer :is(.note-content,.comment-item) video { display: none !important; }\nhtml[data-xc-enabled=\"true\"][data-xc-media=\"show\"] #noteContainer .xc-media-thumbnails { display: none !important; }\n#xc-image-preview { position: fixed; z-index: 100200; box-sizing: border-box; padding: 0; overflow: hidden; border-radius: 9px; background: var(--xc-panel); box-shadow: 0 12px 38px rgba(0,0,0,.3); }\n#xc-image-preview[hidden] { display: none !important; }\n#xc-image-preview > img { display: block; width: 100%; height: auto; object-fit: contain; background: var(--xc-tab); }\n#xc-shell #xc-image-preview .xc-preview-close { position: absolute; right: 6px; top: 6px; width: 32px; height: 32px; padding: 7px; color: var(--xc-text); border-radius: 8px; background: var(--xc-panel); cursor: pointer; }\n#xc-image-preview .xc-preview-caption { padding: 6px 12px; min-height: 30px; color: var(--xc-muted); background: var(--xc-panel); font: 11px/1.6 var(--xc-mono); }\n@media (max-width: 540px) {\n  .xc-post-thumbnails .xc-thumbnail { flex-basis: 148px; width: 148px; }\n  .xc-comment-process { padding-left: 12px; }\n  .xc-comment-workflow { font-size: 12px; }\n}\n\nhtml[data-xc-enabled=\"true\"] #noteContainer .comment-item .content .note-text { color: var(--xc-text) !important; }\n\nhtml[data-xc-enabled=\"true\"][data-xc-media=\"hide\"] #noteContainer .img-box:has(> img[data-xc-thumb-source]) { width: auto !important; height: auto !important; overflow: visible !important; background: transparent !important; }\n\n@media (max-width: 540px) { #xc-shell #xc-image-preview .xc-preview-close { width: 44px; height: 44px; padding: 13px; } }\n\nhtml[data-xc-enabled=\"true\"][data-xc-media=\"hide\"] #noteContainer .img-box:has(> img[data-xc-thumb-source])::after { display: none !important; }\nhtml[data-xc-enabled=\"true\"][data-xc-media=\"hide\"] #noteContainer .comment-image-gallery:has(img[data-xc-thumb-source]) { display: flex !important; flex-wrap: wrap; gap: 8px !important; width: auto !important; max-width: 100% !important; height: auto !important; overflow: visible !important; }\nhtml[data-xc-enabled=\"true\"][data-xc-media=\"hide\"] #noteContainer .img-box:has(> img[data-xc-thumb-source]) { position: relative !important; inset: auto !important; margin: 0 !important; flex: 0 0 auto; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .xc-inline-thumbnails { position: relative; z-index: 1; }\n";
  const workflow = (function createWorkspaceWorkflow() {
  'use strict';

  const selectors = Object.freeze({
    tasks: '#global .feeds-container .note-item',
    title: 'a.title',
    author: '.author .name',
    detail: '#noteContainer',
    description: '#detail-desc',
  });

  const states = Object.freeze({
    ready: 'ready',
    inspecting: 'inspecting',
    reading: 'reading',
    waiting: 'waiting',
  });

  function normalizeText(value, limit = 240) {
    return String(value || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, limit);
  }

  function collectTaskCards(root = document) {
    return [...root.querySelectorAll(selectors.tasks)]
      .filter(card => !card.hidden);
  }

  function readTask(card, index = 0) {
    const title = card.querySelector(selectors.title);
    return {
      id: card.getAttribute('data-note-id') || `task-${index}`,
      index,
      title: normalizeText(title?.textContent),
      author: normalizeText(card.querySelector(selectors.author)?.textContent),
      href: title?.getAttribute('href') || '',
      node: card,
    };
  }

  function inspectWorkspace(root = document) {
    const cards = collectTaskCards(root);
    const detail = root.querySelector(selectors.detail);
    return {
      state: detail ? states.reading : states.ready,
      taskCount: cards.length,
      activeTitle: normalizeText(detail?.querySelector('#detail-title')?.textContent),
      tasks: cards.map(readTask),
      mediaPolicy: 'thumbnail-until-requested',
    };
  }

  function createPlan(context) {
    return [
      { id: 'context', label: 'Read workspace context', status: states.ready },
      { id: 'inspect', label: 'Inspect incoming tasks', status: states.inspecting },
      { id: 'open', label: 'Open the selected task', status: context.state },
      { id: 'review', label: 'Review source and continue', status: states.waiting },
    ];
  }

  function workflowCode() {
    return [
      'async function runAgent(workspace) {',
      '  const context = await workspace.readContext();',
      '  const plan = agent.createPlan(context);',
      '',
      '  for await (const step of agent.run(plan)) {',
      '    const result = await tools.inspect(step);',
      '    await workspace.apply(result);',
      '    await checks.verify(result.scope);',
      '  }',
      '',
      '  return agent.summarize(workspace.changes);',
      '}',
    ].join('\n');
  }

  function taskCode(index = 0) {
    const steps = [
      ['const context = await agent.readContext();', 'const task = context.tasks.next();'],
      ['const plan = await agent.plan(task);', 'await tools.inspect(plan.files);'],
      ['const result = await reader.open(task);', 'await workspace.attach(result);'],
      ['await agent.review(workspace.changes);', 'return workspace.nextTask();'],
    ];
    return steps[index % steps.length].join('\n');
  }

  function describeStep(index = 0) {
    const descriptions = [
      'I’ll read the context first, then inspect the relevant details.',
      'The next step is to check the source and keep the change focused.',
      'I’m tracing the data flow before choosing the implementation.',
      'I’ll review the result and keep the original behavior intact.',
    ];
    return descriptions[index % descriptions.length];
  }

  function tokenize(line, language = 'javascript') {
    const tokens = [];
    const pattern = /\/\/.*$|\/\*.*?(?:\*\/|$)|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`|\b(?:async|await|const|let|function|return|if|else|for|while|try|catch|throw|new|class|typeof|instanceof|true|false|null|undefined|import|export|from|of|in)\b|\b\d+(?:\.\d+)?\b|--[a-zA-Z][\w-]*/g;
    let start = 0;
    for (const match of line.matchAll(pattern)) {
      if (match.index > start) tokens.push({ text: line.slice(start, match.index), kind: '' });
      const value = match[0];
      let kind = 'keyword';
      if (value.startsWith('//') || value.startsWith('/*')) kind = 'comment';
      else if (/^['"`]/.test(value)) kind = 'string';
      else if (/^\d/.test(value)) kind = 'number';
      else if (language === 'css' && value.startsWith('--')) kind = 'property';
      tokens.push({ text: value, kind });
      start = match.index + value.length;
    }
    if (start < line.length) tokens.push({ text: line.slice(start), kind: '' });
    return tokens;
  }

  function appendHighlightedLine(parent, line, language) {
    for (const token of tokenize(line, language)) {
      const span = document.createElement('span');
      if (token.kind) span.className = `xc-token-${token.kind}`;
      span.textContent = token.text;
      parent.append(span);
    }
  }

  return Object.freeze({
    collectTaskCards,
    readTask,
    inspectWorkspace,
    createPlan,
    workflowCode,
    taskCode,
    describeStep,
    appendHighlightedLine,
  });
}
)();
  const sourceFiles = {"workflow.js":"function createWorkspaceWorkflow() {\n  'use strict';\n\n  const selectors = Object.freeze({\n    tasks: '#global .feeds-container .note-item',\n    title: 'a.title',\n    author: '.author .name',\n    detail: '#noteContainer',\n    description: '#detail-desc',\n  });\n\n  const states = Object.freeze({\n    ready: 'ready',\n    inspecting: 'inspecting',\n    reading: 'reading',\n    waiting: 'waiting',\n  });\n\n  function normalizeText(value, limit = 240) {\n    return String(value || '')\n      .replace(/\\s+/g, ' ')\n      .trim()\n      .slice(0, limit);\n  }\n\n  function collectTaskCards(root = document) {\n    return [...root.querySelectorAll(selectors.tasks)]\n      .filter(card => !card.hidden);\n  }\n\n  function readTask(card, index = 0) {\n    const title = card.querySelector(selectors.title);\n    return {\n      id: card.getAttribute('data-note-id') || `task-${index}`,\n      index,\n      title: normalizeText(title?.textContent),\n      author: normalizeText(card.querySelector(selectors.author)?.textContent),\n      href: title?.getAttribute('href') || '',\n      node: card,\n    };\n  }\n\n  function inspectWorkspace(root = document) {\n    const cards = collectTaskCards(root);\n    const detail = root.querySelector(selectors.detail);\n    return {\n      state: detail ? states.reading : states.ready,\n      taskCount: cards.length,\n      activeTitle: normalizeText(detail?.querySelector('#detail-title')?.textContent),\n      tasks: cards.map(readTask),\n      mediaPolicy: 'thumbnail-until-requested',\n    };\n  }\n\n  function createPlan(context) {\n    return [\n      { id: 'context', label: 'Read workspace context', status: states.ready },\n      { id: 'inspect', label: 'Inspect incoming tasks', status: states.inspecting },\n      { id: 'open', label: 'Open the selected task', status: context.state },\n      { id: 'review', label: 'Review source and continue', status: states.waiting },\n    ];\n  }\n\n  function workflowCode() {\n    return [\n      'async function runAgent(workspace) {',\n      '  const context = await workspace.readContext();',\n      '  const plan = agent.createPlan(context);',\n      '',\n      '  for await (const step of agent.run(plan)) {',\n      '    const result = await tools.inspect(step);',\n      '    await workspace.apply(result);',\n      '    await checks.verify(result.scope);',\n      '  }',\n      '',\n      '  return agent.summarize(workspace.changes);',\n      '}',\n    ].join('\\n');\n  }\n\n  function taskCode(index = 0) {\n    const steps = [\n      ['const context = await agent.readContext();', 'const task = context.tasks.next();'],\n      ['const plan = await agent.plan(task);', 'await tools.inspect(plan.files);'],\n      ['const result = await reader.open(task);', 'await workspace.attach(result);'],\n      ['await agent.review(workspace.changes);', 'return workspace.nextTask();'],\n    ];\n    return steps[index % steps.length].join('\\n');\n  }\n\n  function describeStep(index = 0) {\n    const descriptions = [\n      'I’ll read the context first, then inspect the relevant details.',\n      'The next step is to check the source and keep the change focused.',\n      'I’m tracing the data flow before choosing the implementation.',\n      'I’ll review the result and keep the original behavior intact.',\n    ];\n    return descriptions[index % descriptions.length];\n  }\n\n  function tokenize(line, language = 'javascript') {\n    const tokens = [];\n    const pattern = /\\/\\/.*$|\\/\\*.*?(?:\\*\\/|$)|'(?:\\\\.|[^'\\\\])*'|\"(?:\\\\.|[^\"\\\\])*\"|`(?:\\\\.|[^`\\\\])*`|\\b(?:async|await|const|let|function|return|if|else|for|while|try|catch|throw|new|class|typeof|instanceof|true|false|null|undefined|import|export|from|of|in)\\b|\\b\\d+(?:\\.\\d+)?\\b|--[a-zA-Z][\\w-]*/g;\n    let start = 0;\n    for (const match of line.matchAll(pattern)) {\n      if (match.index > start) tokens.push({ text: line.slice(start, match.index), kind: '' });\n      const value = match[0];\n      let kind = 'keyword';\n      if (value.startsWith('//') || value.startsWith('/*')) kind = 'comment';\n      else if (/^['\"`]/.test(value)) kind = 'string';\n      else if (/^\\d/.test(value)) kind = 'number';\n      else if (language === 'css' && value.startsWith('--')) kind = 'property';\n      tokens.push({ text: value, kind });\n      start = match.index + value.length;\n    }\n    if (start < line.length) tokens.push({ text: line.slice(start), kind: '' });\n    return tokens;\n  }\n\n  function appendHighlightedLine(parent, line, language) {\n    for (const token of tokenize(line, language)) {\n      const span = document.createElement('span');\n      if (token.kind) span.className = `xc-token-${token.kind}`;\n      span.textContent = token.text;\n      parent.append(span);\n    }\n  }\n\n  return Object.freeze({\n    collectTaskCards,\n    readTask,\n    inspectWorkspace,\n    createPlan,\n    workflowCode,\n    taskCode,\n    describeStep,\n    appendHighlightedLine,\n  });\n}\n","app.js":"(() => {\n  'use strict';\n  const KEY = 'xhs-codex-preferences-v1';\n  const CSS = __XC_CSS__;\n  const workflow = __XC_WORKFLOW__;\n  const sourceFiles = __XC_SOURCE_FILES__;\n  const sidebarTopics = ['优化异步任务调度','重构上下文缓存模块','修复 WebSocket 重连','补充接口单元测试','整理工作区类型定义'];\n  const html = document.documentElement;\n  const icons = {\n    codex: '<path d=\"m8 6-5 6 5 6M16 6l5 6-5 6M14 4l-4 16\"/>',\n    sidebar: '<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><path d=\"M9 4v16\"/>',\n    plus: '<path d=\"M12 5v14M5 12h14\"/>',\n    search: '<circle cx=\"10.5\" cy=\"10.5\" r=\"6.5\"/><path d=\"m16 16 4 4\"/>',\n    folder: '<path d=\"M3 7a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9H3Z\"/>',\n    user: '<circle cx=\"12\" cy=\"8\" r=\"3\"/><path d=\"M5 21v-3a7 7 0 0 1 14 0v3\"/>',\n    sun: '<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5\"/>',\n    eye: '<path d=\"M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>',\n    shield: '<path d=\"m12 3 8 3v6c0 4-8 9-8 9s-8-5-8-9V6Z\"/><path d=\"m8 12 3 3 5-6\"/>',\n    back: '<path d=\"m10 5-7 7 7 7M3 12h18\"/>',\n    external: '<path d=\"M14 3h7v7m0-7L10 14M10 3H4v17h17v-6\"/>',\n    sparkle: '<path d=\"M12 3v18M3 12h18M5.5 5.5l13 13M5.5 18.5l13-13\"/>',\n    chevron: '<path d=\"m7 10 5 5 5-5\"/>',\n    close: '<path d=\"m6 6 12 12M6 18 18 6\"/>',\n    code: '<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M14 4v16M6 8l3 3-3 3\"/>',\n    copy: '<rect x=\"8\" y=\"8\" width=\"12\" height=\"13\" rx=\"2\"/><path d=\"M16 8V3H3v13h5\"/>',\n    branch: '<circle cx=\"6\" cy=\"5\" r=\"2\"/><circle cx=\"6\" cy=\"19\" r=\"2\"/><circle cx=\"18\" cy=\"6\" r=\"2\"/><path d=\"M6 7v10m0-4h6a6 6 0 0 0 6-5\"/>'\n  };\n  const svg = name => `<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">${icons[name] || icons.folder}</svg>`;\n  const reader = (__XC_READER_MODULE__)({ icon:svg, requestUpdate:schedule, canPreview:()=>enabled&&!panic&&!(editorOverlay&&compactEditor.matches) });\n  function load() {\n    try {\n      const raw = typeof GM_getValue === 'function' ? GM_getValue(KEY, {}) : JSON.parse(localStorage.getItem(KEY) || '{}');\n      return { enabled: raw.enabled !== false, code: raw.code !== false, theme: ['light','dark','system'].includes(raw.theme) ? raw.theme : 'system' };\n    } catch { return { enabled: true, code: true, theme: 'system' }; }\n  }\n  const prefs = load();\n  const system = matchMedia('(prefers-color-scheme: dark)');\n  const narrow = matchMedia('(max-width: 1100px)');\n  const compactEditor = matchMedia('(max-width: 1000px)');\n  let editorOverlay = false;\n  let sourceFile = 'workflow.js';\n  let codeWrapped = false;\n  const flowNodes = new Set();\n  const decoratedCards = new WeakMap();\n  let collapsed = narrow.matches;\n  let enabled = false;\n  let panic = false;\n  let media = false;\n  let detailKey = '';\n  let detailNode = null;\n  let currentFeed = null;\n  const observedFeeds = new WeakSet();\n  let shell, restore, queued;\n  let priorFocus = null;\n  let panicApp = null;\n  let appWasInert = false;\n  let priorTitle = document.title;\n  let addedIcon;\n  const originalIcons = new Map();\n  const inputAttributes = new Map();\n  const introNodes = new Set();\n  const iconURL = `data:image/svg+xml,${encodeURIComponent('<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><rect width=\"32\" height=\"32\" rx=\"8\" fill=\"#252627\"/><path d=\"m11 9-6 7 6 7m10-14 6 7-6 7m-3-17-5 20\" stroke=\"#f7f7f8\" stroke-width=\"2.2\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>')}`;\n  const supported = () => /^\\/(?:$|explore(?:\\/|$)|search_result(?:\\/|$)|user\\/profile(?:\\/|$)|discovery\\/item(?:\\/|$))/.test(location.pathname);\n  function save() {\n    try {\n      if (typeof GM_setValue === 'function') GM_setValue(KEY, {...prefs});\n      else localStorage.setItem(KEY, JSON.stringify(prefs));\n    } catch { /* Appearance still works if preference storage is unavailable. */ }\n  }\n  function text(id, value) { const e = document.getElementById(id); if (e && e.textContent !== value) e.textContent = value; }\n  function pauseMedia() { document.querySelectorAll('#app video, #app audio').forEach(v => { if (!v.paused) v.pause(); }); }\n  function theme() {\n    html.dataset.xcTheme = prefs.theme === 'system' ? (system.matches ? 'dark' : 'light') : prefs.theme;\n    const label = {system:'跟随系统',light:'浅色',dark:'深色'}[prefs.theme];\n    text('xc-theme-label', label);\n    document.getElementById('xc-theme')?.setAttribute('aria-label', `切换主题，当前${label}`);\n  }\n  function setBranding(on) {\n    if (on) {\n      if (document.title !== 'Codex') { priorTitle = document.title; document.title = 'Codex'; }\n      const links = [...document.head.querySelectorAll('link[rel~=\"icon\"]')].filter(x => x !== addedIcon);\n      for (const link of links) {\n        if (!originalIcons.has(link)) originalIcons.set(link, link.getAttribute('href'));\n        if (link.getAttribute('href') !== iconURL) link.setAttribute('href', iconURL);\n      }\n      if (!links.length && !addedIcon) {\n        addedIcon = document.createElement('link'); addedIcon.rel = 'icon'; addedIcon.href = iconURL; document.head.append(addedIcon);\n      }\n    } else {\n      if (document.title === 'Codex') document.title = priorTitle;\n      for (const [link, href] of originalIcons) {\n        if (link.getAttribute('href') === iconURL) {\n          if (href === null) link.removeAttribute('href'); else link.setAttribute('href', href);\n        }\n      }\n      originalIcons.clear(); addedIcon?.remove(); addedIcon = null;\n    }\n  }\n  function restoreInput() {\n    for (const [input, attributes] of inputAttributes) {\n      for (const [name, value] of Object.entries(attributes)) {\n        if (value === null) input.removeAttribute(name); else input.setAttribute(name, value);\n      }\n    }\n    inputAttributes.clear();\n  }\n  function syncNativeInert() {\n    const app=document.getElementById('app');\n    const needed=enabled && (panic || (editorOverlay && compactEditor.matches));\n    if(needed && app) {\n      if(panicApp!==app) {\n        if(panicApp && !appWasInert) panicApp.removeAttribute('inert');\n        panicApp=app; appWasInert=app.hasAttribute('inert');\n      }\n      app.setAttribute('inert','');\n    } else {\n      if(panicApp && !appWasInert) panicApp.removeAttribute('inert');\n      panicApp=null;\n    }\n  }\n  function setEnabled(value) {\n    const was = enabled;\n    enabled = value && supported();\n    html.dataset.xcEnabled = String(enabled);\n    if (!enabled) {\n      reader.clear();\n      panic = false; editorOverlay=false; syncNativeInert();\n      panicApp = null;\n      panic = false; media = false; html.dataset.xcPanic = 'false'; applyMedia();\n      text('xc-panic-label','隐藏内容');\n      document.getElementById('xc-panic-toggle')?.setAttribute('aria-pressed','false');\n      document.getElementById('xc-panic-toggle')?.setAttribute('aria-label','隐藏内容');\n      html.style.removeProperty('--xc-feed-scroll');\n      flowNodes.forEach(n=>n.remove()); flowNodes.clear();\n      restoreInput(); introNodes.forEach(n => n.remove()); introNodes.clear();\n      setBranding(false);\n      if (was && shell?.contains(document.activeElement)) restore?.focus();\n    } else {\n      theme(); syncEditor(); setBranding(true);\n      if (!was) pauseMedia();\n      update();\n    }\n    if (restore) restore.textContent = supported() ? '启用 Codex · Alt+X' : '返回 Codex 工作区';\n  }\n  function toggle() { prefs.enabled = !enabled; save(); setEnabled(prefs.enabled); }\n  function togglePanic() {\n    if (!enabled) return;\n    reader.closePreview();\n    panic = !panic;\n    html.dataset.xcPanic = String(panic);\n    text('xc-panic-label', panic ? '继续阅读' : '隐藏内容');\n    document.getElementById('xc-panic-toggle').setAttribute('aria-pressed', String(panic));\n    document.getElementById('xc-panic-toggle').setAttribute('aria-label',panic?'继续阅读':'隐藏内容');\n    if (panic) {\n      priorFocus = document.activeElement;\n      syncNativeInert();\n      document.getElementById('xc-panic-toggle').focus();\n      text('xc-crumb', '工作区');\n      pauseMedia();\n    } else {\n      syncNativeInert();\n      if (priorFocus?.isConnected) priorFocus.focus({preventScroll:true});\n      update();\n    }\n  }\n  function closeSidebarOnNarrow() { if (narrow.matches) { collapsed=true; sidebar(); } }\n  function search() {\n    closeSidebarOnNarrow();\n    if (compactEditor.matches && editorOverlay) { editorOverlay=false; syncEditor(); }\n    if (panic) togglePanic();\n    const input = document.querySelector('#global header input');\n    if (detailNode) closeDetail();\n    if (input) {\n      if (currentFeed) { currentFeed.scrollTop=0; html.style.setProperty('--xc-feed-scroll','0px'); }\n      window.scrollTo({top:0,behavior:'instant'}); input.focus();\n    }\n  }\n  function closeDetail() {\n    const close = document.querySelector('.note-detail-mask .close-circle .close, .note-detail-mask .close-box');\n    if (close) close.click();\n    else if (detailNode) location.assign('/explore');\n  }\n  function buildShell() {\n    shell = document.createElement('div'); shell.id = 'xc-shell';\n    shell.innerHTML = `\n      <nav id=\"xc-activity-rail\" aria-label=\"活动栏\">\n        <a class=\"xc-icon\" href=\"/explore\" aria-label=\"工作区首页\">${svg('folder')}</a>\n        <button class=\"xc-icon\" id=\"xc-rail-search\" aria-label=\"搜索任务\">${svg('search')}</button>\n        <button class=\"xc-icon\" id=\"xc-rail-code\" aria-label=\"切换源代码面板\">${svg('code')}</button>\n      </nav>\n      <header id=\"xc-topbar\">\n        <button class=\"xc-icon\" id=\"xc-sidebar-toggle\" aria-label=\"切换侧栏\" aria-controls=\"xc-sidebar\">${svg('sidebar')}</button>\n        <div class=\"xc-brand\">${svg('codex')}<span>Codex</span></div>\n        <span class=\"xc-crumb\" id=\"xc-crumb\">工作区</span><span class=\"xc-spacer\"></span>\n        <button class=\"xc-tool\" id=\"xc-back\" hidden aria-label=\"返回任务列表\">${svg('back')}<span>返回列表</span></button>\n        <button class=\"xc-tool\" id=\"xc-media\" hidden aria-label=\"查看图片 / 视频\" aria-pressed=\"false\">${svg('eye')}<span id=\"xc-media-label\">查看图片 / 视频</span></button>\n        <button class=\"xc-icon\" id=\"xc-code-toggle\" aria-label=\"切换源代码面板\" title=\"显示 / 隐藏源代码\" aria-controls=\"xc-editor\">${svg('code')}</button>\n        <button class=\"xc-tool\" id=\"xc-panic-toggle\" aria-label=\"隐藏内容\" aria-keyshortcuts=\"Alt+Q\" aria-pressed=\"false\" title=\"Alt+Q\">${svg('shield')}<span id=\"xc-panic-label\">隐藏内容</span></button>\n      </header>\n      <aside id=\"xc-sidebar\" aria-label=\"工作区侧栏\">\n        <button class=\"xc-nav\" id=\"xc-search\">${svg('plus')}<span>新建探索</span></button>\n        <button class=\"xc-nav\" id=\"xc-focus-search\">${svg('search')}<span>搜索笔记</span></button>\n        <p class=\"xc-section\">项目</p>\n        <a class=\"xc-nav xc-project\" id=\"xc-home\" href=\"/explore\">${svg('folder')}<span>个人工作区</span></a>\n        <div class=\"xc-note\" id=\"xc-recent\"><span id=\"xc-recent-empty\">最近的任务会显示在这里</span></div>\n        <button class=\"xc-nav\" id=\"xc-profile\">${svg('user')}<span>我的主页</span></button>\n        <div class=\"xc-bottom\">\n          <button class=\"xc-nav\" id=\"xc-theme\">${svg('sun')}<span id=\"xc-theme-label\">跟随系统</span></button>\n          <button class=\"xc-nav\" id=\"xc-original\">${svg('external')}<span>原版页面</span><kbd>Alt X</kbd></button>\n          <div id=\"xc-help\">Alt Q 隐藏 / 恢复内容</div>\n        </div>\n      </aside>\n      <aside id=\"xc-editor\" aria-label=\"源代码面板\">\n        <div id=\"xc-file-tabs\" role=\"tablist\" aria-label=\"源码文件\">\n          <button role=\"tab\" aria-selected=\"true\" data-xc-file=\"workflow.js\">workflow.js</button>\n          <button role=\"tab\" aria-selected=\"false\" data-xc-file=\"app.js\">app.js</button>\n          <button role=\"tab\" aria-selected=\"false\" data-xc-file=\"reader.js\">reader.js</button>\n          <button role=\"tab\" aria-selected=\"false\" data-xc-file=\"style.css\">style.css</button>\n          <button class=\"xc-icon\" id=\"xc-editor-close\" aria-label=\"关闭源代码面板\">${svg('sidebar')}</button>\n        </div>\n        <div id=\"xc-code-crumb\"><span>workspace / src / <b id=\"xc-code-file\">workflow.js</b></span><span class=\"xc-spacer\"></span>\n          <button id=\"xc-code-wrap\" aria-label=\"切换代码自动换行\" aria-pressed=\"false\">换行</button>\n          <button class=\"xc-icon\" id=\"xc-code-copy\" aria-label=\"复制当前源代码\" title=\"复制源码\">${svg('copy')}</button>\n        </div>\n        <div id=\"xc-code-body\" tabindex=\"0\" role=\"tabpanel\" aria-label=\"workflow.js 源代码\"></div>\n        <div id=\"xc-code-footer\"><span id=\"xc-code-lines\"></span><span id=\"xc-copy-status\" role=\"status\">JavaScript · UTF-8</span></div>\n      </aside>\n      <main id=\"xc-panic\" aria-label=\"工作区待机画面\">\n        ${svg('codex')}<h1>工作区已就绪</h1><p>准备开始下一个任务</p>\n        <pre><code># Workspace\\n\\n- Review project structure\\n- Organize implementation notes\\n- Run checks before committing</code></pre>\n      </main>\n      <footer id=\"xc-status\"><span>${svg('branch')} main<span id=\"xc-count\"></span></span><span id=\"xc-media-status\">缩略图模式 · 媒体暂停</span></footer>`;\n    document.body.append(shell);\n    restore = document.createElement('button'); restore.id = 'xc-restore'; restore.type = 'button';\n    restore.textContent = '启用 Codex · Alt+X'; document.body.append(restore);\n    const on = (id, fn) => document.getElementById(id).addEventListener('click', fn);\n    on('xc-sidebar-toggle', () => { collapsed = !collapsed; sidebar(); });\n    on('xc-search', search); on('xc-focus-search', search);\n    on('xc-panic-toggle', togglePanic);\n    on('xc-original', toggle);\n    on('xc-restore', () => { if (!supported()) location.assign('/explore'); else toggle(); });\n    on('xc-theme', () => { const modes=['system','light','dark']; prefs.theme=modes[(modes.indexOf(prefs.theme)+1)%3]; save(); theme(); });\n    on('xc-media', () => { media = !media; applyMedia(); });\n    on('xc-back', closeDetail);\n    on('xc-profile', () => {\n      closeSidebarOnNarrow();\n      const link = document.querySelector('#global .side-bar a[href^=\"/user/profile/\"]');\n      if (link) link.click(); else document.querySelector('#login-btn')?.click();\n    });\n    on('xc-code-toggle', toggleEditor); on('xc-rail-code', toggleEditor);\n    on('xc-editor-close', toggleEditor); on('xc-rail-search', search);\n    document.querySelectorAll('[data-xc-file]').forEach(button=>button.addEventListener('click',()=>renderSource(button.dataset.xcFile)));\n    on('xc-code-wrap',()=> {\n      codeWrapped=!codeWrapped;\n      document.getElementById('xc-code-body').classList.toggle('xc-code-wrapped',codeWrapped);\n      document.getElementById('xc-code-wrap').setAttribute('aria-pressed',String(codeWrapped));\n    });\n    on('xc-code-copy',async()=> {\n      try { await copySourceText(sourceFiles[sourceFile]); text('xc-copy-status','已复制'); }\n      catch { text('xc-copy-status','请选择代码后复制'); }\n    });\n    document.getElementById('xc-file-tabs').addEventListener('keydown',e=> {\n      if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;\n      const tabs=[...document.querySelectorAll('[data-xc-file]')];\n      const index=tabs.indexOf(document.activeElement);\n      if(index<0) return;\n      e.preventDefault();\n      const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(index+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;\n      renderSource(tabs[next].dataset.xcFile); tabs[next].focus();\n    });\n    renderSource(sourceFile); syncEditor(); sidebar();\n  }\n  async function copySourceText(value) {\n    if(typeof GM_setClipboard==='function') { GM_setClipboard(value,'text'); return; }\n    const active=document.activeElement;\n    const area=document.createElement('textarea'); area.value=value; area.readOnly=true;\n    area.style.cssText='position:fixed;left:-10000px;top:0;width:1px;height:1px';\n    shell.append(area); area.focus({preventScroll:true}); area.select();\n    let copied=false;\n    try { copied=typeof document.execCommand==='function' && document.execCommand('copy'); }\n    finally { area.remove(); active?.focus({preventScroll:true}); }\n    if(copied) return;\n    let timer;\n    try {\n      await Promise.race([\n        navigator.clipboard.writeText(value),\n        new Promise((_,reject)=> { timer=setTimeout(()=>reject(new Error('Clipboard unavailable')),2500); }),\n      ]);\n    } finally { clearTimeout(timer); }\n  }\n  function syncEditor() {\n    const open=compactEditor.matches ? editorOverlay : prefs.code;\n    html.dataset.xcEditor=String(open);\n    html.dataset.xcEditorOverlay=String(open && compactEditor.matches);\n    document.getElementById('xc-code-toggle')?.setAttribute('aria-expanded',String(open));\n    document.getElementById('xc-rail-code')?.setAttribute('aria-pressed',String(open));\n    document.getElementById('xc-editor')?.setAttribute('aria-hidden',String(!open));\n    syncNativeInert();\n    if(enabled && open && compactEditor.matches) { reader.closePreview(); pauseMedia(); }\n  }\n  function toggleEditor() {\n    if(compactEditor.matches) { editorOverlay=!editorOverlay; closeSidebarOnNarrow(); }\n    else { prefs.code=!prefs.code; save(); }\n    syncEditor();\n    if(compactEditor.matches && editorOverlay) document.getElementById('xc-code-body')?.focus({preventScroll:true});\n    else document.getElementById('xc-code-toggle')?.focus();\n  }\n  function renderSource(file) {\n    if(!Object.hasOwn(sourceFiles,file)) return;\n    sourceFile=file;\n    const body=document.getElementById('xc-code-body');\n    const fragment=document.createDocumentFragment();\n    const lines=sourceFiles[file].split('\\n');\n    lines.forEach((line,index)=> {\n      const row=document.createElement('div'); row.className='xc-source-line';\n      const number=document.createElement('span'); number.className='xc-line-number'; number.textContent=String(index+1); number.setAttribute('aria-hidden','true');\n      const content=document.createElement('span'); content.className='xc-line-code';\n      workflow.appendHighlightedLine(content,line,file.endsWith('.css')?'css':'javascript');\n      row.append(number,content); fragment.append(row);\n    });\n    body.replaceChildren(fragment); body.scrollTop=0; body.scrollLeft=0;\n    body.setAttribute('aria-label',file+' 源代码');\n    document.querySelectorAll('[data-xc-file]').forEach(button=> { const active=button.dataset.xcFile===file; button.setAttribute('aria-selected',String(active)); button.tabIndex=active?0:-1; });\n    text('xc-code-file',file); text('xc-code-lines',lines.length+' lines');\n    text('xc-copy-status',(file.endsWith('.css')?'CSS':'JavaScript')+' · UTF-8');\n  }\n  function codeBlock(code,compact=false) {\n    const block=document.createElement('pre'); block.className=compact?'xc-flow-code xc-flow-code-small':'xc-flow-code';\n    const content=document.createElement('code');\n    code.split('\\n').forEach((line,index)=> {\n      if(index) content.append('\\n');\n      workflow.appendHighlightedLine(content,line,'javascript');\n    });\n    block.append(content); return block;\n  }\n  function agentFlow(full=true,index=0) {\n    const wrapper=document.createElement('div'); wrapper.className=full?'xc-intro xc-agent-flow':'xc-agent-step';\n    const heading=document.createElement('div'); heading.className='xc-agent-heading';\n    heading.innerHTML=svg('codex');\n    const label=document.createElement('span'); label.textContent=full?'Agent workflow':'Inspect context'; heading.append(label);\n    const description=document.createElement('p'); description.textContent=workflow.describeStep(index);\n    wrapper.append(heading,description,codeBlock(full?workflow.workflowCode():workflow.taskCode(index),!full));\n    if(full) {\n      const summary=document.createElement('div'); summary.className='xc-flow-summary'; summary.textContent='Read context  /  Inspect source  /  Review changes'; wrapper.append(summary);\n    }\n    return wrapper;\n  }\n  function decorateTasks(items) {\n    for(const [index,card] of items.entries()) {\n      const old=decoratedCards.get(card);\n      if(old?.isConnected) continue;\n      const copied=card.querySelector('.xc-agent-step');\n      if(copied) { decoratedCards.set(card,copied); flowNodes.add(copied); continue; }\n      const footer=card.querySelector('.footer');\n      if(!footer) continue;\n      const step=agentFlow(false,index);\n      footer.before(step); decoratedCards.set(card,step); flowNodes.add(step);\n    }\n    for(const node of flowNodes) if(!node.isConnected) flowNodes.delete(node);\n  }\n  function sidebar() {\n    html.dataset.xcCollapsed = String(collapsed);\n    document.getElementById('xc-sidebar-toggle')?.setAttribute('aria-expanded',String(!collapsed));\n  }\n  function applyMedia() {\n    html.dataset.xcMedia = media ? 'show' : 'hide';\n    text('xc-media-label', media ? '收起图片 / 视频' : '查看图片 / 视频');\n    document.getElementById('xc-media')?.setAttribute('aria-pressed',String(media));\n    document.getElementById('xc-media')?.setAttribute('aria-label',media?'收起图片 / 视频':'查看图片 / 视频');\n    text('xc-media-status', media ? '当前笔记媒体已展开' : '缩略图模式 · 媒体暂停');\n    reader.closePreview();\n    if (enabled && !media) pauseMedia();\n  }\n  function update() {\n    if (!enabled) return;\n    if (!supported()) { setEnabled(false); return; }\n    for (const n of introNodes) if (!n.isConnected) introNodes.delete(n);\n    for (const [n, attributes] of inputAttributes) if (!n.isConnected) {\n      for (const [name,value] of Object.entries(attributes)) { if(value===null)n.removeAttribute(name);else n.setAttribute(name,value); }\n      inputAttributes.delete(n);\n    }\n    const input = document.querySelector('#global header input');\n    if (input && !inputAttributes.has(input)) {\n      inputAttributes.set(input,{placeholder:input.getAttribute('placeholder'),'aria-label':input.getAttribute('aria-label')});\n      input.setAttribute('placeholder','搜索任务内容，按 Enter 查找…'); input.setAttribute('aria-label','搜索小红书笔记');\n    }\n    const feed = document.querySelector('#global .feeds-page, #global .search-page');\n    currentFeed = feed;\n    if (feed) {\n      html.style.setProperty('--xc-feed-scroll',`${feed.scrollTop}px`);\n      if (!observedFeeds.has(feed)) {\n        observedFeeds.add(feed);\n        feed.addEventListener('scroll',()=> {\n          if (enabled && currentFeed===feed) html.style.setProperty('--xc-feed-scroll',`${feed.scrollTop}px`);\n        },{passive:true});\n      }\n    }\n    if (feed && !feed.querySelector(':scope > .xc-intro')) {\n      const intro=agentFlow(); feed.prepend(intro); introNodes.add(intro);\n    }\n    const nextNode = document.querySelector('#noteContainer');\n    const key = nextNode ? (nextNode.parentElement.getAttribute('note-id') || location.pathname + (nextNode.querySelector('#detail-title')?.textContent || '')) : '';\n    if (nextNode !== detailNode || key !== detailKey) {\n      detailNode=nextNode; detailKey=key; media=false; applyMedia();\n    }\n    html.dataset.xcDetail=String(!!nextNode);\n    const scroller=nextNode?.querySelector('.note-scroller');\n    if(scroller && !scroller.querySelector(':scope>.xc-agent-flow')) {\n      const flow=agentFlow(); scroller.prepend(flow); flowNodes.add(flow);\n    }\n    document.getElementById('xc-back').hidden = !nextNode;\n    document.getElementById('xc-media').hidden = !nextNode;\n    if (!panic) text('xc-crumb', nextNode ? '任务详情' : location.pathname.startsWith('/search_result') ? '搜索结果' : '工作区');\n    const items = workflow.collectTaskCards(document);\n    decorateTasks(items);\n    reader.update(document.getElementById('app'),{expanded:media});\n    text('xc-count', items.length ? ` · ${items.length} 项任务` : '');\n    const recent = document.getElementById('xc-recent');\n    const links = [...items].slice(0,5).map(n => n.querySelector('a.title')).filter(Boolean);\n    const signature = JSON.stringify(links.map(a=>a.getAttribute('href')));\n    if (recent.dataset.signature !== signature) {\n      recent.dataset.signature=signature; recent.replaceChildren();\n      sidebarTopics.forEach((label,index)=> {\n        const native=links[index];\n        let target='/explore';\n        try {\n          if(native) {\n            const url=new URL(native.getAttribute('href'),location.origin);\n            if(url.origin===location.origin && /^\\/(explore|search_result|discovery\\/item)\\//.test(url.pathname)) target=url.href;\n          }\n        } catch { /* Keep the workspace's normal home route. */ }\n        const a=document.createElement('a'); a.href=target; a.textContent=label; a.title=label;\n        a.addEventListener('click',event=> {\n          if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button!==0) return;\n          if(target!=='/explore' && native?.isConnected) { event.preventDefault(); native.click(); closeSidebarOnNarrow(); }\n          else { event.preventDefault(); search(); }\n        });\n        recent.append(a);\n      });\n    }\n    document.getElementById('xc-home').setAttribute('aria-current',location.pathname==='/explore'?'page':'false');\n    setBranding(true);\n  }\n  function schedule() {\n    if (queued) return;\n    queued = setTimeout(() => {\n      queued=0;\n      if (prefs.enabled && !enabled && supported()) setEnabled(true);\n      else update();\n    },100);\n  }\n  function boot() {\n    if (document.getElementById('xc-shell')) return;\n    const style=document.createElement('style'); style.id='xc-style'; style.textContent=CSS; document.head.append(style);\n    buildShell(); setEnabled(prefs.enabled); applyMedia();\n    document.addEventListener('keydown',e=> {\n      if (e.isComposing || e.repeat || !e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;\n      if (e.code==='KeyQ' && enabled) { e.preventDefault(); togglePanic(); }\n      if (e.code==='KeyX') {\n        const editing=e.target instanceof Element && e.target.closest('input,textarea,[contenteditable]:not([contenteditable=\"false\"]),[role=\"textbox\"]');\n        if (!editing) { e.preventDefault(); toggle(); }\n      }\n    },true);\n    document.addEventListener('play',e=> {\n      if (enabled && (panic || (editorOverlay && compactEditor.matches) || !media || !e.target.closest('#noteContainer'))) e.target.pause?.();\n    },true);\n    document.addEventListener('click',schedule,true);\n    addEventListener('popstate',schedule); addEventListener('hashchange',schedule);\n    const observer = new MutationObserver(records=> {\n      if (records.some(r=> !(r.target instanceof Element ? r.target : r.target.parentElement)?.closest('#xc-shell,#xc-restore,.xc-intro,.xc-agent-step,[data-xc-reader-owned]'))) schedule();\n    });\n    observer.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['src','srcset','poster','data-src']});\n    new MutationObserver(()=> { if(enabled) { setBranding(true); schedule(); } else if(document.title!=='Codex') priorTitle=document.title; }).observe(document.head,{childList:true,subtree:true,characterData:true});\n    system.addEventListener('change',theme);\n    narrow.addEventListener('change',()=> { collapsed=narrow.matches; sidebar(); });\n    compactEditor.addEventListener('change',()=> { editorOverlay=false; syncEditor(); });\n    if (typeof GM_registerMenuCommand==='function') {\n      GM_registerMenuCommand('Codex：切换原版 / 伪装 (Alt+X)',toggle);\n      GM_registerMenuCommand('Codex：隐藏 / 恢复内容 (Alt+Q)',togglePanic);\n      GM_registerMenuCommand('Codex：切换深浅主题',()=>document.getElementById('xc-theme').click());\n    }\n  }\n  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();\n})();\n","reader.js":"function createReadingPresentation({ icon, requestUpdate, canPreview }) {\n  const owned = '[data-xc-reader-owned]';\n  const commentBlocks = new Map();\n  const groups = new Map();\n  const markedImages = new Set();\n  let popup, previewImage, previewCaption, trigger, pinned = false, closeTimer, suppressFocus = false;\n  const phrases = [\n    ['First I’ll inspect the context and trace the relevant data flow.', 'The important detail is how the state changes between these steps.', 'Keep the change focused, then review the result against the original behavior.'],\n    ['Start with the surrounding context before choosing an implementation.', 'Check the ordering: cleanup should happen after the pending work is complete.', 'A small, targeted change makes the next verification easier to follow.'],\n    ['I’m following the execution path and checking the assumptions at each boundary.', 'Compare the inputs with the current state, then inspect the affected branch.', 'That leaves one clear next step: verify the result and keep the existing contract.'],\n    ['Read the relevant context first, then look for the smallest useful change.', 'The retry path and the normal path should agree on the same state transition.', 'Review the edge case once more before moving on to the next task.'],\n  ];\n  function own(node) { node.setAttribute('data-xc-reader-owned', ''); return node; }\n  function hash(value) { let n=2166136261; for(const c of value) n=Math.imul(n^c.charCodeAt(0),16777619); return n>>>0; }\n  function commentContent(comment) {\n    return [...comment.querySelectorAll('.content,.comment-content')].find(n=>n.closest('.comment-item')===comment);\n  }\n  function decorateComments(root) {\n    root.querySelectorAll('.comment-item').forEach((comment,index)=> {\n      const content=commentContent(comment);\n      if(!content) return;\n      const key=comment.id || `${index}:${content.textContent}`;\n      const record=commentBlocks.get(comment);\n      if(record?.block.isConnected && record.content===content && record.key===key) return;\n      record?.block.remove();\n      [...comment.querySelectorAll('.xc-comment-workflow')].filter(n=>n.closest('.comment-item')===comment).forEach(n=>n.remove());\n      const seed=hash(key), seconds=3+(seed%27);\n      const block=own(document.createElement('details')); block.className='xc-comment-workflow'; block.open=true;\n      const summary=document.createElement('summary'); summary.innerHTML=icon('sparkle');\n      const label=document.createElement('span'); label.textContent=`Worked for ${seconds}s`; summary.append(label);\n      const chevron=document.createElement('span'); chevron.className='xc-work-chevron'; chevron.innerHTML=icon('chevron'); summary.append(chevron);\n      const process=document.createElement('div'); process.className='xc-comment-process';\n      for(const line of phrases[seed%phrases.length]) { const p=document.createElement('p'); p.textContent=line; process.append(p); }\n      block.append(summary,process); content.before(block);\n      commentBlocks.set(comment,{block,content,key});\n    });\n    for(const [comment,record] of commentBlocks) if(!comment.isConnected) { record.block.remove(); commentBlocks.delete(comment); }\n  }\n  function mediaURL(value) {\n    if(!value) return '';\n    try {\n      const url=new URL(value,location.href);\n      if(['https:','http:','blob:'].includes(url.protocol)) return url.href;\n      if(url.protocol==='data:' && /^data:image\\/(?:png|jpe?g|webp|gif|avif|svg\\+xml)[;,]/i.test(value)) return value;\n    } catch { /* An incomplete lazy image is picked up on its next update. */ }\n    return '';\n  }\n  function imageSource(node,type='image') {\n    const src=mediaURL(node.tagName==='VIDEO' ? node.getAttribute('poster') : (node.currentSrc || node.getAttribute('src') || node.getAttribute('data-src')));\n    return src ? {src,type,width:node.naturalWidth||Number(node.getAttribute('width'))||0,height:node.naturalHeight||Number(node.getAttribute('height'))||0} : null;\n  }\n  function sourcesIn(container) {\n    if(!container) return [];\n    const result=[],seen=new Set();\n    container.querySelectorAll('img,video[poster]').forEach(node=> {\n      if(node.closest(owned)) return;\n      const item=imageSource(node,node.tagName==='VIDEO'?'video':'image');\n      if(item && !seen.has(item.src)) { seen.add(item.src); result.push(item); }\n    });\n    return result;\n  }\n  function dimensions(item) { return item.width && item.height ? `${item.width}×${item.height}` : '悬停放大'; }\n  function createPopup() {\n    if(popup?.isConnected) return;\n    popup=own(document.createElement('div')); popup.id='xc-image-preview'; popup.hidden=true; popup.setAttribute('role','dialog'); popup.setAttribute('aria-label','图片预览');\n    const close=document.createElement('button'); close.type='button'; close.className='xc-preview-close'; close.setAttribute('aria-label','关闭图片预览'); close.innerHTML=icon('close');\n    close.addEventListener('click',()=>closePreview(true));\n    previewImage=document.createElement('img'); previewImage.alt='放大的图片预览'; previewImage.decoding='async';\n    previewCaption=document.createElement('div'); previewCaption.className='xc-preview-caption';\n    popup.append(close,previewImage,previewCaption);\n    popup.addEventListener('mouseenter',()=>clearTimeout(closeTimer));\n    popup.addEventListener('mouseleave',()=> { if(!pinned) deferClose(); });\n    document.getElementById('xc-shell').append(popup);\n  }\n  function positionPreview(button) {\n    const box=button.getBoundingClientRect();\n    const width=Math.min(900,innerWidth-32), maxHeight=Math.max(120,Math.min(650,innerHeight-96));\n    const left=Math.max(16,Math.min(box.left,innerWidth-width-16));\n    let top=box.bottom+8;\n    if(top+maxHeight>innerHeight-16) top=Math.max(56,box.top-maxHeight-8);\n    popup.style.left=`${left}px`; popup.style.top=`${Math.max(56,top)}px`; popup.style.width=`${width}px`;\n    popup.style.maxHeight=`${maxHeight}px`;\n    previewImage.style.maxHeight=`${Math.max(100,maxHeight-38)}px`;\n  }\n  function openPreview(button,item,lock=false) {\n    if(!canPreview()) return;\n    clearTimeout(closeTimer); createPopup();\n    if(trigger && trigger!==button) trigger.setAttribute('aria-expanded','false');\n    pinned=lock || (trigger===button && pinned); trigger=button;\n    previewImage.src=item.src;\n    previewCaption.textContent=`${item.type==='video'?'Video poster':'Image'} · ${dimensions(item)}`;\n    previewImage.onload=()=> {\n      if(previewImage.naturalWidth) previewCaption.textContent=`${item.type==='video'?'Video poster':'Image'} · ${previewImage.naturalWidth}×${previewImage.naturalHeight}`;\n    };\n    previewImage.onerror=()=> { previewCaption.textContent='图片暂不可用，可使用右上角查看图片 / 视频'; };\n    popup.hidden=false; button.setAttribute('aria-expanded','true');\n    positionPreview(button);\n  }\n  function closePreview(focus=false) {\n    clearTimeout(closeTimer);\n    if(popup) { popup.hidden=true; previewImage?.removeAttribute('src'); }\n    const previous=trigger; trigger=null; pinned=false;\n    previous?.setAttribute('aria-expanded','false');\n    if(focus && previous?.isConnected && canPreview()) {\n      suppressFocus=true;\n      try { previous.focus({preventScroll:true}); } finally { suppressFocus=false; }\n    }\n  }\n  function deferClose() { clearTimeout(closeTimer); closeTimer=setTimeout(()=> { if(!pinned) closePreview(); },120); }\n  function thumbnail(item,index) {\n    const button=document.createElement('button'); button.type='button'; button.className='xc-thumbnail';\n    button.setAttribute('aria-label',`${item.type==='video'?'视频封面':'图片'} ${index+1}，悬停或点击放大`);\n    button.setAttribute('aria-expanded','false'); button.setAttribute('aria-haspopup','dialog');\n    const img=document.createElement('img'); img.src=item.src; img.alt=item.type==='video'?'视频封面缩略图':'图片缩略图'; img.loading='lazy'; img.decoding='async';\n    const caption=document.createElement('span'); caption.className='xc-thumbnail-caption';\n    caption.textContent=`${item.type==='video'?'Video':'Image'} · ${dimensions(item)}`;\n    img.addEventListener('load',()=> { item.width=img.naturalWidth||item.width; item.height=img.naturalHeight||item.height; caption.textContent=`${item.type==='video'?'Video':'Image'} · ${dimensions(item)}`; });\n    img.addEventListener('error',()=> { caption.textContent='图片暂不可用'; button.classList.add('xc-thumbnail-error'); });\n    button.append(img,caption);\n    button.addEventListener('mouseenter',()=>openPreview(button,item));\n    button.addEventListener('mouseleave',()=> { if(!pinned) deferClose(); });\n    button.addEventListener('focus',()=> { if(!suppressFocus) openPreview(button,item); });\n    button.addEventListener('blur',()=> { if(!pinned) closePreview(); });\n    button.addEventListener('click',event=> { event.preventDefault(); event.stopPropagation(); openPreview(button,item,true); });\n    return button;\n  }\n  function group(owner,anchor,items,kind='post') {\n    const signature=JSON.stringify(items.map(item=>[item.src,item.type]));\n    let record=groups.get(owner);\n    if(record && record.signature===signature && record.node.isConnected && record.anchor===anchor) return;\n    if(record?.node.contains(trigger)) closePreview();\n    record?.node.remove();\n    // Cloned native cards can carry old DOM decorations but not their handlers.\n    if(!record) { const copied=anchor.nextElementSibling; if(copied?.matches('.xc-media-thumbnails') && copied.dataset.xcGroupKind===kind) copied.remove(); }\n    if(!items.length) { groups.delete(owner); return; }\n    const node=own(document.createElement('div')); node.className=`xc-media-thumbnails xc-${kind}-thumbnails`; node.dataset.xcGroupKind=kind;\n    node.setAttribute('aria-label',kind==='post'?'笔记图片缩略图':'图片缩略图');\n    items.forEach((item,index)=>node.append(thumbnail(item,index)));\n    anchor.after(node); groups.set(owner,{node,signature,anchor});\n  }\n  function ignoreInlineImage(image) {\n    return image.closest(`${owned},.avatar,.avatar-container,.author,.author-container,.emoji,.emoticon`) || /avatar|emoji|emoticon/i.test(image.className);\n  }\n  function update(root,{expanded=false}={}) {\n    if(!root) { closePreview(); return; }\n    if(trigger && (!trigger.isConnected || !canPreview())) closePreview();\n    decorateComments(root);\n    root.querySelectorAll('.note-item').forEach(card=> {\n      const title=card.querySelector('a.title');\n      if(title) group(card,title,sourcesIn(card.querySelector('.cover')),'feed');\n    });\n    const note=root.querySelector('#noteContainer');\n    if(note) {\n      const anchor=note.querySelector('#detail-title') || note.querySelector('#detail-desc');\n      if(anchor) group(note,anchor,sourcesIn(note.querySelector(':scope > .media-container')),'post');\n      note.querySelectorAll('.note-content img,.comment-item img').forEach(image=> {\n        if(ignoreInlineImage(image)) return;\n        const item=imageSource(image);\n        if(!item) { groups.get(image)?.node.remove(); groups.delete(image); image.removeAttribute('data-xc-thumb-source'); markedImages.delete(image); return; }\n        image.setAttribute('data-xc-thumb-source',''); markedImages.add(image);\n        group(image,image,[item],'inline');\n      });\n    }\n    for(const [owner,record] of groups) if(!owner.isConnected) { if(record.node.contains(trigger)) closePreview(); record.node.remove(); groups.delete(owner); }\n    for(const image of markedImages) if(!image.isConnected) markedImages.delete(image);\n    if(expanded) closePreview();\n  }\n  function clear() {\n    closePreview();\n    document.querySelectorAll(owned).forEach(node=>node.remove());\n    document.querySelectorAll('[data-xc-thumb-source]').forEach(node=>node.removeAttribute('data-xc-thumb-source'));\n    commentBlocks.clear(); groups.clear(); markedImages.clear(); popup=null; previewImage=null;\n  }\n  document.addEventListener('keydown',event=> {\n    if(event.key==='Escape' && popup && !popup.hidden) { event.preventDefault(); event.stopImmediatePropagation(); closePreview(true); }\n  },true);\n  document.addEventListener('scroll',()=> { if(popup && !popup.hidden && !pinned) closePreview(); },{capture:true,passive:true});\n  addEventListener('resize',()=>closePreview());\n  document.addEventListener('load',event=> {\n    if(event.target instanceof HTMLImageElement && event.target.closest('#app') && !event.target.closest(owned) && canPreview()) requestUpdate();\n  },true);\n  return {update,clear,closePreview};\n}\n","style.css":"/* Palette derived from czm15053/linuxdo-idea-ui, MIT. */\nhtml[data-xc-enabled=\"true\"] {\n  --xc-side: 244px; --xc-bg: #f7f7f8; --xc-panel: #fff; --xc-rail: #eff0f1;\n  --xc-text: #1b1c1e; --xc-muted: #626367; --xc-line: #dedfe1; --xc-hover: #e4e5e7;\n  --xc-focus: #1670d8; --xc-code: #1c7d28; --xc-selection: #c5e1ff;\n  color-scheme: light; background: var(--xc-bg) !important;\n}\nhtml[data-xc-enabled=\"true\"][data-xc-theme=\"dark\"] {\n  --xc-bg: #1e1f20; --xc-panel: #262728; --xc-rail: #242526;\n  --xc-text: #ececec; --xc-muted: #b9b9b9; --xc-line: #3b3c3e; --xc-hover: #343536;\n  --xc-focus: #83c3fe; --xc-code: #78cf70; --xc-selection: #34506b; color-scheme: dark;\n}\nhtml[data-xc-enabled=\"true\"][data-xc-collapsed=\"true\"] { --xc-side: 0px; }\nhtml[data-xc-enabled=\"true\"] body { margin: 0 !important; color: var(--xc-text) !important; background: var(--xc-bg) !important; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif; }\nhtml[data-xc-enabled=\"true\"] ::selection { background: var(--xc-selection); color: var(--xc-text); }\nhtml[data-xc-enabled=\"true\"] :focus-visible { outline: 2px solid var(--xc-focus) !important; outline-offset: 3px; }\nhtml[data-xc-enabled=\"true\"] * { scrollbar-color: var(--xc-muted) var(--xc-bg); scrollbar-width: thin; }\n#xc-shell, #xc-shell *, #xc-restore { box-sizing: border-box; }\n#xc-shell { color: var(--xc-text); font: 14px/1.5 -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif; }\n#xc-shell svg { width: 18px; height: 18px; flex: 0 0 18px; vertical-align: middle; }\n#xc-shell button, #xc-shell a { font: inherit; color: inherit; cursor: pointer; text-decoration: none; }\n#xc-shell button { border: 0; background: transparent; }\n#xc-shell button:hover, #xc-shell a:hover { background: var(--xc-hover); }\n#xc-shell button:disabled { cursor: default; opacity: .5; }\n#xc-shell button[hidden], #xc-shell [hidden] { display: none !important; }\n#xc-shell .xc-icon { display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; padding: 0; border-radius: 8px; }\n#xc-topbar { position: fixed; inset: 0 0 auto 0; height: 53px; z-index: 100005; display: flex; align-items: center; gap: 10px; padding: 0 18px; background: var(--xc-bg); border-bottom: 1px solid var(--xc-line); }\n#xc-topbar .xc-brand { display: flex; align-items: center; gap: 9px; width: 187px; font-weight: 600; }\n#xc-topbar .xc-brand svg { width: 24px; height: 24px; }\n#xc-topbar .xc-crumb { color: var(--xc-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n#xc-topbar .xc-spacer { flex: 1; }\n#xc-topbar .xc-tool { display: inline-flex; align-items: center; gap: 7px; padding: 6px 10px; border-radius: 8px; white-space: nowrap; }\n#xc-sidebar { position: fixed; left: 0; top: 53px; bottom: 0; z-index: 100004; width: 244px; padding: 24px 14px 14px; background: var(--xc-rail); border-right: 1px solid var(--xc-line); display: flex; flex-direction: column; gap: 4px; }\nhtml[data-xc-collapsed=\"true\"] #xc-sidebar { display: none; }\n#xc-sidebar .xc-nav { display: flex; width: 100%; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; text-align: left; }\n#xc-sidebar .xc-nav[aria-current=\"page\"] { background: var(--xc-hover); font-weight: 500; }\n#xc-sidebar .xc-section { color: var(--xc-muted); font-size: 12px; margin: 26px 12px 7px; }\n#xc-sidebar .xc-project { font-weight: 500; }\n#xc-sidebar .xc-note { margin: 4px 0 4px 20px; padding-left: 12px; border-left: 1px solid var(--xc-line); }\n#xc-sidebar .xc-note a { display: block; padding: 8px 10px; border-radius: 6px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: var(--xc-muted); font-size: 12px; }\n#xc-recent-empty { display: block; padding: 8px 10px; color: var(--xc-muted); font-size: 12px; }\n#xc-sidebar .xc-bottom { margin-top: auto; padding-top: 24px; }\n#xc-sidebar kbd { margin-left: auto; font: 11px ui-monospace, Consolas, monospace; color: var(--xc-muted); }\n#xc-help { margin: 10px 12px 0; font-size: 11px; color: var(--xc-muted); }\n#xc-status { position: fixed; bottom: 0; right: 0; left: var(--xc-side); height: 27px; display: flex; align-items: center; justify-content: space-between; padding: 0 22px; z-index: 100003; border-top: 1px solid var(--xc-line); background: var(--xc-bg); font-size: 11px; color: var(--xc-muted); }\n#xc-status span { display: inline-flex; align-items: center; gap: 7px; }\n#xc-status svg { width: 13px; height: 13px; flex-basis: 13px; }\n#xc-restore { position: fixed; left: 16px; bottom: 16px; z-index: 2147483647; color: #fff; background: #262728; border: 1px solid #777; border-radius: 9px; padding: 9px 14px; cursor: pointer; font: 13px/1.5 sans-serif; }\nhtml[data-xc-enabled=\"true\"] #xc-restore { display: none; }\nhtml:not([data-xc-enabled=\"true\"]) #xc-shell { display: none; }\n/* Keep the original Vue nodes and event handlers in place. */\nhtml[data-xc-enabled=\"true\"] #global { width: 100% !important; max-width: none !important; min-width: 0 !important; margin: 0 !important; padding: 0 !important; background: var(--xc-bg) !important; }\nhtml[data-xc-enabled=\"true\"] #global > .main-container { display: block !important; width: 100% !important; padding: 0 !important; }\nhtml[data-xc-enabled=\"true\"] #global .side-bar, html[data-xc-enabled=\"true\"] #global .main-content > .footer, html[data-xc-enabled=\"true\"] .floating-btn-container, html[data-xc-enabled=\"true\"] .floating-btn-sets, html[data-xc-enabled=\"true\"] .back-top { display: none !important; }\nhtml[data-xc-enabled=\"true\"] #global .main-content { display: block !important; position: relative !important; width: auto !important; min-width: 0 !important; max-width: none !important; height: auto !important; overflow: visible !important; margin: 0 0 0 var(--xc-side) !important; padding: 0 38px !important; background: var(--xc-bg) !important; }\nhtml[data-xc-enabled=\"true\"] #global .feeds-page, html[data-xc-enabled=\"true\"] #global .search-page { width: 100% !important; max-width: 860px !important; min-width: 0 !important; margin: 0 auto !important; padding: 58px 0 30px !important; }\n.xc-intro { text-align: center; padding-top: 34px; margin-bottom: 130px; color: var(--xc-text); }\n.xc-intro h1 { font-size: 28px; line-height: 1.3; letter-spacing: -.025em; font-weight: 600; margin: 0; }\n.xc-intro p { font-size: 13px; color: var(--xc-muted); margin: 9px 0 0; }\nhtml[data-xc-enabled=\"true\"] #global .header-container { position: static !important; width: auto !important; height: 0 !important; min-height: 0 !important; background: transparent !important; border: 0 !important; box-shadow: none !important; }\nhtml[data-xc-enabled=\"true\"] #global .header-container > header { position: absolute !important; top: calc(166px - var(--xc-feed-scroll, 0px)) !important; left: calc(var(--xc-side) + (100% - var(--xc-side)) / 2) !important; transform: translateX(-50%) !important; display: block !important; width: min(700px, calc(100% - var(--xc-side) - 76px)) !important; min-width: 0 !important; height: 62px !important; padding: 0 !important; margin: 0 !important; border: 0 !important; box-shadow: none !important; background: transparent !important; z-index: 10 !important; }\nhtml[data-xc-enabled=\"true\"] #global .header-container > header > :not(.input-box) { display: none !important; }\nhtml[data-xc-enabled=\"true\"] #global header .input-box { box-sizing: border-box !important; display: flex !important; align-items: center; width: 100% !important; height: 62px !important; padding: 0 16px !important; border: 1px solid var(--xc-line) !important; border-radius: 14px !important; background: var(--xc-panel) !important; }\nhtml[data-xc-enabled=\"true\"] #global header .search-input { width: 100% !important; min-width: 0 !important; height: 100% !important; padding: 0 !important; color: var(--xc-text) !important; caret-color: var(--xc-text); font: inherit !important; font-size: 14px !important; background: transparent !important; }\nhtml[data-xc-enabled=\"true\"] #global header .search-input::placeholder { color: var(--xc-muted) !important; opacity: 1; }\nhtml[data-xc-enabled=\"true\"] #global header .search-icon { filter: grayscale(1); }\nhtml[data-xc-enabled=\"true\"][data-xc-theme=\"dark\"] #global header .search-icon { filter: grayscale(1) invert(1); }\nhtml[data-xc-enabled=\"true\"] #global .channel-container { position: sticky !important; top: 53px !important; z-index: 9 !important; width: 100% !important; margin: 0 !important; padding: 10px 0 !important; background: var(--xc-bg) !important; border-bottom: 1px solid var(--xc-line); }\nhtml[data-xc-enabled=\"true\"] #global #channel-container { width: 100% !important; height: 37px !important; padding: 0 !important; background: transparent !important; }\nhtml[data-xc-enabled=\"true\"] #global .channel { padding: 7px 12px !important; height: auto !important; margin: 0 3px 0 0 !important; border-radius: 7px !important; font-size: 12px !important; color: var(--xc-muted) !important; background: transparent !important; }\nhtml[data-xc-enabled=\"true\"] #global .channel.active { color: var(--xc-text) !important; background: var(--xc-hover) !important; font-weight: 500; }\nhtml[data-xc-enabled=\"true\"] #global .feeds-container { display: block !important; position: relative !important; width: 100% !important; height: auto !important; min-height: 140px; padding: 0 !important; margin: 0 !important; }\nhtml[data-xc-enabled=\"true\"] #global .feeds-container .note-item { display: block !important; position: relative !important; inset: auto !important; width: 100% !important; height: auto !important; transform: none !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; border-radius: 0 !important; border-bottom: 1px solid var(--xc-line); background: transparent !important; }\nhtml[data-xc-enabled=\"true\"] #global .note-item:hover { background: var(--xc-panel) !important; }\nhtml[data-xc-enabled=\"true\"] #global .note-item::before { content: ''; position: absolute; top: 23px; left: 9px; width: 11px; height: 11px; border: 1.5px solid var(--xc-muted); border-radius: 50%; pointer-events: none; }\nhtml[data-xc-enabled=\"true\"] #global .note-item .cover { display: none !important; }\nhtml[data-xc-enabled=\"true\"] #global .note-item .footer { padding: 16px 16px 14px 38px !important; margin: 0 !important; }\nhtml[data-xc-enabled=\"true\"] #global .note-item .title { display: block !important; margin: 0 0 7px !important; font-size: 14px !important; font-weight: 500 !important; line-height: 1.6 !important; color: var(--xc-text) !important; overflow: visible !important; overflow-wrap: anywhere; -webkit-line-clamp: unset !important; }\nhtml[data-xc-enabled=\"true\"] #global .note-item :is(.author-wrapper,.card-bottom-wrapper) { display: flex !important; width: 100% !important; margin: 0 !important; gap: 14px; font-size: 11px !important; line-height: 1.5 !important; color: var(--xc-muted) !important; }\nhtml[data-xc-enabled=\"true\"] #global .note-item .author { display: inline-flex !important; max-width: 75%; color: var(--xc-muted) !important; }\nhtml[data-xc-enabled=\"true\"] #global .note-item .author .name { font-size: 11px !important; color: var(--xc-muted) !important; }\nhtml[data-xc-enabled=\"true\"] #global .note-item .avatar-container, html[data-xc-enabled=\"true\"] #global .note-item .author-avatar { display: none !important; }\nhtml[data-xc-enabled=\"true\"] #global .note-item .like-wrapper { margin-left: auto; color: var(--xc-muted) !important; }\nhtml[data-xc-enabled=\"true\"] #global .note-item .like-wrapper svg { width: 12px; height: 12px; color: var(--xc-muted) !important; }\n/* Native detail keeps its comments, editor, follow, like and collect handlers. */\nhtml[data-xc-enabled=\"true\"] .note-detail-mask { position: fixed !important; inset: 53px 0 27px var(--xc-side) !important; width: auto !important; height: auto !important; background: var(--xc-bg) !important; display: flex !important; justify-content: center; z-index: 100000 !important; transition: none !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer { position: relative !important; display: flex !important; flex-direction: row !important; top: 0 !important; left: 0 !important; width: min(100%, 1100px) !important; height: 100% !important; max-height: none !important; min-width: 0 !important; transform: none !important; border-radius: 0 !important; box-shadow: none !important; background: var(--xc-bg) !important; color: var(--xc-text) !important; overflow: hidden !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer > .author { display: none !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .interaction-container { flex: 1 !important; width: 100% !important; min-width: 0 !important; max-width: 820px !important; margin: 0 auto !important; height: 100% !important; border: 0 !important; color: var(--xc-text) !important; background: var(--xc-bg) !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .note-scroller { padding: 12px 36px 26px !important; background: var(--xc-bg) !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .author-container { display: flex !important; padding: 20px 36px !important; height: auto !important; border-bottom: 1px solid var(--xc-line) !important; background: var(--xc-bg) !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer :is(.author-container,.comments-container) :is(.avatar,.avatar-container) { visibility: hidden; width: 12px !important; height: 12px !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer #detail-title { color: var(--xc-text) !important; font-size: 22px !important; line-height: 1.5 !important; margin-bottom: 20px !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer :is(.desc,.content,.name,.username) { color: var(--xc-text) !important; overflow-wrap: anywhere; }\nhtml[data-xc-enabled=\"true\"] #noteContainer :is(.date,.total,.bottom-container,.like-wrapper,.count,.note-text) { color: var(--xc-muted) !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .interactions.engage-bar { background: var(--xc-bg) !important; border-top: 1px solid var(--xc-line) !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .content-edit { background: var(--xc-panel) !important; color: var(--xc-text) !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer :is(.follow-button,.submit) { background: var(--xc-text) !important; border-color: var(--xc-text) !important; color: var(--xc-bg) !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer > .media-container { display: none !important; }\nhtml[data-xc-enabled=\"true\"][data-xc-media=\"show\"] #noteContainer > .media-container { display: block !important; flex: 0 0 48%; width: 48% !important; min-width: 0 !important; height: 100% !important; background: var(--xc-panel) !important; }\n\nhtml[data-xc-enabled=\"true\"] .note-detail-mask :is(.close-circle,.close-box) { display: none !important; }\nhtml[data-xc-enabled=\"true\"] .note-detail-mask :is(.divider,.interaction-divider) { background: var(--xc-line) !important; }\nhtml[data-xc-enabled=\"true\"] #global .user-page { width: 100% !important; max-width: 860px !important; min-width: 0 !important; margin: 0 auto !important; padding-top: 250px !important; color: var(--xc-text); }\nhtml[data-xc-enabled=\"true\"] #global .user-page :is(img,.user-image,.user-avatar) { visibility: hidden; }\n/* Login and verification remain above the camouflage UI. */\nhtml[data-xc-enabled=\"true\"] :is(.login-modal,.reds-modal-open,.captcha-mask,.captcha-container) { z-index: 100100 !important; }\n#xc-panic { display: none; position: fixed; inset: 53px 0 27px var(--xc-side); z-index: 100002; background: var(--xc-bg); align-items: center; justify-content: center; flex-direction: column; }\n#xc-panic h1 { font-size: 28px; font-weight: 500; letter-spacing: -.025em; margin: 18px 0 8px; }\n#xc-panic p { color: var(--xc-muted); font-size: 13px; margin: 0; }\n#xc-panic pre { margin-top: 36px; padding: 22px 30px; color: var(--xc-muted); background: var(--xc-panel); border-radius: 12px; font: 13px/1.8 ui-monospace, Consolas, monospace; max-width: calc(100% - 32px); overflow: auto; }\nhtml[data-xc-panic=\"true\"] body > :not(#xc-shell) { visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; }\nhtml[data-xc-panic=\"true\"] #xc-panic { display: flex; }\nhtml[data-xc-panic=\"true\"] :is(#xc-recent,#xc-back,#xc-media,#xc-count) { visibility: hidden; }\nhtml[data-xc-panic=\"true\"] #xc-sidebar .xc-project { font-size: 0; }\nhtml[data-xc-panic=\"true\"] #xc-sidebar .xc-project::after { content: 'workspace'; font-size: 14px; }\n@media (max-width: 900px) {\n  html[data-xc-enabled=\"true\"] { --xc-side: 0px; }\n  #xc-topbar .xc-brand { width: auto; }\n  #xc-sidebar { width: 244px; box-shadow: 12px 4px 32px rgba(0,0,0,.15); }\n  html[data-xc-collapsed=\"false\"] #xc-sidebar { display: flex; }\n  html[data-xc-enabled=\"true\"] #global .main-content { padding-right: 22px !important; padding-left: 22px !important; }\n  html[data-xc-enabled=\"true\"] #global .header-container { position: static !important; width: auto !important; height: 0 !important; min-height: 0 !important; background: transparent !important; border: 0 !important; box-shadow: none !important; }\nhtml[data-xc-enabled=\"true\"] #global .header-container > header { width: calc(100% - 44px) !important; }\n}\n@media (max-width: 540px) {\n  #xc-topbar { gap: 6px; padding: 0 10px; }\n  #xc-topbar .xc-crumb, #xc-topbar .xc-tool span { display: none; }\n  #xc-topbar .xc-tool { padding: 7px; }\n  #xc-status { padding: 0 12px; }\n  #xc-status span:last-child { display: none; }\n  .xc-intro h1 { font-size: 24px; }\n  html[data-xc-enabled=\"true\"] #global .main-content { padding-right: 14px !important; padding-left: 14px !important; }\n  html[data-xc-enabled=\"true\"] #global .header-container { position: static !important; width: auto !important; height: 0 !important; min-height: 0 !important; background: transparent !important; border: 0 !important; box-shadow: none !important; }\nhtml[data-xc-enabled=\"true\"] #global .header-container > header { width: calc(100% - 28px) !important; }\n  html[data-xc-enabled=\"true\"] #noteContainer { flex-direction: column !important; overflow: auto !important; }\n  html[data-xc-enabled=\"true\"][data-xc-media=\"show\"] #noteContainer > .media-container { flex: 0 0 42vh; width: 100% !important; height: 42vh !important; }\n  html[data-xc-enabled=\"true\"] #noteContainer .interaction-container { flex: 1 0 75vh !important; }\n  html[data-xc-enabled=\"true\"] #noteContainer .note-scroller { padding: 12px 18px 24px !important; }\n  html[data-xc-enabled=\"true\"] #noteContainer .author-container { display: flex !important; padding: 16px 18px !important; }\n}\n@media (prefers-reduced-motion: reduce) { #xc-shell *, .xc-intro { animation: none !important; transition: none !important; } }\n\nhtml[data-xc-enabled=\"true\"] #global .feeds-container .note-item[hidden] { display: none !important; }\n\n/* Preserve the native feed scrolling target used by lazy loading. */\nhtml[data-xc-enabled=\"true\"] #global :is(.feeds-page,.search-page) { box-sizing: border-box !important; height: calc(100vh - 27px) !important; overflow-y: auto !important; overflow-x: hidden !important; padding-bottom: 54px !important; }\n\nhtml[data-xc-enabled=\"true\"] #channel-container { scrollbar-width: none !important; }\nhtml[data-xc-enabled=\"true\"] #channel-container::-webkit-scrollbar { display: none; }\n\nhtml[data-xc-enabled=\"true\"] #global .note-item .name-time-wrapper { display: flex; align-items: center; gap: 10px; }\nhtml[data-xc-enabled=\"true\"] #global .note-item .time { font-size: 11px !important; color: var(--xc-muted) !important; }\nhtml[data-xc-enabled=\"true\"] #global :is(.tag-search-page-sticky,.tag-search-page-sticky .reds-sticky,.tab-scroll-container) { background: var(--xc-bg) !important; }\nhtml[data-xc-enabled=\"true\"] #global .tab-scroll-container { scrollbar-width: none !important; padding: 8px 0 12px; }\nhtml[data-xc-enabled=\"true\"] #global .tab-scroll-container::-webkit-scrollbar { display: none; }\nhtml[data-xc-enabled=\"true\"] #global .tab-scroll-container .tab { color: var(--xc-muted) !important; background: transparent !important; font-size: 12px !important; border-radius: 7px !important; height: 32px !important; padding: 4px 12px !important; }\nhtml[data-xc-enabled=\"true\"] #global .tab-scroll-container .tab.active { color: var(--xc-text) !important; background: var(--xc-hover) !important; }\n\nhtml[data-xc-enabled=\"true\"] #global .search-layout__top .filter,\nhtml[data-xc-enabled=\"true\"] #global .search-layout__top .filter span,\nhtml[data-xc-enabled=\"true\"] #global header .close-icon { color: var(--xc-text) !important; }\nhtml[data-xc-enabled=\"true\"] #global .search-layout__top .filter svg,\nhtml[data-xc-enabled=\"true\"] #global header .close-icon svg { color: var(--xc-text) !important; fill: currentColor !important; }\nhtml[data-xc-enabled=\"true\"][data-xc-media=\"hide\"] #pagination-teleport-container { display: none !important; }\n\n/* Codex split workspace: conversation on the left, real project source on the right. */\nhtml[data-xc-enabled=\"true\"] {\n  --xc-side: 276px;\n  --xc-editor-size: clamp(360px, 38vw, 760px);\n  --xc-editor-width: var(--xc-editor-size);\n  --xc-tab: #ebebed;\n  --xc-code-text: #33363b;\n  --xc-code-comment: #70756f;\n  --xc-code-keyword: #a94c0a;\n  --xc-code-string: #267235;\n  --xc-code-number: #734fb0;\n  --xc-code-property: #246ba1;\n  --xc-gutter: #787c80;\n  --xc-rail-strip: #e4e5e7;\n  --xc-mono: ui-monospace, \"SFMono-Regular\", Consolas, \"Liberation Mono\", monospace;\n}\nhtml[data-xc-enabled=\"true\"][data-xc-theme=\"dark\"] {\n  --xc-tab: #171819;\n  --xc-code-text: #cfcfcf;\n  --xc-code-comment: #96a18f;\n  --xc-code-keyword: #f0954e;\n  --xc-code-string: #90ce83;\n  --xc-code-number: #bb8fe4;\n  --xc-code-property: #83c3fe;\n  --xc-gutter: #929599;\n  --xc-rail-strip: #1a1b1c;\n}\nhtml[data-xc-editor=\"false\"] { --xc-editor-width: 0px; }\nhtml[data-xc-collapsed=\"true\"] { --xc-side: 40px; }\n#xc-topbar { left: 40px; right: var(--xc-editor-width); padding: 0 12px; height: 45px; font-size: 12px; }\n#xc-topbar .xc-brand { width: 184px; }\n#xc-topbar .xc-tool { padding: 6px; gap: 5px; }\n#xc-topbar .xc-brand svg { width: 18px; height: 18px; }\n#xc-sidebar { top: 45px; left: 40px; width: 236px; padding-top: 14px; font-size: 12px; }\n#xc-sidebar .xc-nav { padding: 8px 10px; }\n#xc-sidebar .xc-note a { font-size: 11px; }\n#xc-sidebar .xc-section { margin-top: 20px; }\n#xc-activity-rail { position: fixed; inset: 0 auto 0 0; width: 40px; padding: 8px 3px; background: var(--xc-rail-strip); display: flex; align-items: center; flex-direction: column; gap: 10px; z-index: 100008; border-right: 1px solid var(--xc-line); }\n#xc-activity-rail .xc-icon { width: 32px; height: 32px; border-radius: 7px; }\n#xc-editor { position: fixed; inset: 0 0 27px auto; width: var(--xc-editor-width); display: flex; flex-direction: column; min-width: 0; border-left: 1px solid var(--xc-line); background: var(--xc-bg); z-index: 100006; }\nhtml[data-xc-editor=\"false\"] #xc-editor { display: none; }\n#xc-file-tabs { display: flex; flex-shrink: 0; height: 45px; align-items: end; gap: 2px; padding: 0 8px; background: var(--xc-tab); border-bottom: 1px solid var(--xc-line); overflow: hidden; }\n#xc-file-tabs > button[role=\"tab\"] { min-width: 0; flex-shrink: 1; padding: 8px 10px; height: 36px; color: var(--xc-muted); font: 11px/1.5 var(--xc-mono); border-radius: 7px 7px 0 0; white-space: nowrap; }\n#xc-file-tabs > button[aria-selected=\"true\"] { color: var(--xc-text); background: var(--xc-bg); }\n#xc-file-tabs > #xc-editor-close { margin: 0 0 4px auto; flex-shrink: 0; }\n#xc-code-crumb { display: flex; align-items: center; gap: 6px; min-height: 37px; padding: 0 10px 0 15px; border-bottom: 1px solid var(--xc-line); color: var(--xc-muted); font-size: 11px; }\n#xc-code-crumb > span:first-child { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n#xc-code-crumb b { font-weight: 400; color: var(--xc-text); }\n#xc-code-crumb .xc-spacer { flex: 1; }\n#xc-code-wrap { padding: 4px 7px; font-size: 10px !important; border-radius: 5px; white-space: nowrap; }\n#xc-code-wrap[aria-pressed=\"true\"] { background: var(--xc-hover); color: var(--xc-text); }\n#xc-code-crumb .xc-icon { width: 26px; height: 26px; }\n#xc-code-crumb svg { width: 14px; height: 14px; }\n#xc-code-body { flex: 1; min-height: 0; overflow: auto; padding: 12px 0 30px; color: var(--xc-code-text); background: var(--xc-bg); font: 11.5px/1.85 var(--xc-mono); tab-size: 2; }\n.xc-source-line { display: flex; min-width: max-content; }\n.xc-source-line:hover { background: var(--xc-hover); }\n.xc-line-number { display: block; flex: 0 0 46px; width: 46px; text-align: right; padding-right: 14px; color: var(--xc-gutter); font-variant-numeric: tabular-nums; user-select: none; }\n.xc-line-code { display: block; flex: 1; padding-right: 24px; min-height: 1.85em; white-space: pre; }\n.xc-code-wrapped .xc-source-line { min-width: 0; }\n.xc-code-wrapped .xc-line-code { white-space: pre-wrap; overflow-wrap: anywhere; min-width: 0; }\n.xc-token-keyword { color: var(--xc-code-keyword); }\n.xc-token-string { color: var(--xc-code-string); }\n.xc-token-comment { color: var(--xc-code-comment); }\n.xc-token-number { color: var(--xc-code-number); }\n.xc-token-property { color: var(--xc-code-property); }\n#xc-code-footer { display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; height: 26px; padding: 0 14px; border-top: 1px solid var(--xc-line); color: var(--xc-muted); font: 10px/1.5 var(--xc-mono); }\nhtml[data-xc-enabled=\"true\"] #global .main-content { margin-right: var(--xc-editor-width) !important; padding: 0 24px !important; }\nhtml[data-xc-enabled=\"true\"] #global :is(.feeds-page,.search-page) { padding-top: 72px !important; padding-bottom: 160px !important; }\nhtml[data-xc-enabled=\"true\"] #global .channel-container { top: 45px !important; }\nhtml[data-xc-enabled=\"true\"] #global .channel { padding: 5px 9px !important; font-size: 11px !important; }\n.xc-agent-flow { text-align: left; padding: 0; margin: 0 0 30px; color: var(--xc-text); }\n.xc-agent-heading { display: flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 400; color: var(--xc-muted); margin-bottom: 12px; }\n.xc-agent-heading svg { width: 14px; height: 14px; fill: none; stroke: var(--xc-focus); stroke-width: 1.5; }\n.xc-agent-flow p, .xc-agent-step p { margin: 0 0 12px; color: var(--xc-muted); font: 12px/1.7 -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif; }\n.xc-flow-code { box-sizing: border-box; max-width: 100%; overflow: auto; background: var(--xc-panel); color: var(--xc-code-text); border-radius: 9px; margin: 0 0 12px; padding: 12px 14px; font: 11px/1.85 var(--xc-mono); tab-size: 2; }\n.xc-flow-code code { font: inherit; color: inherit; background: transparent; padding: 0; white-space: pre; }\n.xc-flow-code-small { border-radius: 0; padding: 2px 0; background: transparent; margin-bottom: 10px; }\n.xc-flow-summary { color: var(--xc-muted); font-size: 10px; line-height: 1.6; }\nhtml[data-xc-enabled=\"true\"] #global .feeds-container .note-item { border-bottom: 0; margin-bottom: 30px !important; }\nhtml[data-xc-enabled=\"true\"] #global .note-item:hover { background: transparent !important; }\nhtml[data-xc-enabled=\"true\"] #global .note-item::before { display: none; }\nhtml[data-xc-enabled=\"true\"] #global .note-item .footer { padding: 0 !important; }\nhtml[data-xc-enabled=\"true\"] #global .note-item .title { font-size: 13px !important; font-weight: 400 !important; margin-bottom: 8px !important; }\nhtml[data-xc-enabled=\"true\"] #global .header-container > header { position: fixed !important; top: auto !important; bottom: 46px !important; left: calc(var(--xc-side) + (100% - var(--xc-side) - var(--xc-editor-width)) / 2) !important; width: min(500px, calc(100% - var(--xc-side) - var(--xc-editor-width) - 48px)) !important; height: 80px !important; z-index: 100002 !important; }\nhtml[data-xc-enabled=\"true\"] #global header .input-box { height: 80px !important; padding: 0 16px 18px !important; border-radius: 14px !important; background: var(--xc-panel) !important; box-shadow: 0 10px 28px rgba(0,0,0,.08); }\nhtml[data-xc-enabled=\"true\"] #global header .input-box::after { content: 'Local workspace  ·  Enter 搜索'; position: absolute; left: 16px; bottom: 10px; color: var(--xc-muted); font: 10px/1.4 var(--xc-mono); pointer-events: none; }\nhtml[data-xc-enabled=\"true\"] #global header .search-input { font-size: 12px !important; }\nhtml[data-xc-enabled=\"true\"] .note-detail-mask { top: 45px !important; right: var(--xc-editor-width) !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .author-container { padding: 15px 24px !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .note-scroller { padding: 20px 24px 110px !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer #detail-title { font-size: 17px !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .note-content { font-size: 13px !important; line-height: 1.85 !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .interactions.engage-bar { position: relative; z-index: 100003; }\n#xc-panic { top: 45px; right: var(--xc-editor-width); }\n@media (max-width: 1300px) { #xc-topbar .xc-brand { width: auto; } #xc-topbar .xc-crumb { display: none; } }\n@media (max-width: 1200px) { #xc-topbar .xc-tool span { display: none; } }\n@media (max-width: 1100px) {\n  html[data-xc-enabled=\"true\"], html[data-xc-collapsed=\"true\"] { --xc-side: 0px; }\n  #xc-activity-rail { display: none; }\n  #xc-sidebar { left: 0; width: 244px; }\n  #xc-topbar { left: 0; }\n  html[data-xc-collapsed=\"false\"] #xc-sidebar { display: flex; }\n}\n@media (max-width: 1000px) {\n  html[data-xc-enabled=\"true\"] { --xc-editor-width: 0px; }\n  #xc-editor { display: none; }\n  html[data-xc-editor-overlay=\"true\"] #xc-editor { display: flex; top: 45px; width: 100%; }\n  #xc-topbar { right: 0; }\n}\n@media (max-width: 540px) {\n  html[data-xc-enabled=\"true\"] #global .main-content { padding: 0 18px !important; }\n  html[data-xc-enabled=\"true\"] #global .header-container > header { width: calc(100% - 36px) !important; bottom: 42px !important; }\n  #xc-code-crumb { font-size: 10px; }\n  #xc-code-body { font-size: 11px; }\n  html[data-xc-enabled=\"true\"] #noteContainer .note-scroller { padding: 18px 18px 115px !important; }\n}\n\nhtml[data-xc-enabled=\"true\"][data-xc-collapsed=\"true\"] { --xc-side: 40px; }\n@media (max-width: 1100px) { html[data-xc-enabled=\"true\"][data-xc-collapsed=\"true\"] { --xc-side: 0px; } }\n\n/* The detail page uses its own native comment composer. */\nhtml[data-xc-enabled=\"true\"][data-xc-detail=\"true\"] #global .header-container > header { display: none !important; }\n@media (min-width: 541px) and (max-width: 1500px) {\n  html[data-xc-enabled=\"true\"][data-xc-editor=\"true\"][data-xc-media=\"show\"] #noteContainer { flex-direction: column !important; }\n  html[data-xc-enabled=\"true\"][data-xc-editor=\"true\"][data-xc-media=\"show\"] #noteContainer > .media-container { flex: 0 0 32%; width: 100% !important; height: 32% !important; }\n  html[data-xc-enabled=\"true\"][data-xc-editor=\"true\"][data-xc-media=\"show\"] #noteContainer .interaction-container { flex: 1 1 0 !important; height: 0 !important; min-height: 0 !important; }\n}\n\n/* Constrain the native reader so the comment bar stays in the visible column. */\nhtml[data-xc-enabled=\"true\"] #noteContainer .interaction-container { display: flex !important; flex-direction: column !important; min-height: 0 !important; overflow: hidden !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .author-container { position: relative !important; flex: 0 0 auto !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .note-scroller { flex: 1 1 0 !important; min-height: 0 !important; overflow-y: auto !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .interactions.engage-bar { flex: 0 0 auto !important; min-height: 72px !important; box-sizing: border-box !important; }\n/* Native mobile navigation yields to the workspace controls while enabled. */\nhtml[data-xc-enabled=\"true\"] #app .bottom-menu { display: none !important; }\n\n/* Comment reasoning uses the thread's prose rhythm while preserving native replies. */\nhtml[data-xc-enabled=\"true\"] #noteContainer .comment-item .right { min-width: 0; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .comment-item .author-wrapper { margin-bottom: 12px; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .comment-item .content { color: var(--xc-text) !important; font-size: 13px !important; line-height: 1.85 !important; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .comment-item .info { margin-top: 12px; color: var(--xc-muted) !important; }\n.xc-comment-workflow { margin: 8px 0 14px; color: var(--xc-muted); font: 12px/1.8 -apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif; }\n.xc-comment-workflow summary { display: flex; align-items: center; gap: 8px; width: fit-content; list-style: none; cursor: pointer; color: var(--xc-muted); }\n.xc-comment-workflow summary::-webkit-details-marker { display: none; }\n.xc-comment-workflow summary > svg { width: 14px; height: 14px; fill: none; stroke: var(--xc-focus); stroke-width: 1.8; }\n.xc-work-chevron { display: inline-flex; }\n.xc-work-chevron svg { width: 10px; height: 10px; fill: none; stroke: currentColor; stroke-width: 1.6; }\n.xc-comment-workflow:not([open]) .xc-work-chevron { transform: rotate(-90deg); }\n.xc-comment-process { border-left: 1px solid var(--xc-line); padding-left: 14px; margin-top: 10px; }\n.xc-comment-process p { margin: 0 0 18px; color: var(--xc-muted); }\n.xc-comment-process p:last-child { margin-bottom: 0; }\n/* Compact file-like image attachments; the original full-media view remains available. */\n.xc-media-thumbnails { display: flex; gap: 8px; overflow-x: auto; margin: 12px 0; padding-bottom: 4px; max-width: 100%; }\n.xc-thumbnail { flex: 0 0 168px; width: 168px; padding: 0; overflow: hidden; border: 1px solid var(--xc-line); border-radius: 8px; background: var(--xc-panel); color: var(--xc-muted); cursor: zoom-in; text-align: left; font: 10px/1.6 var(--xc-mono); }\n.xc-thumbnail img { display: block !important; visibility: visible !important; width: 100% !important; height: 84px !important; object-fit: contain !important; background: var(--xc-tab); }\n.xc-thumbnail-caption { display: block; padding: 3px 7px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.xc-thumbnail:hover { border-color: var(--xc-focus); }\n.xc-thumbnail-error { border-style: dashed; }\n.xc-feed-thumbnails .xc-thumbnail { flex-basis: 108px; width: 108px; }\n.xc-feed-thumbnails .xc-thumbnail img { height: 55px !important; }\n.xc-inline-thumbnails { display: inline-flex; vertical-align: top; }\n.xc-inline-thumbnails .xc-thumbnail { flex-basis: 148px; width: 148px; }\nhtml[data-xc-enabled=\"true\"][data-xc-media=\"hide\"] #noteContainer img[data-xc-thumb-source] { display: none !important; }\nhtml[data-xc-enabled=\"true\"][data-xc-media=\"hide\"] #noteContainer :is(.note-content,.comment-item) video { display: none !important; }\nhtml[data-xc-enabled=\"true\"][data-xc-media=\"show\"] #noteContainer .xc-media-thumbnails { display: none !important; }\n#xc-image-preview { position: fixed; z-index: 100200; box-sizing: border-box; padding: 0; overflow: hidden; border-radius: 9px; background: var(--xc-panel); box-shadow: 0 12px 38px rgba(0,0,0,.3); }\n#xc-image-preview[hidden] { display: none !important; }\n#xc-image-preview > img { display: block; width: 100%; height: auto; object-fit: contain; background: var(--xc-tab); }\n#xc-shell #xc-image-preview .xc-preview-close { position: absolute; right: 6px; top: 6px; width: 32px; height: 32px; padding: 7px; color: var(--xc-text); border-radius: 8px; background: var(--xc-panel); cursor: pointer; }\n#xc-image-preview .xc-preview-caption { padding: 6px 12px; min-height: 30px; color: var(--xc-muted); background: var(--xc-panel); font: 11px/1.6 var(--xc-mono); }\n@media (max-width: 540px) {\n  .xc-post-thumbnails .xc-thumbnail { flex-basis: 148px; width: 148px; }\n  .xc-comment-process { padding-left: 12px; }\n  .xc-comment-workflow { font-size: 12px; }\n}\n\nhtml[data-xc-enabled=\"true\"] #noteContainer .comment-item .content .note-text { color: var(--xc-text) !important; }\n\nhtml[data-xc-enabled=\"true\"][data-xc-media=\"hide\"] #noteContainer .img-box:has(> img[data-xc-thumb-source]) { width: auto !important; height: auto !important; overflow: visible !important; background: transparent !important; }\n\n@media (max-width: 540px) { #xc-shell #xc-image-preview .xc-preview-close { width: 44px; height: 44px; padding: 13px; } }\n\nhtml[data-xc-enabled=\"true\"][data-xc-media=\"hide\"] #noteContainer .img-box:has(> img[data-xc-thumb-source])::after { display: none !important; }\nhtml[data-xc-enabled=\"true\"][data-xc-media=\"hide\"] #noteContainer .comment-image-gallery:has(img[data-xc-thumb-source]) { display: flex !important; flex-wrap: wrap; gap: 8px !important; width: auto !important; max-width: 100% !important; height: auto !important; overflow: visible !important; }\nhtml[data-xc-enabled=\"true\"][data-xc-media=\"hide\"] #noteContainer .img-box:has(> img[data-xc-thumb-source]) { position: relative !important; inset: auto !important; margin: 0 !important; flex: 0 0 auto; }\nhtml[data-xc-enabled=\"true\"] #noteContainer .xc-inline-thumbnails { position: relative; z-index: 1; }\n"};
  const sidebarTopics = ['优化异步任务调度','重构上下文缓存模块','修复 WebSocket 重连','补充接口单元测试','整理工作区类型定义'];
  const html = document.documentElement;
  const icons = {
    codex: '<path d="m8 6-5 6 5 6M16 6l5 6-5 6M14 4l-4 16"/>',
    sidebar: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M9 4v16"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9H3Z"/>',
    user: '<circle cx="12" cy="8" r="3"/><path d="M5 21v-3a7 7 0 0 1 14 0v3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    shield: '<path d="m12 3 8 3v6c0 4-8 9-8 9s-8-5-8-9V6Z"/><path d="m8 12 3 3 5-6"/>',
    back: '<path d="m10 5-7 7 7 7M3 12h18"/>',
    external: '<path d="M14 3h7v7m0-7L10 14M10 3H4v17h17v-6"/>',
    sparkle: '<path d="M12 3v18M3 12h18M5.5 5.5l13 13M5.5 18.5l13-13"/>',
    chevron: '<path d="m7 10 5 5 5-5"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    code: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M14 4v16M6 8l3 3-3 3"/>',
    copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
    branch: '<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="6" r="2"/><path d="M6 7v10m0-4h6a6 6 0 0 0 6-5"/>'
  };
  const svg = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.folder}</svg>`;
  const reader = (function createReadingPresentation({ icon, requestUpdate, canPreview }) {
  const owned = '[data-xc-reader-owned]';
  const commentBlocks = new Map();
  const groups = new Map();
  const markedImages = new Set();
  let popup, previewImage, previewCaption, trigger, pinned = false, closeTimer, suppressFocus = false;
  const phrases = [
    ['First I’ll inspect the context and trace the relevant data flow.', 'The important detail is how the state changes between these steps.', 'Keep the change focused, then review the result against the original behavior.'],
    ['Start with the surrounding context before choosing an implementation.', 'Check the ordering: cleanup should happen after the pending work is complete.', 'A small, targeted change makes the next verification easier to follow.'],
    ['I’m following the execution path and checking the assumptions at each boundary.', 'Compare the inputs with the current state, then inspect the affected branch.', 'That leaves one clear next step: verify the result and keep the existing contract.'],
    ['Read the relevant context first, then look for the smallest useful change.', 'The retry path and the normal path should agree on the same state transition.', 'Review the edge case once more before moving on to the next task.'],
  ];
  function own(node) { node.setAttribute('data-xc-reader-owned', ''); return node; }
  function hash(value) { let n=2166136261; for(const c of value) n=Math.imul(n^c.charCodeAt(0),16777619); return n>>>0; }
  function commentContent(comment) {
    return [...comment.querySelectorAll('.content,.comment-content')].find(n=>n.closest('.comment-item')===comment);
  }
  function decorateComments(root) {
    root.querySelectorAll('.comment-item').forEach((comment,index)=> {
      const content=commentContent(comment);
      if(!content) return;
      const key=comment.id || `${index}:${content.textContent}`;
      const record=commentBlocks.get(comment);
      if(record?.block.isConnected && record.content===content && record.key===key) return;
      record?.block.remove();
      [...comment.querySelectorAll('.xc-comment-workflow')].filter(n=>n.closest('.comment-item')===comment).forEach(n=>n.remove());
      const seed=hash(key), seconds=3+(seed%27);
      const block=own(document.createElement('details')); block.className='xc-comment-workflow'; block.open=true;
      const summary=document.createElement('summary'); summary.innerHTML=icon('sparkle');
      const label=document.createElement('span'); label.textContent=`Worked for ${seconds}s`; summary.append(label);
      const chevron=document.createElement('span'); chevron.className='xc-work-chevron'; chevron.innerHTML=icon('chevron'); summary.append(chevron);
      const process=document.createElement('div'); process.className='xc-comment-process';
      for(const line of phrases[seed%phrases.length]) { const p=document.createElement('p'); p.textContent=line; process.append(p); }
      block.append(summary,process); content.before(block);
      commentBlocks.set(comment,{block,content,key});
    });
    for(const [comment,record] of commentBlocks) if(!comment.isConnected) { record.block.remove(); commentBlocks.delete(comment); }
  }
  function mediaURL(value) {
    if(!value) return '';
    try {
      const url=new URL(value,location.href);
      if(['https:','http:','blob:'].includes(url.protocol)) return url.href;
      if(url.protocol==='data:' && /^data:image\/(?:png|jpe?g|webp|gif|avif|svg\+xml)[;,]/i.test(value)) return value;
    } catch { /* An incomplete lazy image is picked up on its next update. */ }
    return '';
  }
  function imageSource(node,type='image') {
    const src=mediaURL(node.tagName==='VIDEO' ? node.getAttribute('poster') : (node.currentSrc || node.getAttribute('src') || node.getAttribute('data-src')));
    return src ? {src,type,width:node.naturalWidth||Number(node.getAttribute('width'))||0,height:node.naturalHeight||Number(node.getAttribute('height'))||0} : null;
  }
  function sourcesIn(container) {
    if(!container) return [];
    const result=[],seen=new Set();
    container.querySelectorAll('img,video[poster]').forEach(node=> {
      if(node.closest(owned)) return;
      const item=imageSource(node,node.tagName==='VIDEO'?'video':'image');
      if(item && !seen.has(item.src)) { seen.add(item.src); result.push(item); }
    });
    return result;
  }
  function dimensions(item) { return item.width && item.height ? `${item.width}×${item.height}` : '悬停放大'; }
  function createPopup() {
    if(popup?.isConnected) return;
    popup=own(document.createElement('div')); popup.id='xc-image-preview'; popup.hidden=true; popup.setAttribute('role','dialog'); popup.setAttribute('aria-label','图片预览');
    const close=document.createElement('button'); close.type='button'; close.className='xc-preview-close'; close.setAttribute('aria-label','关闭图片预览'); close.innerHTML=icon('close');
    close.addEventListener('click',()=>closePreview(true));
    previewImage=document.createElement('img'); previewImage.alt='放大的图片预览'; previewImage.decoding='async';
    previewCaption=document.createElement('div'); previewCaption.className='xc-preview-caption';
    popup.append(close,previewImage,previewCaption);
    popup.addEventListener('mouseenter',()=>clearTimeout(closeTimer));
    popup.addEventListener('mouseleave',()=> { if(!pinned) deferClose(); });
    document.getElementById('xc-shell').append(popup);
  }
  function positionPreview(button) {
    const box=button.getBoundingClientRect();
    const width=Math.min(900,innerWidth-32), maxHeight=Math.max(120,Math.min(650,innerHeight-96));
    const left=Math.max(16,Math.min(box.left,innerWidth-width-16));
    let top=box.bottom+8;
    if(top+maxHeight>innerHeight-16) top=Math.max(56,box.top-maxHeight-8);
    popup.style.left=`${left}px`; popup.style.top=`${Math.max(56,top)}px`; popup.style.width=`${width}px`;
    popup.style.maxHeight=`${maxHeight}px`;
    previewImage.style.maxHeight=`${Math.max(100,maxHeight-38)}px`;
  }
  function openPreview(button,item,lock=false) {
    if(!canPreview()) return;
    clearTimeout(closeTimer); createPopup();
    if(trigger && trigger!==button) trigger.setAttribute('aria-expanded','false');
    pinned=lock || (trigger===button && pinned); trigger=button;
    previewImage.src=item.src;
    previewCaption.textContent=`${item.type==='video'?'Video poster':'Image'} · ${dimensions(item)}`;
    previewImage.onload=()=> {
      if(previewImage.naturalWidth) previewCaption.textContent=`${item.type==='video'?'Video poster':'Image'} · ${previewImage.naturalWidth}×${previewImage.naturalHeight}`;
    };
    previewImage.onerror=()=> { previewCaption.textContent='图片暂不可用，可使用右上角查看图片 / 视频'; };
    popup.hidden=false; button.setAttribute('aria-expanded','true');
    positionPreview(button);
  }
  function closePreview(focus=false) {
    clearTimeout(closeTimer);
    if(popup) { popup.hidden=true; previewImage?.removeAttribute('src'); }
    const previous=trigger; trigger=null; pinned=false;
    previous?.setAttribute('aria-expanded','false');
    if(focus && previous?.isConnected && canPreview()) {
      suppressFocus=true;
      try { previous.focus({preventScroll:true}); } finally { suppressFocus=false; }
    }
  }
  function deferClose() { clearTimeout(closeTimer); closeTimer=setTimeout(()=> { if(!pinned) closePreview(); },120); }
  function thumbnail(item,index) {
    const button=document.createElement('button'); button.type='button'; button.className='xc-thumbnail';
    button.setAttribute('aria-label',`${item.type==='video'?'视频封面':'图片'} ${index+1}，悬停或点击放大`);
    button.setAttribute('aria-expanded','false'); button.setAttribute('aria-haspopup','dialog');
    const img=document.createElement('img'); img.src=item.src; img.alt=item.type==='video'?'视频封面缩略图':'图片缩略图'; img.loading='lazy'; img.decoding='async';
    const caption=document.createElement('span'); caption.className='xc-thumbnail-caption';
    caption.textContent=`${item.type==='video'?'Video':'Image'} · ${dimensions(item)}`;
    img.addEventListener('load',()=> { item.width=img.naturalWidth||item.width; item.height=img.naturalHeight||item.height; caption.textContent=`${item.type==='video'?'Video':'Image'} · ${dimensions(item)}`; });
    img.addEventListener('error',()=> { caption.textContent='图片暂不可用'; button.classList.add('xc-thumbnail-error'); });
    button.append(img,caption);
    button.addEventListener('mouseenter',()=>openPreview(button,item));
    button.addEventListener('mouseleave',()=> { if(!pinned) deferClose(); });
    button.addEventListener('focus',()=> { if(!suppressFocus) openPreview(button,item); });
    button.addEventListener('blur',()=> { if(!pinned) closePreview(); });
    button.addEventListener('click',event=> { event.preventDefault(); event.stopPropagation(); openPreview(button,item,true); });
    return button;
  }
  function group(owner,anchor,items,kind='post') {
    const signature=JSON.stringify(items.map(item=>[item.src,item.type]));
    let record=groups.get(owner);
    if(record && record.signature===signature && record.node.isConnected && record.anchor===anchor) return;
    if(record?.node.contains(trigger)) closePreview();
    record?.node.remove();
    // Cloned native cards can carry old DOM decorations but not their handlers.
    if(!record) { const copied=anchor.nextElementSibling; if(copied?.matches('.xc-media-thumbnails') && copied.dataset.xcGroupKind===kind) copied.remove(); }
    if(!items.length) { groups.delete(owner); return; }
    const node=own(document.createElement('div')); node.className=`xc-media-thumbnails xc-${kind}-thumbnails`; node.dataset.xcGroupKind=kind;
    node.setAttribute('aria-label',kind==='post'?'笔记图片缩略图':'图片缩略图');
    items.forEach((item,index)=>node.append(thumbnail(item,index)));
    anchor.after(node); groups.set(owner,{node,signature,anchor});
  }
  function ignoreInlineImage(image) {
    return image.closest(`${owned},.avatar,.avatar-container,.author,.author-container,.emoji,.emoticon`) || /avatar|emoji|emoticon/i.test(image.className);
  }
  function update(root,{expanded=false}={}) {
    if(!root) { closePreview(); return; }
    if(trigger && (!trigger.isConnected || !canPreview())) closePreview();
    decorateComments(root);
    root.querySelectorAll('.note-item').forEach(card=> {
      const title=card.querySelector('a.title');
      if(title) group(card,title,sourcesIn(card.querySelector('.cover')),'feed');
    });
    const note=root.querySelector('#noteContainer');
    if(note) {
      const anchor=note.querySelector('#detail-title') || note.querySelector('#detail-desc');
      if(anchor) group(note,anchor,sourcesIn(note.querySelector(':scope > .media-container')),'post');
      note.querySelectorAll('.note-content img,.comment-item img').forEach(image=> {
        if(ignoreInlineImage(image)) return;
        const item=imageSource(image);
        if(!item) { groups.get(image)?.node.remove(); groups.delete(image); image.removeAttribute('data-xc-thumb-source'); markedImages.delete(image); return; }
        image.setAttribute('data-xc-thumb-source',''); markedImages.add(image);
        group(image,image,[item],'inline');
      });
    }
    for(const [owner,record] of groups) if(!owner.isConnected) { if(record.node.contains(trigger)) closePreview(); record.node.remove(); groups.delete(owner); }
    for(const image of markedImages) if(!image.isConnected) markedImages.delete(image);
    if(expanded) closePreview();
  }
  function clear() {
    closePreview();
    document.querySelectorAll(owned).forEach(node=>node.remove());
    document.querySelectorAll('[data-xc-thumb-source]').forEach(node=>node.removeAttribute('data-xc-thumb-source'));
    commentBlocks.clear(); groups.clear(); markedImages.clear(); popup=null; previewImage=null;
  }
  document.addEventListener('keydown',event=> {
    if(event.key==='Escape' && popup && !popup.hidden) { event.preventDefault(); event.stopImmediatePropagation(); closePreview(true); }
  },true);
  document.addEventListener('scroll',()=> { if(popup && !popup.hidden && !pinned) closePreview(); },{capture:true,passive:true});
  addEventListener('resize',()=>closePreview());
  document.addEventListener('load',event=> {
    if(event.target instanceof HTMLImageElement && event.target.closest('#app') && !event.target.closest(owned) && canPreview()) requestUpdate();
  },true);
  return {update,clear,closePreview};
}
)({ icon:svg, requestUpdate:schedule, canPreview:()=>enabled&&!panic&&!(editorOverlay&&compactEditor.matches) });
  function load() {
    try {
      const raw = typeof GM_getValue === 'function' ? GM_getValue(KEY, {}) : JSON.parse(localStorage.getItem(KEY) || '{}');
      return { enabled: raw.enabled !== false, code: raw.code !== false, theme: ['light','dark','system'].includes(raw.theme) ? raw.theme : 'system' };
    } catch { return { enabled: true, code: true, theme: 'system' }; }
  }
  const prefs = load();
  const system = matchMedia('(prefers-color-scheme: dark)');
  const narrow = matchMedia('(max-width: 1100px)');
  const compactEditor = matchMedia('(max-width: 1000px)');
  let editorOverlay = false;
  let sourceFile = 'workflow.js';
  let codeWrapped = false;
  const flowNodes = new Set();
  const decoratedCards = new WeakMap();
  let collapsed = narrow.matches;
  let enabled = false;
  let panic = false;
  let media = false;
  let detailKey = '';
  let detailNode = null;
  let currentFeed = null;
  const observedFeeds = new WeakSet();
  let shell, restore, queued;
  let priorFocus = null;
  let panicApp = null;
  let appWasInert = false;
  let priorTitle = document.title;
  let addedIcon;
  const originalIcons = new Map();
  const inputAttributes = new Map();
  const introNodes = new Set();
  const iconURL = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#252627"/><path d="m11 9-6 7 6 7m10-14 6 7-6 7m-3-17-5 20" stroke="#f7f7f8" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>')}`;
  const supported = () => /^\/(?:$|explore(?:\/|$)|search_result(?:\/|$)|user\/profile(?:\/|$)|discovery\/item(?:\/|$))/.test(location.pathname);
  function save() {
    try {
      if (typeof GM_setValue === 'function') GM_setValue(KEY, {...prefs});
      else localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch { /* Appearance still works if preference storage is unavailable. */ }
  }
  function text(id, value) { const e = document.getElementById(id); if (e && e.textContent !== value) e.textContent = value; }
  function pauseMedia() { document.querySelectorAll('#app video, #app audio').forEach(v => { if (!v.paused) v.pause(); }); }
  function theme() {
    html.dataset.xcTheme = prefs.theme === 'system' ? (system.matches ? 'dark' : 'light') : prefs.theme;
    const label = {system:'跟随系统',light:'浅色',dark:'深色'}[prefs.theme];
    text('xc-theme-label', label);
    document.getElementById('xc-theme')?.setAttribute('aria-label', `切换主题，当前${label}`);
  }
  function setBranding(on) {
    if (on) {
      if (document.title !== 'Codex') { priorTitle = document.title; document.title = 'Codex'; }
      const links = [...document.head.querySelectorAll('link[rel~="icon"]')].filter(x => x !== addedIcon);
      for (const link of links) {
        if (!originalIcons.has(link)) originalIcons.set(link, link.getAttribute('href'));
        if (link.getAttribute('href') !== iconURL) link.setAttribute('href', iconURL);
      }
      if (!links.length && !addedIcon) {
        addedIcon = document.createElement('link'); addedIcon.rel = 'icon'; addedIcon.href = iconURL; document.head.append(addedIcon);
      }
    } else {
      if (document.title === 'Codex') document.title = priorTitle;
      for (const [link, href] of originalIcons) {
        if (link.getAttribute('href') === iconURL) {
          if (href === null) link.removeAttribute('href'); else link.setAttribute('href', href);
        }
      }
      originalIcons.clear(); addedIcon?.remove(); addedIcon = null;
    }
  }
  function restoreInput() {
    for (const [input, attributes] of inputAttributes) {
      for (const [name, value] of Object.entries(attributes)) {
        if (value === null) input.removeAttribute(name); else input.setAttribute(name, value);
      }
    }
    inputAttributes.clear();
  }
  function syncNativeInert() {
    const app=document.getElementById('app');
    const needed=enabled && (panic || (editorOverlay && compactEditor.matches));
    if(needed && app) {
      if(panicApp!==app) {
        if(panicApp && !appWasInert) panicApp.removeAttribute('inert');
        panicApp=app; appWasInert=app.hasAttribute('inert');
      }
      app.setAttribute('inert','');
    } else {
      if(panicApp && !appWasInert) panicApp.removeAttribute('inert');
      panicApp=null;
    }
  }
  function setEnabled(value) {
    const was = enabled;
    enabled = value && supported();
    html.dataset.xcEnabled = String(enabled);
    if (!enabled) {
      reader.clear();
      panic = false; editorOverlay=false; syncNativeInert();
      panicApp = null;
      panic = false; media = false; html.dataset.xcPanic = 'false'; applyMedia();
      text('xc-panic-label','隐藏内容');
      document.getElementById('xc-panic-toggle')?.setAttribute('aria-pressed','false');
      document.getElementById('xc-panic-toggle')?.setAttribute('aria-label','隐藏内容');
      html.style.removeProperty('--xc-feed-scroll');
      flowNodes.forEach(n=>n.remove()); flowNodes.clear();
      restoreInput(); introNodes.forEach(n => n.remove()); introNodes.clear();
      setBranding(false);
      if (was && shell?.contains(document.activeElement)) restore?.focus();
    } else {
      theme(); syncEditor(); setBranding(true);
      if (!was) pauseMedia();
      update();
    }
    if (restore) restore.textContent = supported() ? '启用 Codex · Alt+X' : '返回 Codex 工作区';
  }
  function toggle() { prefs.enabled = !enabled; save(); setEnabled(prefs.enabled); }
  function togglePanic() {
    if (!enabled) return;
    reader.closePreview();
    panic = !panic;
    html.dataset.xcPanic = String(panic);
    text('xc-panic-label', panic ? '继续阅读' : '隐藏内容');
    document.getElementById('xc-panic-toggle').setAttribute('aria-pressed', String(panic));
    document.getElementById('xc-panic-toggle').setAttribute('aria-label',panic?'继续阅读':'隐藏内容');
    if (panic) {
      priorFocus = document.activeElement;
      syncNativeInert();
      document.getElementById('xc-panic-toggle').focus();
      text('xc-crumb', '工作区');
      pauseMedia();
    } else {
      syncNativeInert();
      if (priorFocus?.isConnected) priorFocus.focus({preventScroll:true});
      update();
    }
  }
  function closeSidebarOnNarrow() { if (narrow.matches) { collapsed=true; sidebar(); } }
  function search() {
    closeSidebarOnNarrow();
    if (compactEditor.matches && editorOverlay) { editorOverlay=false; syncEditor(); }
    if (panic) togglePanic();
    const input = document.querySelector('#global header input');
    if (detailNode) closeDetail();
    if (input) {
      if (currentFeed) { currentFeed.scrollTop=0; html.style.setProperty('--xc-feed-scroll','0px'); }
      window.scrollTo({top:0,behavior:'instant'}); input.focus();
    }
  }
  function closeDetail() {
    const close = document.querySelector('.note-detail-mask .close-circle .close, .note-detail-mask .close-box');
    if (close) close.click();
    else if (detailNode) location.assign('/explore');
  }
  function buildShell() {
    shell = document.createElement('div'); shell.id = 'xc-shell';
    shell.innerHTML = `
      <nav id="xc-activity-rail" aria-label="活动栏">
        <a class="xc-icon" href="/explore" aria-label="工作区首页">${svg('folder')}</a>
        <button class="xc-icon" id="xc-rail-search" aria-label="搜索任务">${svg('search')}</button>
        <button class="xc-icon" id="xc-rail-code" aria-label="切换源代码面板">${svg('code')}</button>
      </nav>
      <header id="xc-topbar">
        <button class="xc-icon" id="xc-sidebar-toggle" aria-label="切换侧栏" aria-controls="xc-sidebar">${svg('sidebar')}</button>
        <div class="xc-brand">${svg('codex')}<span>Codex</span></div>
        <span class="xc-crumb" id="xc-crumb">工作区</span><span class="xc-spacer"></span>
        <button class="xc-tool" id="xc-back" hidden aria-label="返回任务列表">${svg('back')}<span>返回列表</span></button>
        <button class="xc-tool" id="xc-media" hidden aria-label="查看图片 / 视频" aria-pressed="false">${svg('eye')}<span id="xc-media-label">查看图片 / 视频</span></button>
        <button class="xc-icon" id="xc-code-toggle" aria-label="切换源代码面板" title="显示 / 隐藏源代码" aria-controls="xc-editor">${svg('code')}</button>
        <button class="xc-tool" id="xc-panic-toggle" aria-label="隐藏内容" aria-keyshortcuts="Alt+Q" aria-pressed="false" title="Alt+Q">${svg('shield')}<span id="xc-panic-label">隐藏内容</span></button>
      </header>
      <aside id="xc-sidebar" aria-label="工作区侧栏">
        <button class="xc-nav" id="xc-search">${svg('plus')}<span>新建探索</span></button>
        <button class="xc-nav" id="xc-focus-search">${svg('search')}<span>搜索笔记</span></button>
        <p class="xc-section">项目</p>
        <a class="xc-nav xc-project" id="xc-home" href="/explore">${svg('folder')}<span>个人工作区</span></a>
        <div class="xc-note" id="xc-recent"><span id="xc-recent-empty">最近的任务会显示在这里</span></div>
        <button class="xc-nav" id="xc-profile">${svg('user')}<span>我的主页</span></button>
        <div class="xc-bottom">
          <button class="xc-nav" id="xc-theme">${svg('sun')}<span id="xc-theme-label">跟随系统</span></button>
          <button class="xc-nav" id="xc-original">${svg('external')}<span>原版页面</span><kbd>Alt X</kbd></button>
          <div id="xc-help">Alt Q 隐藏 / 恢复内容</div>
        </div>
      </aside>
      <aside id="xc-editor" aria-label="源代码面板">
        <div id="xc-file-tabs" role="tablist" aria-label="源码文件">
          <button role="tab" aria-selected="true" data-xc-file="workflow.js">workflow.js</button>
          <button role="tab" aria-selected="false" data-xc-file="app.js">app.js</button>
          <button role="tab" aria-selected="false" data-xc-file="reader.js">reader.js</button>
          <button role="tab" aria-selected="false" data-xc-file="style.css">style.css</button>
          <button class="xc-icon" id="xc-editor-close" aria-label="关闭源代码面板">${svg('sidebar')}</button>
        </div>
        <div id="xc-code-crumb"><span>workspace / src / <b id="xc-code-file">workflow.js</b></span><span class="xc-spacer"></span>
          <button id="xc-code-wrap" aria-label="切换代码自动换行" aria-pressed="false">换行</button>
          <button class="xc-icon" id="xc-code-copy" aria-label="复制当前源代码" title="复制源码">${svg('copy')}</button>
        </div>
        <div id="xc-code-body" tabindex="0" role="tabpanel" aria-label="workflow.js 源代码"></div>
        <div id="xc-code-footer"><span id="xc-code-lines"></span><span id="xc-copy-status" role="status">JavaScript · UTF-8</span></div>
      </aside>
      <main id="xc-panic" aria-label="工作区待机画面">
        ${svg('codex')}<h1>工作区已就绪</h1><p>准备开始下一个任务</p>
        <pre><code># Workspace\n\n- Review project structure\n- Organize implementation notes\n- Run checks before committing</code></pre>
      </main>
      <footer id="xc-status"><span>${svg('branch')} main<span id="xc-count"></span></span><span id="xc-media-status">缩略图模式 · 媒体暂停</span></footer>`;
    document.body.append(shell);
    restore = document.createElement('button'); restore.id = 'xc-restore'; restore.type = 'button';
    restore.textContent = '启用 Codex · Alt+X'; document.body.append(restore);
    const on = (id, fn) => document.getElementById(id).addEventListener('click', fn);
    on('xc-sidebar-toggle', () => { collapsed = !collapsed; sidebar(); });
    on('xc-search', search); on('xc-focus-search', search);
    on('xc-panic-toggle', togglePanic);
    on('xc-original', toggle);
    on('xc-restore', () => { if (!supported()) location.assign('/explore'); else toggle(); });
    on('xc-theme', () => { const modes=['system','light','dark']; prefs.theme=modes[(modes.indexOf(prefs.theme)+1)%3]; save(); theme(); });
    on('xc-media', () => { media = !media; applyMedia(); });
    on('xc-back', closeDetail);
    on('xc-profile', () => {
      closeSidebarOnNarrow();
      const link = document.querySelector('#global .side-bar a[href^="/user/profile/"]');
      if (link) link.click(); else document.querySelector('#login-btn')?.click();
    });
    on('xc-code-toggle', toggleEditor); on('xc-rail-code', toggleEditor);
    on('xc-editor-close', toggleEditor); on('xc-rail-search', search);
    document.querySelectorAll('[data-xc-file]').forEach(button=>button.addEventListener('click',()=>renderSource(button.dataset.xcFile)));
    on('xc-code-wrap',()=> {
      codeWrapped=!codeWrapped;
      document.getElementById('xc-code-body').classList.toggle('xc-code-wrapped',codeWrapped);
      document.getElementById('xc-code-wrap').setAttribute('aria-pressed',String(codeWrapped));
    });
    on('xc-code-copy',async()=> {
      try { await copySourceText(sourceFiles[sourceFile]); text('xc-copy-status','已复制'); }
      catch { text('xc-copy-status','请选择代码后复制'); }
    });
    document.getElementById('xc-file-tabs').addEventListener('keydown',e=> {
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;
      const tabs=[...document.querySelectorAll('[data-xc-file]')];
      const index=tabs.indexOf(document.activeElement);
      if(index<0) return;
      e.preventDefault();
      const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(index+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
      renderSource(tabs[next].dataset.xcFile); tabs[next].focus();
    });
    renderSource(sourceFile); syncEditor(); sidebar();
  }
  async function copySourceText(value) {
    if(typeof GM_setClipboard==='function') { GM_setClipboard(value,'text'); return; }
    const active=document.activeElement;
    const area=document.createElement('textarea'); area.value=value; area.readOnly=true;
    area.style.cssText='position:fixed;left:-10000px;top:0;width:1px;height:1px';
    shell.append(area); area.focus({preventScroll:true}); area.select();
    let copied=false;
    try { copied=typeof document.execCommand==='function' && document.execCommand('copy'); }
    finally { area.remove(); active?.focus({preventScroll:true}); }
    if(copied) return;
    let timer;
    try {
      await Promise.race([
        navigator.clipboard.writeText(value),
        new Promise((_,reject)=> { timer=setTimeout(()=>reject(new Error('Clipboard unavailable')),2500); }),
      ]);
    } finally { clearTimeout(timer); }
  }
  function syncEditor() {
    const open=compactEditor.matches ? editorOverlay : prefs.code;
    html.dataset.xcEditor=String(open);
    html.dataset.xcEditorOverlay=String(open && compactEditor.matches);
    document.getElementById('xc-code-toggle')?.setAttribute('aria-expanded',String(open));
    document.getElementById('xc-rail-code')?.setAttribute('aria-pressed',String(open));
    document.getElementById('xc-editor')?.setAttribute('aria-hidden',String(!open));
    syncNativeInert();
    if(enabled && open && compactEditor.matches) { reader.closePreview(); pauseMedia(); }
  }
  function toggleEditor() {
    if(compactEditor.matches) { editorOverlay=!editorOverlay; closeSidebarOnNarrow(); }
    else { prefs.code=!prefs.code; save(); }
    syncEditor();
    if(compactEditor.matches && editorOverlay) document.getElementById('xc-code-body')?.focus({preventScroll:true});
    else document.getElementById('xc-code-toggle')?.focus();
  }
  function renderSource(file) {
    if(!Object.hasOwn(sourceFiles,file)) return;
    sourceFile=file;
    const body=document.getElementById('xc-code-body');
    const fragment=document.createDocumentFragment();
    const lines=sourceFiles[file].split('\n');
    lines.forEach((line,index)=> {
      const row=document.createElement('div'); row.className='xc-source-line';
      const number=document.createElement('span'); number.className='xc-line-number'; number.textContent=String(index+1); number.setAttribute('aria-hidden','true');
      const content=document.createElement('span'); content.className='xc-line-code';
      workflow.appendHighlightedLine(content,line,file.endsWith('.css')?'css':'javascript');
      row.append(number,content); fragment.append(row);
    });
    body.replaceChildren(fragment); body.scrollTop=0; body.scrollLeft=0;
    body.setAttribute('aria-label',file+' 源代码');
    document.querySelectorAll('[data-xc-file]').forEach(button=> { const active=button.dataset.xcFile===file; button.setAttribute('aria-selected',String(active)); button.tabIndex=active?0:-1; });
    text('xc-code-file',file); text('xc-code-lines',lines.length+' lines');
    text('xc-copy-status',(file.endsWith('.css')?'CSS':'JavaScript')+' · UTF-8');
  }
  function codeBlock(code,compact=false) {
    const block=document.createElement('pre'); block.className=compact?'xc-flow-code xc-flow-code-small':'xc-flow-code';
    const content=document.createElement('code');
    code.split('\n').forEach((line,index)=> {
      if(index) content.append('\n');
      workflow.appendHighlightedLine(content,line,'javascript');
    });
    block.append(content); return block;
  }
  function agentFlow(full=true,index=0) {
    const wrapper=document.createElement('div'); wrapper.className=full?'xc-intro xc-agent-flow':'xc-agent-step';
    const heading=document.createElement('div'); heading.className='xc-agent-heading';
    heading.innerHTML=svg('codex');
    const label=document.createElement('span'); label.textContent=full?'Agent workflow':'Inspect context'; heading.append(label);
    const description=document.createElement('p'); description.textContent=workflow.describeStep(index);
    wrapper.append(heading,description,codeBlock(full?workflow.workflowCode():workflow.taskCode(index),!full));
    if(full) {
      const summary=document.createElement('div'); summary.className='xc-flow-summary'; summary.textContent='Read context  /  Inspect source  /  Review changes'; wrapper.append(summary);
    }
    return wrapper;
  }
  function decorateTasks(items) {
    for(const [index,card] of items.entries()) {
      const old=decoratedCards.get(card);
      if(old?.isConnected) continue;
      const copied=card.querySelector('.xc-agent-step');
      if(copied) { decoratedCards.set(card,copied); flowNodes.add(copied); continue; }
      const footer=card.querySelector('.footer');
      if(!footer) continue;
      const step=agentFlow(false,index);
      footer.before(step); decoratedCards.set(card,step); flowNodes.add(step);
    }
    for(const node of flowNodes) if(!node.isConnected) flowNodes.delete(node);
  }
  function sidebar() {
    html.dataset.xcCollapsed = String(collapsed);
    document.getElementById('xc-sidebar-toggle')?.setAttribute('aria-expanded',String(!collapsed));
  }
  function applyMedia() {
    html.dataset.xcMedia = media ? 'show' : 'hide';
    text('xc-media-label', media ? '收起图片 / 视频' : '查看图片 / 视频');
    document.getElementById('xc-media')?.setAttribute('aria-pressed',String(media));
    document.getElementById('xc-media')?.setAttribute('aria-label',media?'收起图片 / 视频':'查看图片 / 视频');
    text('xc-media-status', media ? '当前笔记媒体已展开' : '缩略图模式 · 媒体暂停');
    reader.closePreview();
    if (enabled && !media) pauseMedia();
  }
  function update() {
    if (!enabled) return;
    if (!supported()) { setEnabled(false); return; }
    for (const n of introNodes) if (!n.isConnected) introNodes.delete(n);
    for (const [n, attributes] of inputAttributes) if (!n.isConnected) {
      for (const [name,value] of Object.entries(attributes)) { if(value===null)n.removeAttribute(name);else n.setAttribute(name,value); }
      inputAttributes.delete(n);
    }
    const input = document.querySelector('#global header input');
    if (input && !inputAttributes.has(input)) {
      inputAttributes.set(input,{placeholder:input.getAttribute('placeholder'),'aria-label':input.getAttribute('aria-label')});
      input.setAttribute('placeholder','搜索任务内容，按 Enter 查找…'); input.setAttribute('aria-label','搜索小红书笔记');
    }
    const feed = document.querySelector('#global .feeds-page, #global .search-page');
    currentFeed = feed;
    if (feed) {
      html.style.setProperty('--xc-feed-scroll',`${feed.scrollTop}px`);
      if (!observedFeeds.has(feed)) {
        observedFeeds.add(feed);
        feed.addEventListener('scroll',()=> {
          if (enabled && currentFeed===feed) html.style.setProperty('--xc-feed-scroll',`${feed.scrollTop}px`);
        },{passive:true});
      }
    }
    if (feed && !feed.querySelector(':scope > .xc-intro')) {
      const intro=agentFlow(); feed.prepend(intro); introNodes.add(intro);
    }
    const nextNode = document.querySelector('#noteContainer');
    const key = nextNode ? (nextNode.parentElement.getAttribute('note-id') || location.pathname + (nextNode.querySelector('#detail-title')?.textContent || '')) : '';
    if (nextNode !== detailNode || key !== detailKey) {
      detailNode=nextNode; detailKey=key; media=false; applyMedia();
    }
    html.dataset.xcDetail=String(!!nextNode);
    const scroller=nextNode?.querySelector('.note-scroller');
    if(scroller && !scroller.querySelector(':scope>.xc-agent-flow')) {
      const flow=agentFlow(); scroller.prepend(flow); flowNodes.add(flow);
    }
    document.getElementById('xc-back').hidden = !nextNode;
    document.getElementById('xc-media').hidden = !nextNode;
    if (!panic) text('xc-crumb', nextNode ? '任务详情' : location.pathname.startsWith('/search_result') ? '搜索结果' : '工作区');
    const items = workflow.collectTaskCards(document);
    decorateTasks(items);
    reader.update(document.getElementById('app'),{expanded:media});
    text('xc-count', items.length ? ` · ${items.length} 项任务` : '');
    const recent = document.getElementById('xc-recent');
    const links = [...items].slice(0,5).map(n => n.querySelector('a.title')).filter(Boolean);
    const signature = JSON.stringify(links.map(a=>a.getAttribute('href')));
    if (recent.dataset.signature !== signature) {
      recent.dataset.signature=signature; recent.replaceChildren();
      sidebarTopics.forEach((label,index)=> {
        const native=links[index];
        let target='/explore';
        try {
          if(native) {
            const url=new URL(native.getAttribute('href'),location.origin);
            if(url.origin===location.origin && /^\/(explore|search_result|discovery\/item)\//.test(url.pathname)) target=url.href;
          }
        } catch { /* Keep the workspace's normal home route. */ }
        const a=document.createElement('a'); a.href=target; a.textContent=label; a.title=label;
        a.addEventListener('click',event=> {
          if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button!==0) return;
          if(target!=='/explore' && native?.isConnected) { event.preventDefault(); native.click(); closeSidebarOnNarrow(); }
          else { event.preventDefault(); search(); }
        });
        recent.append(a);
      });
    }
    document.getElementById('xc-home').setAttribute('aria-current',location.pathname==='/explore'?'page':'false');
    setBranding(true);
  }
  function schedule() {
    if (queued) return;
    queued = setTimeout(() => {
      queued=0;
      if (prefs.enabled && !enabled && supported()) setEnabled(true);
      else update();
    },100);
  }
  function boot() {
    if (document.getElementById('xc-shell')) return;
    const style=document.createElement('style'); style.id='xc-style'; style.textContent=CSS; document.head.append(style);
    buildShell(); setEnabled(prefs.enabled); applyMedia();
    document.addEventListener('keydown',e=> {
      if (e.isComposing || e.repeat || !e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.code==='KeyQ' && enabled) { e.preventDefault(); togglePanic(); }
      if (e.code==='KeyX') {
        const editing=e.target instanceof Element && e.target.closest('input,textarea,[contenteditable]:not([contenteditable="false"]),[role="textbox"]');
        if (!editing) { e.preventDefault(); toggle(); }
      }
    },true);
    document.addEventListener('play',e=> {
      if (enabled && (panic || (editorOverlay && compactEditor.matches) || !media || !e.target.closest('#noteContainer'))) e.target.pause?.();
    },true);
    document.addEventListener('click',schedule,true);
    addEventListener('popstate',schedule); addEventListener('hashchange',schedule);
    const observer = new MutationObserver(records=> {
      if (records.some(r=> !(r.target instanceof Element ? r.target : r.target.parentElement)?.closest('#xc-shell,#xc-restore,.xc-intro,.xc-agent-step,[data-xc-reader-owned]'))) schedule();
    });
    observer.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['src','srcset','poster','data-src']});
    new MutationObserver(()=> { if(enabled) { setBranding(true); schedule(); } else if(document.title!=='Codex') priorTitle=document.title; }).observe(document.head,{childList:true,subtree:true,characterData:true});
    system.addEventListener('change',theme);
    narrow.addEventListener('change',()=> { collapsed=narrow.matches; sidebar(); });
    compactEditor.addEventListener('change',()=> { editorOverlay=false; syncEditor(); });
    if (typeof GM_registerMenuCommand==='function') {
      GM_registerMenuCommand('Codex：切换原版 / 伪装 (Alt+X)',toggle);
      GM_registerMenuCommand('Codex：隐藏 / 恢复内容 (Alt+Q)',togglePanic);
      GM_registerMenuCommand('Codex：切换深浅主题',()=>document.getElementById('xc-theme').click());
    }
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
