export async function getData() {
    const res = await fetch(process.env.API_URL + '/content/items/sitemap', {
      method: 'GET',
      headers: {
        'Api-Key': process.env.API_KEY,
      },
    });
  
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data');
    }
  
    return res.json();
  }
  
  export default async function sitemap() {
    let data;
    try {
      data = await getData();
    } catch (error) {
      console.error('Error fetching sitemap data:', error);
      return [];
    }
  
    const dynamicSitemap = data.map(item => ({
      url: `${item.url}`,
      lastModified: new Date(item.lastmod),
      priority: item.priority,
    }));
  
    return [
      ...dynamicSitemap,
    ];
  }
  