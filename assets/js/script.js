'use strict';
/*
  Real Estate Website JavaScript
  Author: @HoaiPhuong
*/

// Navbar functionality
const $navbar = document.querySelector('[data-navbar]');
const $navToggler = document.querySelector('[data-nav-toggler]');
$navToggler.addEventListener('click', () => $navbar.classList.toggle('active'));

// Header scroll effect
const $header = document.querySelector('[data-header]');
window.addEventListener('scroll', (e) => {
    $header.classList[window.scrollY > 50 ? 'add' : 'remove']('active');
});

// Add to favorite button toggle
const $toggleBtns = document.querySelectorAll('[data-toggle-btn]');
$toggleBtns.forEach(($toggleBtn) => {
    $toggleBtn.addEventListener('click', () => {
        $toggleBtn.classList.toggle('active');
    });
});

// Property search functionality
const searchForm = document.querySelector('.search-bar');
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(searchForm);
        const searchParams = {
            type: formData.get('want-to'),
            propertyType: formData.get('property-type'),
            location: formData.get('location')
        };
        const propertyId = formData.get('property-id');
        // Remove previous notification if exists
        const prevNote = document.getElementById('no-property-note');
        if (prevNote) prevNote.remove();
        if (propertyId) {
            document.querySelectorAll('.card').forEach((card) => {
                const idElem = card.querySelector('.property-id');
                if (idElem && idElem.textContent.trim() === propertyId.trim()) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            // Check if any card is visible
            if (
                ![...document.querySelectorAll('.card')].some(
                    (card) => card.style.display !== 'none'
                )
            ) {
                showNoPropertyNote();
            }
            return; // Skip other filters if searching by ID
        }
        // Filter by property type
        filterProperties('property-type', searchParams.propertyType);
        // You can also add location filter if needed:
        if (searchParams.location && searchParams.location.trim() !== '') {
            filterProperties('location', searchParams.location);
        }
        // Check if any card is visible
        if (
            ![...document.querySelectorAll('.card')].some(
                (card) => card.style.display !== 'none'
            )
        ) {
            showNoPropertyNote();
        }
    });
}

function showNoPropertyNote() {
    const note = document.createElement('div');
    note.id = 'no-property-note';
    note.textContent = 'Sorry, we are out of the property you want';
    note.style.textAlign = 'center';
    note.style.margin = '32px 0';
    note.style.fontSize = '2rem';
    note.style.color = '#ff2134';
    note.style.fontWeight = 'bold';
    const propertyList = document.querySelector('.property-list');
    if (propertyList) {
        propertyList.parentNode.insertBefore(note, propertyList.nextSibling);
    }
}

// Property price formatting
const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price);
};

// Update all price elements
document.querySelectorAll('.title-large').forEach((priceElement) => {
    const price = parseFloat(
        priceElement.textContent.replace(/[^0-9.-]+/g, '')
    );
    if (!isNaN(price)) {
        priceElement.textContent = formatPrice(price);
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Property filtering
const filterProperties = (type, value) => {
    const properties = document.querySelectorAll('.card');
    properties.forEach((property) => {
        const propertyType = property.getAttribute('data-property-type');
        const propertyPrice = parseFloat(property.getAttribute('data-price'));
        const propertyLocation = property
            .getAttribute('data-location')
            .toLowerCase();

        let show = true;

        if (type === 'property-type' && value !== 'any') {
            show = propertyType === value;
        } else if (type === 'price-range') {
            const [min, max] = value.split('-').map(Number);
            show = propertyPrice >= min && propertyPrice <= max;
        } else if (type === 'location') {
            show = propertyLocation.includes(value.toLowerCase());
        }

        property.style.display = show ? 'block' : 'none';
    });
};

// Form validation
const validateForm = (form) => {
    const inputs = form.querySelectorAll('input, select');
    let isValid = true;

    inputs.forEach((input) => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    return isValid;
};

// Add form validation to search form
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        if (!validateForm(searchForm)) {
            e.preventDefault();
            alert('Please fill in all required fields');
        }
    });
}

// Property image gallery/slider
const initPropertyGallery = () => {
    const propertyCards = document.querySelectorAll('.card');

    propertyCards.forEach((card) => {
        const imgHolder = card.querySelector('.img-holder');
        if (imgHolder) {
            imgHolder.addEventListener('click', () => {
                // Here you can implement a lightbox or modal to show larger images
                const imgSrc = imgHolder.querySelector('img').src;
                // Example: openLightbox(imgSrc);
            });
        }
    });
};

// Initialize property gallery
initPropertyGallery();

// Add loading animation for property cards
const addLoadingAnimation = () => {
    const propertyCards = document.querySelectorAll('.card');
    propertyCards.forEach((card) => {
        card.classList.add('loading');
        setTimeout(() => {
            card.classList.remove('loading');
        }, 500);
    });
};

// Call loading animation when page loads
window.addEventListener('load', addLoadingAnimation);

document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('click', function (e) {
        // Prevent modal on favorite button click
        if (e.target.closest('.fav-btn')) return;
        const title = card.querySelector('.card-title').textContent;
        const price = card.querySelector('.title-large').textContent;
        const address = card.querySelector('.card-text').textContent;
        const id = card.querySelector('.property-id').textContent;
        const img = card.querySelector('.img-cover').src;
        document.getElementById('modal-details').innerHTML = `
            <img src="${img}" style="width:100%;border-radius:12px;">
            <h2>${title}</h2>
            <p><strong>ID:</strong> ${id}</p>
            <p><strong>Price:</strong> ${price}</p>
            <p><strong>Address:</strong> ${address}</p>
        `;
        document.getElementById('property-modal').style.display = 'block';
    });
});
document.querySelector('.close-modal').onclick = function () {
    document.getElementById('property-modal').style.display = 'none';
};
window.onclick = function (event) {
    if (event.target == document.getElementById('property-modal')) {
        document.getElementById('property-modal').style.display = 'none';
    }
};

document.querySelectorAll('.property-id').forEach((idElem) => {
    idElem.addEventListener('click', function (e) {
        e.stopPropagation();
        navigator.clipboard.writeText(idElem.textContent.trim());
        idElem.style.background = '#4caf50';
        idElem.style.color = '#fff';
        setTimeout(() => {
            idElem.style.background = '';
            idElem.style.color = '';
        }, 800);
    });
});

const cards = document.querySelectorAll('.card');
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    },
    { threshold: 0.1 }
);
cards.forEach((card) => observer.observe(card));
