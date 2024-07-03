/**
 * This file is part of BizzCode Website Project.
 *
 * BizzCode Website Project is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or any later version.
 *
 * BizzCode Website Project is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with BizzCode Website Project. If not, see <https://www.gnu.org/licenses/>.
 */

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
  