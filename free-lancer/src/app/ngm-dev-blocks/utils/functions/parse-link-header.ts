/*
	Installed from https://ui.angular-material.dev/api/registry/
	Update this file using `@ngm-dev/cli update utils/functions`
*/

type LinkInfo = {
  url: string;
  rel: string;
  [key: string]: string;
};

type ParsedLinks = {
  [rel: string]: LinkInfo;
};

/**
 * Parses HTTP Link header according to RFC 5988
 * @param linkHeader - The Link header string to parse
 * @returns Parsed links object with rel as key and link info as value
 *
 * @example
 * ```ts
 * const linkHeader = '<https://api.github.com/repos?page=2>; rel="next"';
 * const parsed = parseLinkHeader(linkHeader);
 * // Returns: { next: { url: 'https://api.github.com/repos?page=2', rel: 'next' } }
 * ```
 */
export function parseLinkHeader(linkHeader: string): ParsedLinks {
  if (!linkHeader || typeof linkHeader !== 'string') {
    return {};
  }

  const result: ParsedLinks = {};

  // Split by comma to get individual link entries
  const linkEntries = linkHeader.split(',');

  for (const entry of linkEntries) {
    const trimmedEntry = entry.trim();
    if (!trimmedEntry) continue;

    // Parse URL (between < and >)
    const urlMatch = trimmedEntry.match(/^<([^>]+)>/);
    if (!urlMatch) continue;

    const url = urlMatch[1];
    const parametersString = trimmedEntry.substring(urlMatch[0].length);

    // Parse parameters after the URL
    const linkInfo: LinkInfo = { url, rel: '' };

    // Extract URL parameters from the URL itself
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.forEach((value, key) => {
        linkInfo[key] = value;
      });
    } catch {
      // If URL parsing fails, continue without URL parameters
    }

    // Parse link parameters (after the URL, separated by semicolons)
    const paramMatches = parametersString.matchAll(
      /;\s*([^=]+)=(?:"([^"]*)"|([^;,\s]+))/g
    );

    for (const match of paramMatches) {
      const key = match[1].trim();
      const value = match[2] || match[3] || '';
      linkInfo[key] = value;
    }

    // Use rel as the key in the result object
    if (linkInfo.rel) {
      result[linkInfo.rel] = linkInfo;
    }
  }

  return result;
}
