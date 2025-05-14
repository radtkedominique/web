// Shop Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const filterToggle = document.getElementById('filter-toggle');
    const filterSidebar = document.querySelector('.filter-sidebar');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const productSearch = document.getElementById('product-search');
    const productGrid = document.querySelector('.shop-product-grid');
    const productCards = document.querySelectorAll('.product-card');
    const sortSelect = document.getElementById('sort-by');
    const activeFiltersContainer = document.getElementById('active-filters');
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
    const badgeCheckboxes = document.querySelectorAll('input[name="badge"]');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const minRangeInput = document.getElementById('price-min-range');
    const maxRangeInput = document.getElementById('price-max-range');
    const applyPriceBtn = document.getElementById('apply-price');
    const sliderTrack = document.querySelector('.slider-track');
    const paginationBtns = document.querySelectorAll('.pagination-btn');

    // Create overlay for mobile filter
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    // Active filters
    let activeFilters = {
        categories: [],
        badges: [],
        priceRange: {
            min: 0,
            max: 100
        },
        search: ''
    };

    // Toggle filter sidebar on mobile
    filterToggle.addEventListener('click', function() {
        filterSidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        
        if(filterSidebar.classList.contains('active')) {
            filterToggle.innerHTML = '<i class="fas fa-times"></i> Hide Filters';
            document.body.style.overflow = 'hidden';
        } else {
            filterToggle.innerHTML = '<i class="fas fa-filter"></i> Show Filters';
            document.body.style.overflow = '';
        }
    });

    // Hide sidebar when clicking overlay
    overlay.addEventListener('click', function() {
        filterSidebar.classList.remove('active');
        overlay.classList.remove('active');
        filterToggle.innerHTML = '<i class="fas fa-filter"></i> Show Filters';
        document.body.style.overflow = '';
    });

    // Price slider functionality
    function updateSliderRange() {
        const minVal = parseInt(minRangeInput.value);
        const maxVal = parseInt(maxRangeInput.value);
        
        if (minVal > maxVal) {
            minRangeInput.value = maxVal;
        }
        
        const percent1 = (minVal / parseInt(minRangeInput.max)) * 100;
        const percent2 = (maxVal / parseInt(maxRangeInput.max)) * 100;
        
        sliderTrack.style.left = percent1 + '%';
        sliderTrack.style.width = (percent2 - percent1) + '%';
        
        minPriceInput.value = minVal;
        maxPriceInput.value = maxVal;
    }

    minRangeInput.addEventListener('input', updateSliderRange);
    maxRangeInput.addEventListener('input', updateSliderRange);

    minPriceInput.addEventListener('change', function() {
        minRangeInput.value = Math.min(parseInt(this.value), parseInt(maxPriceInput.value));
        updateSliderRange();
    });

    maxPriceInput.addEventListener('change', function() {
        maxRangeInput.value = Math.max(parseInt(this.value), parseInt(minPriceInput.value));
        updateSliderRange();
    });

    // Initialize slider
    updateSliderRange();

    // Apply price filter
    applyPriceBtn.addEventListener('click', function() {
        activeFilters.priceRange = {
            min: parseInt(minPriceInput.value),
            max: parseInt(maxPriceInput.value)
        };
        
        updateActiveFilters();
        filterProducts();
    });

    // Category filters
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if(this.checked) {
                activeFilters.categories.push(this.value);
            } else {
                activeFilters.categories = activeFilters.categories.filter(cat => cat !== this.value);
            }
            
            updateActiveFilters();
            filterProducts();
        });
    });

    // Badge filters
    badgeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if(this.checked) {
                activeFilters.badges.push(this.value);
            } else {
                activeFilters.badges = activeFilters.badges.filter(badge => badge !== this.value);
            }
            
            updateActiveFilters();
            filterProducts();
        });
    });

    // Product search
    productSearch.addEventListener('input', function() {
        activeFilters.search = this.value.toLowerCase().trim();
        filterProducts();
    });

    // Clear all filters
    clearFiltersBtn.addEventListener('click', function() {
        // Reset checkboxes
        categoryCheckboxes.forEach(checkbox => checkbox.checked = false);
        badgeCheckboxes.forEach(checkbox => checkbox.checked = false);
        
        // Reset price range
        minPriceInput.value = 0;
        maxPriceInput.value = 100;
        minRangeInput.value = 0;
        maxRangeInput.value = 100;
        updateSliderRange();
        
        // Reset search
        productSearch.value = '';
        
        // Reset active filters
        activeFilters = {
            categories: [],
            badges: [],
            priceRange: {
                min: 0,
                max: 100
            },
            search: ''
        };
        
        updateActiveFilters();
        filterProducts();
    });

    // Update active filters UI
    function updateActiveFilters() {
        activeFiltersContainer.innerHTML = '';
        
        // Add category filters
        activeFilters.categories.forEach(category => {
            const filterTag = document.createElement('div');
            filterTag.className = 'active-filter';
            filterTag.innerHTML = `
                Category: ${category}
                <button class="remove-filter" data-type="category" data-value="${category}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            activeFiltersContainer.appendChild(filterTag);
        });
        
        // Add badge filters
        activeFilters.badges.forEach(badge => {
            const filterTag = document.createElement('div');
            filterTag.className = 'active-filter';
            filterTag.innerHTML = `
                Badge: ${badge}
                <button class="remove-filter" data-type="badge" data-value="${badge}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            activeFiltersContainer.appendChild(filterTag);
        });
        
        // Add price range filter if it's not the default
        if(activeFilters.priceRange.min > 0 || activeFilters.priceRange.max < 100) {
            const filterTag = document.createElement('div');
            filterTag.className = 'active-filter';
            filterTag.innerHTML = `
                Price: €${activeFilters.priceRange.min} - €${activeFilters.priceRange.max}
                <button class="remove-filter" data-type="price">
                    <i class="fas fa-times"></i>
                </button>
            `;
            activeFiltersContainer.appendChild(filterTag);
        }
        
        // Add search filter if present
        if(activeFilters.search) {
            const filterTag = document.createElement('div');
            filterTag.className = 'active-filter';
            filterTag.innerHTML = `
                Search: "${activeFilters.search}"
                <button class="remove-filter" data-type="search">
                    <i class="fas fa-times"></i>
                </button>
            `;
            activeFiltersContainer.appendChild(filterTag);
        }
        
        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.remove-filter');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const type = this.dataset.type;
                const value = this.dataset.value;
                
                if(type === 'category') {
                    activeFilters.categories = activeFilters.categories.filter(cat => cat !== value);
                    document.querySelector(`input[name="category"][value="${value}"]`).checked = false;
                } else if(type === 'badge') {
                    activeFilters.badges = activeFilters.badges.filter(badge => badge !== value);
                    document.querySelector(`input[name="badge"][value="${value}"]`).checked = false;
                } else if(type === 'price') {
                    activeFilters.priceRange = { min: 0, max: 100 };
                    minPriceInput.value = 0;
                    maxPriceInput.value = 100;
                    minRangeInput.value = 0;
                    maxRangeInput.value = 100;
                    updateSliderRange();
                } else if(type === 'search') {
                    activeFilters.search = '';
                    productSearch.value = '';
                }
                
                updateActiveFilters();
                filterProducts();
            });
        });
    }

    // Filter products based on active filters
    function filterProducts() {
        productCards.forEach(card => {
            const category = card.dataset.category;
            const price = parseFloat(card.dataset.price);
            const badge = card.dataset.badge;
            const title = card.querySelector('.product-title').textContent.toLowerCase();
            
            // Check if product matches all filters
            let showProduct = true;
            
            // Category filter
            if(activeFilters.categories.length > 0 && !activeFilters.categories.includes(category)) {
                showProduct = false;
            }
            
            // Badge filter
            if(activeFilters.badges.length > 0 && (!badge || !activeFilters.badges.includes(badge))) {
                showProduct = false;
            }
            
            // Price range filter
            if(price < activeFilters.priceRange.min || price > activeFilters.priceRange.max) {
                showProduct = false;
            }
            
            // Search filter
            if(activeFilters.search && !title.includes(activeFilters.search)) {
                showProduct = false;
            }
            
            // Show or hide product
            if(showProduct) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Check if no products are visible
        const visibleProducts = document.querySelectorAll('.product-card[style=""]');
        if(visibleProducts.length === 0) {
            // Add "no products found" message if it doesn't exist
            let noProductsMsg = document.querySelector('.no-products-msg');
            if(!noProductsMsg) {
                noProductsMsg = document.createElement('div');
                noProductsMsg.className = 'no-products-msg';
                noProductsMsg.textContent = 'No products match your filters. Try adjusting your selection.';
                noProductsMsg.style.textAlign = 'center';
                noProductsMsg.style.padding = '40px 0';
                noProductsMsg.style.width = '100%';
                noProductsMsg.style.gridColumn = '1 / -1';
                productGrid.appendChild(noProductsMsg);
            }
        } else {
            // Remove "no products found" message if it exists
            const noProductsMsg = document.querySelector('.no-products-msg');
            if(noProductsMsg) {
                noProductsMsg.remove();
            }
        }
    }

    // Sort products
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        const productsArray = Array.from(productCards);
        
        productsArray.sort((a, b) => {
            if(sortValue === 'price-low') {
                return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
            } else if(sortValue === 'price-high') {
                return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
            }
            // For other sorting options, we would need additional data attributes
            return 0;
        });
        
        // Reappend cards in new order
        productsArray.forEach(card => {
            productGrid.appendChild(card);
        });
    });

    // Pagination (for demonstration - would need backend for real pagination)
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            paginationBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Shopping Cart Functionality (already implemented in shoppingcard.js)
});