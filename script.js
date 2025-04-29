"use strict";

// email setup
(function() {
    emailjs.init("mklLOtb6STXFzaAAh");
})();

// ui setup

// make the faq accordion work
$(document).ready(function() {
    $("#accordion").accordion({
        heightStyle: "content",
        collapsible: true,
        active: 0,
        icons: {
            header: "ui-icon-plus",
            activeHeader: "ui-icon-minus"
        }
    });
});

// setup the image slideshow
$(document).ready(function() {
    $(".slideshow").slick({
        dots: true,
        infinite: true,
        speed: 300,
        fade: true,
        cssEase: 'linear',
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: true,
        prevArrow: '<button type="button" class="slick-prev"><i class="fas fa-chevron-left"></i></button>',
        nextArrow: '<button type="button" class="slick-next"><i class="fas fa-chevron-right"></i></button>'
    });
});

// booking form stuff
const bookingForm = document.getElementById('visitForm');

if (bookingForm) {
    // check if they've booked before
    const savedBooking = localStorage.getItem('bookingData');
    if (savedBooking) {
        const bookingData = JSON.parse(savedBooking);
        document.getElementById('name').value = bookingData.name || '';
        document.getElementById('email').value = bookingData.email || '';
        document.getElementById('date').value = bookingData.date || '';
        document.getElementById('time').value = bookingData.time || '';
        
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'welcome-message';
        welcomeMessage.innerHTML = `<p>Welcome back, ${bookingData.name}! Your last booking was for ${bookingData.date}.</p>`;
        bookingForm.parentNode.insertBefore(welcomeMessage, bookingForm);
    }
    
    // handle form submit
    bookingForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // show loading spinner
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
        submitButton.disabled = true;
        
        // get the form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value
        };
        
        try {
            // make the date look nice
            const bookingDate = new Date(formData.date);
            const formattedDate = `${bookingDate.getMonth() + 1}/${bookingDate.getDate()}`;
            
            // send the confirmation email
            await emailjs.send(
                "service_el7eb1t",
                "template_kgdb7wf",
                {
                    email: formData.email,
                    to_name: formData.name,
                    booking_date: formData.date,
                    booking_time: formData.time,
                    reply_to: "parkeriscool83@gmail.com",
                    from_name: "Honeyberry Hill Farm"
                }
            );
            
            // save for next time
            localStorage.setItem('bookingData', JSON.stringify(formData));
            
            // clean up old welcome message
            const welcomeMessage = document.querySelector('.welcome-message');
            if (welcomeMessage) {
                welcomeMessage.remove();
            }
            
            // show success message
            const confirmationMessage = document.createElement('div');
            confirmationMessage.className = 'confirmation-message';
            confirmationMessage.innerHTML = `
                <h3>Booking Confirmed!</h3>
                <p>Thank you, ${formData.name}! Your visit is scheduled for <span class="highlight-text">${formattedDate}</span> during the <span class="highlight-text">${formData.time}</span> session.</p>
                <p>We've sent a confirmation email to ${formData.email}.</p>
                <p>We'll see you soon at Honeyberry Hill!</p>
            `;
            
            // clear form and show confirmation
            bookingForm.innerHTML = '';
            bookingForm.appendChild(confirmationMessage);
            
            // add button to book again
            const newBookingBtn = document.createElement('button');
            newBookingBtn.textContent = 'Make Another Booking';
            newBookingBtn.className = 'new-booking-btn';
            newBookingBtn.addEventListener('click', function() {
                location.reload();
            });
            bookingForm.appendChild(newBookingBtn);
            
        } catch (error) {
            // something went wrong
            console.error('booking error:', error);
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.innerHTML = `
                <p>Sorry, there was an error processing your booking. Please try again or contact us directly.</p>
                <p>Error: ${error.message}</p>
            `;
            submitButton.parentNode.insertBefore(errorMessage, submitButton);
            
            // reset the button
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }
    });
}

