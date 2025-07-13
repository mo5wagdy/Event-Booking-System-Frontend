// DOM Elements
const eventsContainer = document.querySelector('.events-container');

// Fetch and display events
async function fetchEvents() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Events`);
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        
        const events = await response.json();
        displayEvents(events);
    } catch (error) {
        showNotification('Failed to load events. Please try again later.', 'error');
        console.error('Error fetching events:', error);
    }
}

// Display events in the grid
function displayEvents(events) {
    eventsContainer.innerHTML = '';
    
    events.forEach(event => {
        const eventCard = createEventCard(event);
        eventsContainer.appendChild(eventCard);
    });
}

// Create event card element
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    
    card.innerHTML = `
        <div class="event-image">
            <img src="${event.imageUrl || 'images/default-event.jpg'}" alt="${event.name}">
        </div>
        <div class="event-details">
            <h3>${event.name || 'No Name'}</h3>
            <p class="event-date">
                <i class="fas fa-calendar"></i>
                ${event.date ? new Date(event.date).toLocaleDateString() : 'No Date'}
            </p>
            <p class="event-location">
                <i class="fas fa-map-marker-alt"></i>
                ${event.venue || 'No Venue'}
            </p>
            <p class="event-description">${event.description || ''}</p>
            <div class="event-actions">
                <button class="btn btn-primary book-btn" data-event-id="${event.id}">
                    Book Now
                </button>
            </div>
        </div>
    `;
    
    // Add event listener for booking
    const bookBtn = card.querySelector('.book-btn');
    bookBtn.addEventListener('click', () => handleBooking(event));
    
    return card;
}

// Handle event booking
async function handleBooking(event) {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    if (!user || !token) {
        alert('Please login to book events.');
        return;
    }

    const userId = user.id || user.Id || user.userId;
    if (!userId) {
        alert('User ID not found. Please login again.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/Bookings/CreateBooking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                eventId: event.id,
                userId: userId,
                numberOfSeats: 1
            })
        });

        if (!response.ok) {
            throw new Error('Booking failed');
        }

        // Get the booking result (contains booking info)
        const bookingResult = await response.json();

        // Store booking ID locally
        let myBookingIds = JSON.parse(localStorage.getItem('myBookingIds') || '[]');
        myBookingIds.push(bookingResult.id);
        localStorage.setItem('myBookingIds', JSON.stringify(myBookingIds));

        // Show custom modal instead of confirm
        sessionStorage.setItem('lastBookedEventId', event.id);
        showBookingModal();
    } catch (error) {
        alert('Failed to book event. Please try again.');
        console.error(error);
    }
}

// Show booking confirmation modal
function showBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (!modal) return;
    modal.classList.add('show');

    // Close modal
    document.getElementById('close-booking-modal').onclick = () => modal.classList.remove('show');
    document.getElementById('stay-here').onclick = () => modal.classList.remove('show');
    document.getElementById('go-to-bookings').onclick = () => {
        modal.classList.remove('show');
        window.location.href = '../pages/mybookings.html';
    };
}

// Fetch event details
async function fetchEventDetails(eventId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Events/${eventId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch event details');
        }
        
        const event = await response.json();
        return event;
    } catch (error) {
        showNotification('Failed to load event details', 'error');
        console.error('Error fetching event details:', error);
        return null;
    }
}

// Update event status
async function updateEventStatus(eventId, status) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Events/${eventId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ status })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update event status');
        }
        
        showNotification('Event status updated successfully', 'success');
        fetchEvents(); // Refresh events list
    } catch (error) {
        showNotification('Failed to update event status', 'error');
        console.error('Error updating event status:', error);
    }
}

// Delete event
async function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/Events/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete event');
        }
        
        showNotification('Event deleted successfully', 'success');
        fetchEvents(); // Refresh events list
    } catch (error) {
        showNotification('Failed to delete event', 'error');
        console.error('Error deleting event:', error);
    }
}

// Initialize events on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchEvents();
    // Fallback: Set default font-family if Poppins fails to load
    const testFont = new FontFace('Poppins', 'url(https://fonts.gstatic.com/s/poppins/v23/pxiEyp8kv8JHgFVrJJfecg.woff2)');
    testFont.load().catch(() => {
        document.body.style.fontFamily = 'Arial, Helvetica, sans-serif';
    });
});