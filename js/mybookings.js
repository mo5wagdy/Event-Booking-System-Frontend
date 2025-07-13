document.addEventListener('DOMContentLoaded', async () => {
    const bookingsList = document.getElementById('bookings-list');
    let myBookingIds = JSON.parse(localStorage.getItem('myBookingIds') || '[]');
    if (!bookingsList) {
        console.error('Element with id "bookings-list" not found.');
        return;
    }
    if (!myBookingIds.length) {
        bookingsList.innerHTML = '<div class="no-bookings">No bookings found.</div>';
        return;
    }
    bookingsList.innerHTML = '';
    const lastBookedEventId = sessionStorage.getItem('lastBookedEventId');
    for (const id of myBookingIds) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/Bookings/GetBooking/${id}`);
            if (!response.ok) throw new Error();
            const booking = await response.json();

            // Fetch event details if needed
            let eventName = `Event ID: ${booking.eventId}`;
            let eventDate = '';
            if (booking.eventId) {
                const eventResponse = await fetch(`${API_BASE_URL}/api/Events/${booking.eventId}`);
                if (eventResponse.ok) {
                    const event = await eventResponse.json();
                    eventName = event.name || eventName;
                    eventDate = event.date ? new Date(event.date).toLocaleDateString() : '';
                }
            }

            const bookingDiv = document.createElement('div');
            bookingDiv.className = 'booking-card';
            bookingDiv.dataset.eventId = booking.eventId;

            bookingDiv.innerHTML = `
                <h4>${eventName}</h4>
                <p>Date: ${eventDate || (booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : '')}</p>
                <p>Status: ${booking.bookingStatus || ''}</p>
                <p>Seats: ${booking.numberOfSeats || ''}</p>
            `;
            bookingsList.appendChild(bookingDiv);
        } catch {
            // Optionally handle error for this booking
        }
    }
    // Optionally scroll to the highlighted booking
    if (lastBookedEventId) {
        const highlighted = bookingsList.querySelector('.highlight');
        if (highlighted) {
            highlighted.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        sessionStorage.removeItem('lastBookedEventId');
    }
});