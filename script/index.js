// Check for dark mode preference
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
}

// Listen for changes in color scheme preference
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (event.matches) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
});

// Month names array for better display
const monthNames = [
    "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
    "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"
];

// Initialize the image database with some sample data
let imageDatabase = {
    "2025": {
        "1": ["img/img_2025/1.jpg"],
        "2": ["img/img_2025/2.jpg"],
        "3": ["img/img_2025/3.jpg"],
        "4": ["img/img_2025/4.jpg"],
        "5": ["img/img_2025/5.jpg"],
        "6": ["img/img_2025/6.jpg"],
        "7": ["img/img_2025/7.jpg"],
        "8": ["img/img_2025/8.jpg"],
        "9": ["img/img_2025/9.jpg"],
        "10": ["img/img_2025/10.jpg"],
        "11": ["img/img_2025/11.jpg"],
        "12": ["img/img_2025/12.jpg"]
    },
    "2026": {
        // "3": ["https://picsum.photos/id/244/800/600", "https://picsum.photos/id/243/800/600"],
        "1": ["img/img_2026/1.jpg"]
    }
};

// Function to render the months grid based on the selected year
function renderMonthsGrid(year) {
    const monthsGrid = document.getElementById('monthsGrid');
    monthsGrid.innerHTML = '';

    let yearData = imageDatabase[year] || {};
    let yearTitle = year === 'all' ? 'All Years' : year;
    document.getElementById('yearTitle').textContent = `Images from ${yearTitle}`;

    // If "All Years" is selected, merge all images from all years
    if (year === 'all') {
        yearData = {};
        Object.keys(imageDatabase).forEach(y => {
            Object.keys(imageDatabase[y]).forEach(m => {
                if (!yearData[m]) {
                    yearData[m] = [];
                }
                yearData[m] = [...yearData[m], ...imageDatabase[y][m]];
            });
        });
    }

    // Generate month cards
    for (let i = 1; i <= 12; i++) {
        const monthStr = i.toString();
        const hasImages = yearData[monthStr] && yearData[monthStr].length > 0;
        const imageCount = hasImages ? yearData[monthStr].length : 0;

        const monthCard = document.createElement('div');
        monthCard.className = `col-6 col-md-4 col-lg-3`;
        monthCard.innerHTML = `
                    <div class="month-card ${hasImages ? 'has-images' : ''}" data-month="${monthStr}" data-year="${year}">
                        <div class="month-name">${monthNames[i - 1]}</div>
                        <div class="image-count">${imageCount} image${imageCount !== 1 ? 's' : ''}</div>
                    </div>
                `;

        monthsGrid.appendChild(monthCard);

        // Add click event to show modal with images
        monthCard.querySelector('.month-card').addEventListener('click', function () {
            showImagesForMonth(year, monthStr);
        });
    }
}

// Function to show images for a specific month in the modal
function showImagesForMonth(year, month) {
    const modalTitle = document.getElementById('imageModalLabel');
    const carouselInner = document.querySelector('.carousel-inner');
    const noImagesMessage = document.getElementById('noImagesMessage');
    const carousel = document.getElementById('imageCarousel');

    // Set modal title
    const monthName = monthNames[parseInt(month) - 1];
    const yearTitle = year === 'all' ? 'All Years' : year;
    modalTitle.textContent = `Images for ${monthName}, ${yearTitle}`;

    // Clear existing carousel items
    carouselInner.innerHTML = '';

    // Get images for this month and year
    let images = [];

    if (year === 'all') {
        // If "All Years" is selected, collect images from all years for this month
        Object.keys(imageDatabase).forEach(y => {
            if (imageDatabase[y][month]) {
                images = [...images, ...imageDatabase[y][month]];
            }
        });
    } else if (imageDatabase[year] && imageDatabase[year][month]) {
        images = imageDatabase[year][month];
    }

    // Show/hide carousel or no images message
    if (images.length > 0) {
        carousel.style.display = 'block';
        noImagesMessage.style.display = 'none';

        // Add images to carousel
        images.forEach((imageUrl, index) => {
            const carouselItem = document.createElement('div');
            carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
            carouselItem.innerHTML = `
                        <img src="${imageUrl}" class="d-block mx-auto image-preview" alt="Image ${index + 1}">
                        <div class="carousel-caption d-none d-md-block">
                            <h5>Image ${index + 1} of ${images.length}</h5>
                        </div>
                    `;
            carouselInner.appendChild(carouselItem);
        });
    } else {
        carousel.style.display = 'none';
        noImagesMessage.style.display = 'block';
    }

    // Show the modal
    const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
    imageModal.show();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    // Initial render
    renderMonthsGrid('2025');

    // Search button click
    document.getElementById('searchBtn').addEventListener('click', function () {
        const selectedYear = document.getElementById('yearSelect').value;
        renderMonthsGrid(selectedYear);
    });

});