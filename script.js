// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    generateCategoryButtons();
    displayProducts();
    setupContactForm();
});

// Generate category radio buttons from items data
function generateCategoryButtons() {
    const categoryButtonsDiv = document.getElementById('categoryButtons');
    
    // Get unique categories from items
    const categories = [...new Set(ITEMS.map(item => item.category))];
    
    // Add "All" option first
    const allLabel = document.createElement('label');
    allLabel.className = 'radio-option';
    
    const allInput = document.createElement('input');
    allInput.type = 'radio';
    allInput.name = 'category';
    allInput.value = 'all';
    allInput.checked = true;
    allInput.addEventListener('change', displayProducts);
    
    const allLabelText = document.createElement('label');
    allLabelText.textContent = 'All Items';
    
    allLabel.appendChild(allInput);
    allLabel.appendChild(allLabelText);
    categoryButtonsDiv.appendChild(allLabel);
    
    // Create button for each category
    categories.forEach(category => {
        const label = document.createElement('label');
        label.className = 'radio-option';
        
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'category';
        input.value = category;
        input.addEventListener('change', displayProducts);
        
        const labelText = document.createElement('label');
        labelText.textContent = formatCategoryName(category);
        
        label.appendChild(input);
        label.appendChild(labelText);
        categoryButtonsDiv.appendChild(label);
    });
}

// Format category name for display (e.g., "hand-tools" -> "Hand Tools")
function formatCategoryName(category) {
    return category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Display products based on selected category
function displayProducts() {
    const selectedCategory = document.querySelector('input[name="category"]:checked').value;
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    // Filter items based on selected category
    let filteredItems = ITEMS;
    if (selectedCategory !== 'all') {
        filteredItems = ITEMS.filter(item => item.category === selectedCategory);
    }
    
    // Display message if no items found
    if (filteredItems.length === 0) {
        productsGrid.innerHTML = '<div class="empty-state"><h3>No items found in this category</h3></div>';
        return;
    }
    
    // Create product cards
    filteredItems.forEach(item => {
        const productCard = createProductCard(item);
        productsGrid.appendChild(productCard);
    });
}

// Create a product card element
function createProductCard(item) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Image
    const imageDiv = document.createElement('div');
    imageDiv.className = 'product-image';
    
    if (item.image) {
        const img = document.createElement('img');
        img.src = `images/${item.image}`;
        img.alt = item.name;
        img.onerror = function() {
            // Fallback if image doesn't load
            imageDiv.textContent = 'No Image Available';
        };
        imageDiv.appendChild(img);
    } else {
        imageDiv.textContent = 'No Image Available';
    }
    
    // Product Info
    const infoDiv = document.createElement('div');
    infoDiv.className = 'product-info';
    
    // Category badge
    const categoryBadge = document.createElement('div');
    categoryBadge.className = 'product-category';
    categoryBadge.textContent = formatCategoryName(item.category);
    infoDiv.appendChild(categoryBadge);
    
    // Product name
    const nameElement = document.createElement('div');
    nameElement.className = 'product-name';
    nameElement.textContent = item.name;
    infoDiv.appendChild(nameElement);
    
    // Description
    const descriptionElement = document.createElement('div');
    descriptionElement.className = 'product-description';
    descriptionElement.textContent = item.description;
    infoDiv.appendChild(descriptionElement);
    
    // Price
    const priceElement = document.createElement('div');
    priceElement.className = 'product-price';
    priceElement.textContent = `$${parseFloat(item.price).toFixed(2)}`;
    infoDiv.appendChild(priceElement);
    
    // Status
    if (item.status) {
        const statusElement = document.createElement('div');
        statusElement.className = `product-status ${item.status}`;
        statusElement.textContent = item.status;
        infoDiv.appendChild(statusElement);
    }
    
    card.appendChild(imageDiv);
    card.appendChild(infoDiv);
    
    return card;
}

// Setup contact form submission
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Basic validation
        if (!name || !email || !message) {
            showMessage('Please fill in all fields.', 'error', formMessage);
            return;
        }
        
        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            showMessage('Please enter a valid email address.', 'error', formMessage);
            return;
        }
        
        // In a real application, you would send this data to a server
        // For now, we'll just show a success message
        console.log({
            name: name,
            email: email,
            message: message,
            timestamp: new Date().toISOString()
        });
        
        showMessage('Thank you for your message! We will get back to you soon.', 'success', formMessage);
        
        // Reset form
        contactForm.reset();
        
        // Clear message after 5 seconds
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = 'form-message';
        }, 5000);
    });
}

// Display form message
function showMessage(text, type, element) {
    element.textContent = text;
    element.className = `form-message ${type}`;
}
