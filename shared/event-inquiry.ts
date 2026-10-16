/** Keep venue visitors on the inquiry path, without changing hotel booking links. */
export function eventInquiry(path: string, search = '', preview = false) {
  const params = new URLSearchParams(search);
  const topic = params.get('topic') ?? '';
  const isEvent = path === '/event-center' || path.startsWith('/event-center/')
    || ['/events', '/weddings', '/menus', '/menu', '/catering', '/catering-menus'].includes(path)
    || (path === '/contact' && ['Wedding inquiry', 'Event / meeting inquiry'].includes(topic));
  if (!isEvent) return null;
  const wedding = path.includes('wedding') || topic === 'Wedding inquiry';
  const type = params.get('event_type') || (wedding ? 'Wedding' : path.includes('corporate') ? 'Corporate meeting' : path.includes('social') ? 'Banquet / social event' : '');
  const query = new URLSearchParams({topic: wedding ? 'Wedding inquiry' : 'Event / meeting inquiry'});
  if (type) query.set('event_type', type);
  return {
    quote: preview ? `?${query}#/contact` : `/contact?${query}#contact-form`,
    tour: preview ? `?${query}&tour=1#/contact` : `/contact?${query}&tour=1#contact-form`,
  };
}
