export function createPageUrl(pageName) {
	// Handle URLs with query parameters
	if (pageName.includes("?")) {
		const [page, queryString] = pageName.split("?");
		return `/${page.toLowerCase()}?${queryString}`;
	}
	return `/${pageName.toLowerCase()}`;
}
