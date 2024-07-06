export async function getData() {
    const res = await fetch(process.env.API_URL + '/content/item/robots', {
      method: 'GET',
      headers: {
        'Api-Key': process.env.API_KEY,
      },
      next : {revalidate: 10},
    });
  
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data');
    }
  
    return res.json();
  }

export default async function robots() {
  const data = await getData();
  const rules = [];
  data.rules.forEach(rule => {
    rules.push({
      userAgent: rule.userAgent,
      ...(rule.allow ? {allow: rule.link} : {disallow: rule.link}),
    });
  });
  return {
    rules,
    sitemap: data.urlsitemap,
  }
}