// Load strawberry varieties using AJAX
function loadStrawberryVarieties() {
    const strawberryList = document.getElementById('strawberryList');
    if (strawberryList) {
        // Show loading state
        strawberryList.innerHTML = '<div class="loading">Loading strawberry varieties...</div>';
        
        // Fetch data from JSON file
        fetch('data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                strawberryList.innerHTML = '';
                
                // Create cards for each variety
                data.varieties.forEach(strawberry => {
                    const strawberryCard = document.createElement('div');
                    strawberryCard.className = 'strawberry-card';
                    strawberryCard.innerHTML = `
                        <img src="${strawberry.image}" alt="${strawberry.name}">
                        <h3>${strawberry.name}</h3>
                        <p>${strawberry.description}</p>
                        <div class="strawberry-details">
                            <p><strong>Season:</strong> ${strawberry.season}</p>
                            <ul class="characteristics">
                                ${strawberry.characteristics.map(char => `<li>${char}</li>`).join('')}
                            </ul>
                        </div>
                    `;
                    strawberryList.appendChild(strawberryCard);
                });
            })
            .catch(error => {
                // Handle errors
                console.error('Error loading strawberry varieties:', error);
                strawberryList.innerHTML = '<div class="error">Sorry, we couldn\'t load the strawberry varieties. Please try again later.</div>';
            });
    }
}

// Initialize strawberry varieties on page load
document.addEventListener('DOMContentLoaded', loadStrawberryVarieties);

// Implement smooth scrolling for navigation
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll animations for elements
document.addEventListener('DOMContentLoaded', function() {
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature, .strawberry-card, .slide');
        
        elements.forEach(element => {
            // Check if element is in viewport
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate');
            }
        });
    };
    
    // Run on scroll and initial load
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
});

// Weather API integration
async function getWeather() {
    const weatherDisplay = document.getElementById('weather');
    const WEATHER_API_KEY = '006def2b5798a192ea8bca31d612048a'; // Replace with actual API key
    const city = 'Los Angeles';
    
    try {
        // Fetch weather data
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${WEATHER_API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error('Weather data not available');
        }
        
        const data = await response.json();
        const temp = Math.round(data.main.temp);
        const description = data.weather[0].main;
        
        // Select appropriate weather icon
        let weatherIcon = 'fa-sun';
        switch (description.toLowerCase()) {
            case 'clouds': weatherIcon = 'fa-cloud'; break;
            case 'rain': weatherIcon = 'fa-cloud-rain'; break;
            case 'thunderstorm': weatherIcon = 'fa-cloud-bolt'; break;
            case 'snow': weatherIcon = 'fa-snowflake'; break;
            case 'mist':
            case 'fog': weatherIcon = 'fa-smog'; break;
        }
        
        // Update weather display
        weatherDisplay.innerHTML = `
            <i class="fas ${weatherIcon}"></i>
            <span>Los Angeles: ${temp}°F | ${description}</span>
        `;
    } catch (error) {
        // Handle errors
        console.error('Error fetching weather:', error);
        weatherDisplay.innerHTML = `
            <i class="fas fa-sun"></i>
            <span>Los Angeles Weather Unavailable</span>
        `;
    }
}

// Initialize page features
document.addEventListener('DOMContentLoaded', function() {
    getWeather();
    // Update weather every 30 minutes
    setInterval(getWeather, 1800000);
    
    loadStrawberryVarieties();
    animateOnScroll();
});

// Mobile Menu Functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Change menu icon
        const menuIcon = mobileMenuBtn.querySelector('i');
        menuIcon.classList.toggle('fa-bars');
        menuIcon.classList.toggle('fa-times');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const menuIcon = mobileMenuBtn.querySelector('i');
            menuIcon.classList.add('fa-bars');
            menuIcon.classList.remove('fa-times');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const menuIcon = mobileMenuBtn.querySelector('i');
            menuIcon.classList.add('fa-bars');
            menuIcon.classList.remove('fa-times');
        }
    });
} 