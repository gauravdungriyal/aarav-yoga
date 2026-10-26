import { renderPage, pageSlugs } from '../pages.mjs';
import { setPreviewContent, h, json } from './preview-content.mjs';
import { preparePreview, resolvePreviewAssets, previewPages } from './preview-model.mjs';
export { resolvePreviewAssets };

export function previewDocument(seed, name, draft, page, getAsset, { slide = 0, scroll = 0 } = {}) {
  if (!pageSlugs.includes(page)) throw Error('Unknown preview page');
  const content = preparePreview(seed, name, draft, getAsset);
  setPreviewContent(content);
  const html = renderPage(page);
  const bootstrap = `
    document.addEventListener('DOMContentLoaded', () => {
      const pages = ${json(pageSlugs)};
      const dots = document.querySelectorAll('.hero-slider .splide__pagination__page');
      if (dots.length) dots[Math.min(${Number(slide) || 0}, dots.length - 1)]?.click();
      requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, ${Number(scroll) || 0})));
      let timer;
      window.addEventListener('scroll', () => {
        clearTimeout(timer);
        timer = setTimeout(() => parent.postMessage({type:'aarav-preview-scroll', top:scrollY}, '*'), 80);
      }, {passive:true});
      document.addEventListener('click', event => {
        const link = event.target.closest('a');
        if (!link || link.getAttribute('href')?.startsWith('#')) return;
        event.preventDefault();
        const path = link.getAttribute('href').split(/[?#]/)[0].replace(/\\.html$/, '');
        if (pages.includes(path)) parent.postMessage({type:'aarav-preview-page', page:path}, '*');
      }, true);
    });`;
  return html.replace('<head>', `<head><base href="${h(location.origin)}/"><meta name="robots" content="noindex, nofollow">`)
    .replace('</head>', `<script>${bootstrap}</script></head>`);
}

export async function register(CMS, config) {
  const response = await fetch('/admin/preview-data.json', { cache: 'no-store' });
  if (!response.ok) throw Error('Preview data could not be loaded. Reload the editor.');
  const seed = await response.json();
  const create = window.h;
  for (const collection of config.collections) {
    for (const file of collection.files) {
      const name = file.name;
      const Component = window.createClass({
        getInitialState() {
          return { page: previewPages[name] || 'index', mode: 'fit', slide: 0, width: 500, document: '', error: '' };
        },
        componentDidMount() {
          this.scrollTop = 0;
          this.assetCache = new Map();
          this.revision = 0;
          this.previewWindow = this.frame.ownerDocument.defaultView;
          this.receive = event => {
            // The rendered page has an opaque sandbox origin. Trust only our frame.
            if (event.source !== this.frame.contentWindow) return;
            if (event.data?.type === 'aarav-preview-scroll' && Number.isFinite(event.data.top)) this.scrollTop = Math.max(0, event.data.top);
            if (event.data?.type === 'aarav-preview-page' && pageSlugs.includes(event.data.page)) {
              this.scrollTop = 0;
              this.setState({ page: event.data.page });
            }
          };
          this.previewWindow.addEventListener('message', this.receive);
          this.resize = new ResizeObserver(entries => {
            const width = Math.round(entries[0].contentRect.width);
            if (width > 0 && width !== this.state.width) this.setState({ width });
          });
          this.resize.observe(this.stage);
          this.refresh();
        },
        componentDidUpdate(previousProps, previousState) {
          if (previousProps.entry !== this.props.entry || previousProps.getAsset !== this.props.getAsset || previousState.page !== this.state.page || previousState.slide !== this.state.slide) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => this.refresh(), 250);
          }
        },
        componentWillUnmount() {
          this.revision++;
          clearTimeout(this.timer);
          this.resize.disconnect();
          this.previewWindow.removeEventListener('message', this.receive);
        },
        async refresh() {
          const revision = ++this.revision;
          try {
            const draft = this.props.entry.getIn(['data']).toJS();
            const getAsset = await resolvePreviewAssets(seed, name, draft, this.props.getAsset, this.assetCache);
            if (revision !== this.revision) return;
            const document = previewDocument(seed, name, draft, this.state.page, getAsset, {slide:this.state.slide, scroll:this.scrollTop});
            this.setState({ document, error: '' });
          } catch {
            if (revision === this.revision) this.setState({ error: 'Complete the required fields and let images finish loading to update this preview. Your last preview is kept below.' });
          }
        },
        render() {
          const width = this.state.mode === 'desktop' ? 1280 : this.state.mode === 'mobile' ? 390 : Math.max(320, this.state.width);
          const height = this.state.mode === 'mobile' ? 844 : 900;
          const scale = Math.min(1, this.state.width / width);
          const slides = name === 'home' ? this.props.entry.getIn(['data','heroSlides'])?.size || 0 : 0;
          const select = (label, value, change, options) => create('label', {}, label, create('select', {value, onChange:change}, options.map(([id,text]) => create('option', {key:id,value:id}, text))));
          return create('section', {className:'cms-live-preview'},
            create('div', {className:'cms-preview-toolbar'},
              select('Page', this.state.page, event => { this.scrollTop=0; this.setState({page:event.target.value}); }, pageSlugs.map(page => [page, page === 'index' ? 'Home' : page[0].toUpperCase()+page.slice(1)])),
              select('View', this.state.mode, event => this.setState({mode:event.target.value}), [['fit','Fit pane'],['desktop','Desktop'],['mobile','Mobile']]),
              slides > 0 && select('Hero slide', this.state.slide, event => { this.scrollTop=0; this.setState({slide:Number(event.target.value),page:'index'}); }, Array.from({length:slides}, (_,i)=>[i,`Slide ${i+1}`])),
            ),
            create('p', {className:'cms-preview-note'}, 'Live preview · Edits are unpublished until you publish. Save a draft to open its Vercel preview.'),
            name === 'seo' && create('div', {className:'cms-seo-preview'},
              create('strong', {}, this.props.entry.getIn(['data',this.state.page,'title']) || 'Page title'),
              create('p', {}, this.props.entry.getIn(['data',this.state.page,'description']) || 'Page description'),
            ),
            this.state.error && create('p', {className:'cms-preview-error', role:'status'}, this.state.error),
            create('div', {className:'cms-preview-stage',ref:node=>{this.stage=node;},style:{height:height*scale}},
              create('iframe', {
                title:'Live website preview', ref:node=>{this.frame=node;}, srcDoc:this.state.document,
                sandbox:'allow-scripts', referrerPolicy:'no-referrer',
                style:{width,height,zoom:scale},
              }),
            ),
          );
        },
      });
      CMS.registerPreviewTemplate(name, Component);
    }
  }
  CMS.registerPreviewStyle('/admin/preview.css');
}
