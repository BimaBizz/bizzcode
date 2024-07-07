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