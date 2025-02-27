document.addEventListener('DOMContentLoaded', () => {
    // Medium user ID or publication ID
    const MEDIUM_USERNAME = 'dilanperera';
    
    // Blog container element
    const blogsContainer = document.getElementById('blogs-container');
    
    // Fetch Medium RSS feed and convert to JSON using rss2json service
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${MEDIUM_USERNAME}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'ok') {
                // Get only the first 3 items
                const posts = data.items.slice(0, 4);
                
                // Render each blog post
                posts.forEach(post => {
                    // Extract the first image from the content if available
                    let imgUrl = extractImageFromContent(post.content);
                    
                    // If no image found, use a placeholder
                    if (!imgUrl) {
                        imgUrl = 'resources/blog-placeholder.jpg';
                    }
                    
                    // Format the date
                    const publishDate = new Date(post.pubDate);
                    const formattedDate = publishDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    
                    // Create blog item element
                    const blogItem = document.createElement('li');
                    blogItem.className = 'blog-item';
                    blogItem.innerHTML = `
                        <div class="blog-header">
                            <img src="${imgUrl}" alt="${post.title}" class="blog-img">
                        </div>
                        <div class="blog-content">
                            <h3>${post.title}</h3>
                            <div class="date">${formattedDate}</div>
                            <p>${getExcerpt(post.content, 150)}</p>
                            <a href="${post.link}" target="_blank" class="read-more">Read more <i class="fas fa-arrow-right"></i></a>
                        </div>
                    `;
                    
                    // Add to container
                    blogsContainer.appendChild(blogItem);
                });
            } else {
                // Display error message
                blogsContainer.innerHTML = `<p>Unable to load blog posts. Please check back later.</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching blog posts:', error);
            blogsContainer.innerHTML = `<p>Unable to load blog posts. Please check back later.</p>`;
        });
    
    // Function to extract the first image from HTML content
    function extractImageFromContent(content) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const img = doc.querySelector('img');
        return img ? img.src : null;
    }
    
    // Function to create excerpt from HTML content
    function getExcerpt(content, maxLength) {
        // Remove HTML tags
        const textContent = content.replace(/<\/?[^>]+(>|$)/g, "");
        
        // Truncate to max length
        if (textContent.length <= maxLength) {
            return textContent;
        }
        
        return textContent.substring(0, maxLength) + '...';
    }
});
