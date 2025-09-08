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

// load strawberry varieties using AJAX
function loadStrawberryVarieties() {
    const strawberryList = document.getElementById('strawberryList');
    if (strawberryList) {
        // show loading state
        strawberryList.innerHTML = '<div class="loading">Loading strawberry varieties...</div>';
        
        // fetch data from JSON file
        fetch('data.json')
            .then(response => {
                console.log('Response status:', response.status);
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Data loaded successfully:', data);
                strawberryList.innerHTML = '';
                
                // create cards for each variety
                data.varieties.forEach(strawberry => {
                    const strawberryCard = document.createElement('div');
                    strawberryCard.className = 'strawberry-card';
                    strawberryCard.innerHTML = `
                        <img src="${strawberry.image}" alt="${strawberry.name}">
                        <div class="strawberry-card-content">
                            <h3>${strawberry.name}</h3>
                            <p>${strawberry.description}</p>
                            <div class="strawberry-details">
                                <p><strong>Season:</strong> ${strawberry.season}</p>
                                <ul class="characteristics">
                                    ${strawberry.characteristics.map(char => `<li>${char}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    `;
                    strawberryList.appendChild(strawberryCard);
                });
            })
            .catch(error => {
                // handle errors
                console.error('Error loading strawberry varieties:', error);
                // fallback: show hardcoded varieties if fetch fails
                strawberryList.innerHTML = `
                    <div class="strawberry-card">
                        <img src="images/pearl.jpg" alt="Pearl Drop">
                        <div class="strawberry-card-content">
                            <h3>Pearl Drop</h3>
                            <p>A rare white strawberry variety with a pearly sheen and delicate floral notes. Known for its exceptional sweetness and subtle vanilla undertones.</p>
                            <div class="strawberry-details">
                                <p><strong>Season:</strong> Early to Mid Spring</p>
                                <ul class="characteristics">
                                    <li>Pure white flesh</li>
                                    <li>Light pink blush</li>
                                    <li>Vanilla-honey flavor</li>
                                    <li>Extra sweet aroma</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="strawberry-card">
                        <img src="images/aurora.jpg" alt="Aurora Gem">
                        <div class="strawberry-card-content">
                            <h3>Aurora Gem</h3>
                            <p>A unique bi-colored strawberry that transitions from rose pink to ruby red as it ripens. Prized for its complex flavor profile.</p>
                            <div class="strawberry-details">
                                <p><strong>Season:</strong> Mid Spring to Early Summer</p>
                                <ul class="characteristics">
                                    <li>Color-changing ripening</li>
                                    <li>Heart-shaped berries</li>
                                    <li>Berry-floral flavor</li>
                                    <li>Firm, juicy texture</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="strawberry-card">
                        <img src="images/twilight.jpg" alt="Twilight Blush">
                        <div class="strawberry-card-content">
                            <h3>Twilight Blush</h3>
                            <p>A deep purple-red variety with a natural silvery sheen on its leaves. Produces intensely aromatic berries with notes of wild berries.</p>
                            <div class="strawberry-details">
                                <p><strong>Season:</strong> Late Spring to Summer</p>
                                <ul class="characteristics">
                                    <li>Deep burgundy color</li>
                                    <li>Silver-tinted leaves</li>
                                    <li>Rich berry flavor</li>
                                    <li>Strong fragrance</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `;
            });
    }
}

// initialize strawberry varieties on page load
document.addEventListener('DOMContentLoaded', loadStrawberryVarieties);

// implement smooth scrolling for navigation
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

// add scroll animations for elements
document.addEventListener('DOMContentLoaded', function() {
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature, .strawberry-card, .slide');
        
        elements.forEach(element => {
            // check if element is in viewport
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate');
            }
        });
    };
    
    // run on scroll and initial load
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
});

// weather API integration
async function getWeather() {
    const weatherDisplay = document.getElementById('weather');
    const WEATHER_API_KEY = '006def2b5798a192ea8bca31d612048a'; // Replace with actual API key
    const city = 'Los Angeles';
    
    try {
        // fetch weather data
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${WEATHER_API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error('Weather data not available');
        }
        
        const data = await response.json();
        const temp = Math.round(data.main.temp);
        const description = data.weather[0].main;
        
        // select appropriate weather icon
        let weatherIcon = 'fa-sun';
        switch (description.toLowerCase()) {
            case 'clouds': weatherIcon = 'fa-cloud'; break;
            case 'rain': weatherIcon = 'fa-cloud-rain'; break;
            case 'thunderstorm': weatherIcon = 'fa-cloud-bolt'; break;
            case 'snow': weatherIcon = 'fa-snowflake'; break;
            case 'mist':
            case 'fog': weatherIcon = 'fa-smog'; break;
        }
        
        // update weather display
        weatherDisplay.innerHTML = `
            <i class="fas ${weatherIcon}"></i>
            <span>Los Angeles: ${temp}°F | ${description}</span>
        `;
    } catch (error) {
        // handle errors
        console.error('Error fetching weather:', error);
        weatherDisplay.innerHTML = `
            <i class="fas fa-sun"></i>
            <span>Los Angeles Weather Unavailable</span>
        `;
    }
}

// initialize page features
document.addEventListener('DOMContentLoaded', function() {
    getWeather();
    // update weather every 30 minutes
    setInterval(getWeather, 1800000);
    
    loadStrawberryVarieties();
    animateOnScroll();
});

// mobile menu functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // change menu icon
        const menuIcon = mobileMenuBtn.querySelector('i');
        menuIcon.classList.toggle('fa-bars');
        menuIcon.classList.toggle('fa-times');
    });

    // close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const menuIcon = mobileMenuBtn.querySelector('i');
            menuIcon.classList.add('fa-bars');
            menuIcon.classList.remove('fa-times');
        });
    });

    // close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const menuIcon = mobileMenuBtn.querySelector('i');
            menuIcon.classList.add('fa-bars');
            menuIcon.classList.remove('fa-times');
        }
    });
} 