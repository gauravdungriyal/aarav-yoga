document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(b => { const selected=b===button; b.classList.toggle('active',selected); b.setAttribute('aria-pressed',String(selected)); });
  let count=0;
  document.querySelectorAll('[data-class-tags]').forEach(card => { card.hidden=button.dataset.filter!=='all' && !card.dataset.classTags.split(' ').includes(button.dataset.filter); if(!card.hidden) count++; });
  document.querySelector('.filter-summary').textContent=`Showing ${count} ${count===1?'class':'classes'}`;
}));
document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click',()=> {
  const dialog=document.querySelector('.lightbox'); const image=document.querySelector('#lightbox-image');
  image.src=button.dataset.image; image.alt=button.dataset.caption;
  document.querySelector('#lightbox-caption').textContent=button.dataset.caption; dialog.showModal();
}));
const articleData=document.querySelector('#article-data');
if(articleData) {
  const articles=JSON.parse(articleData.textContent);
  document.querySelectorAll('[data-article]').forEach(button=>button.addEventListener('click',()=> {
    const {category,title,html}=articles[Number(button.dataset.article)];
    document.querySelector('#article-category').textContent=category;
    document.querySelector('#article-title').textContent=title;
    const body=document.querySelector('#article-body'); body.innerHTML=html; // HTML is rendered at build time with raw HTML disabled and safe links.
    document.querySelector('.article-dialog').showModal();
  }));
}
const eventData = document.querySelector('#event-data');
if (eventData) {
  const events = JSON.parse(eventData.textContent);
  document.querySelectorAll('[data-event]').forEach(button => button.addEventListener('click', () => {
    const event = events[Number(button.dataset.event)];
    document.querySelector('#event-category').textContent = event.category;
    document.querySelector('#event-title').textContent = event.title;
    document.querySelector('#event-description').textContent = event.description;
    document.querySelector('#event-details').textContent = [event.date ? event.dateLabel : 'Dates to be announced.', event.location || 'Venue to be announced.'].join(' · ');
    const action = document.querySelector('.event-dialog .button');
    action.href = event.registrationUrl || event.enquiryUrl;
    action.textContent = event.registrationUrl ? 'Register for this event' : 'Enquire on WhatsApp';
    document.querySelector('.event-dialog').showModal();
  }));
}
document.querySelectorAll('dialog:not(#site-menu)').forEach(dialog=> {
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
});
const requestedClass=new URLSearchParams(location.search).get('class');
const context=document.querySelector('#enquiry-context');
if(context && requestedClass) {context.hidden=false;context.textContent=`Interested in ${requestedClass}? Call or email us using the contact details below to ask about availability and booking.`;}
