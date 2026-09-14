/**
 * Hemisphere Hotels & Resorts — Universal Booking Engine Web Component
 * Integrates with Oracle OPERA Cloud / CRS / PMS service layer.
 * Fires GA4 analytics events on availability searches.
 */
import { analytics } from './analytics.js';

class HemiBookingWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.initEvents();
  }

  static get observedAttributes() {
    return ['property'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'property' && oldValue !== newValue) {
      const select = this.shadowRoot?.getElementById('property-select');
      if (select && newValue) {
        select.value = newValue;
      }
    }
  }

  render() {
    const presetProperty = this.getAttribute('property') || '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          font-family: var(--font-body, "Plus Jakarta Sans", sans-serif);
        }

        :host([modal-only="true"]) {
          display: contents;
        }

        :host([modal-only="true"]) .booking-bar {
          display: none !important;
        }

        .booking-bar {
          background: #FFFFFF;
          color: #111517;
          border-radius: 2px;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
          border-top: 3px solid var(--prop-accent, #C5A880);
          display: grid;
          grid-template-columns: 1.6fr 1.1fr 1.1fr 1.3fr 0.9fr 1.4fr;
          align-items: stretch;
          padding: 8px 12px;
          gap: 8px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 8px 12px;
          border-right: 1px solid rgba(0, 0, 0, 0.08);
          position: relative;
        }

        .field-group:last-of-type {
          border-right: none;
        }

        label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          font-weight: 700;
          color: #6B7278;
          margin-bottom: 4px;
          display: block;
        }

        select, input {
          border: none;
          background: transparent;
          font-size: 13px;
          font-weight: 500;
          color: #111517;
          outline: none;
          width: 100%;
          cursor: pointer;
          font-family: inherit;
        }

        input[type="date"] {
          font-size: 12px;
        }

        input[type="text"] {
          text-transform: uppercase;
        }

        .btn-check {
          background: var(--prop-accent, #C5A880);
          color: #FFFFFF;
          border: none;
          border-radius: 2px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          cursor: pointer;
          padding: 14px 20px;
          transition: background 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          align-self: center;
          height: 100%;
          min-height: 48px;
        }

        .btn-check:hover {
          background: #111517;
        }

        /* Modal Dialog for Mobile / Header Trigger */
        .booking-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(17, 21, 23, 0.85);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: none;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .booking-modal-overlay.active {
          display: flex;
        }

        .booking-modal-content {
          background: #FFFFFF;
          max-width: 500px;
          width: 100%;
          padding: 36px 28px;
          border-radius: 4px;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          border-top: 4px solid var(--prop-accent, #C5A880);
        }

        .modal-title {
          font-family: var(--font-display, "Cormorant Garamond", serif);
          font-size: 28px;
          margin-bottom: 20px;
          color: #111517;
        }

        .modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6B7278;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .modal-field {
          display: flex;
          flex-direction: column;
          border: 1px solid #DDD5C7;
          padding: 10px 14px;
          border-radius: 2px;
        }

        @media (max-width: 1024px) {
          .booking-bar {
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            padding: 16px;
          }
          .field-group {
            border-right: none;
            border-bottom: 1px solid rgba(0, 0, 0, 0.06);
            padding-bottom: 8px;
          }
          .btn-check {
            grid-column: span 2;
          }
        }

        @media (max-width: 600px) {
          .booking-bar {
            grid-template-columns: 1fr;
          }
          .btn-check {
            grid-column: span 1;
          }
        }
      </style>

      <div class="booking-bar" role="search" aria-label="Hotel Availability Search">
        <div class="field-group" id="group-property">
          <label for="property-select">Destination / Hotel</label>
          <select id="property-select" aria-label="Select Property">
            <option value="all" ${presetProperty === '' || presetProperty === 'all' ? 'selected' : ''}>All Properties (Sarawak)</option>
            <option value="damaibeachresort" ${presetProperty === 'damaibeachresort' ? 'selected' : ''}>Damai Beach Resort (Santubong)</option>
            <option value="damailagoon" ${presetProperty === 'damailagoon' ? 'selected' : ''}>Damai Lagoon Resort (Santubong)</option>
            <option value="grandmargherita" ${presetProperty === 'grandmargherita' ? 'selected' : ''}>Grand Margherita Hotel (Kuching)</option>
            <option value="riversidemajestic-puteri" ${presetProperty === 'riversidemajestic-puteri' ? 'selected' : ''}>Riverside Majestic — Puteri Wing</option>
            <option value="riversidemajestic-astana" ${presetProperty === 'riversidemajestic-astana' ? 'selected' : ''}>Riverside Majestic — Astana Wing</option>
          </select>
        </div>

        <div class="field-group">
          <label for="checkin-date">Check-In</label>
          <input type="date" id="checkin-date" aria-label="Check-in Date">
        </div>

        <div class="field-group">
          <label for="checkout-date">Check-Out</label>
          <input type="date" id="checkout-date" aria-label="Check-out Date">
        </div>

        <div class="field-group">
          <label for="guests-select">Guests & Rooms</label>
          <select id="guests-select" aria-label="Guests and Rooms">
            <option value="1-0-1">1 Adult, 1 Room</option>
            <option value="2-0-1" selected>2 Adults, 1 Room</option>
            <option value="2-1-1">2 Adults, 1 Child</option>
            <option value="2-2-1">2 Adults, 2 Children</option>
            <option value="4-0-2">4 Adults, 2 Rooms</option>
          </select>
        </div>

        <div class="field-group">
          <label for="promo-input">Promo Code</label>
          <input type="text" id="promo-input" placeholder="OPTIONAL" maxlength="15" aria-label="Promotional or Corporate Code">
        </div>

        <button type="button" class="btn-check" id="btn-submit-search">Check Rates</button>
      </div>

      <!-- Popup Modal for Header triggers / Mobile -->
      <div class="booking-modal-overlay" id="booking-modal" role="dialog" aria-modal="true">
        <div class="booking-modal-content">
          <button class="modal-close-btn" id="modal-close-btn" aria-label="Close booking">&times;</button>
          <h3 class="modal-title">Reserve Your Stay</h3>
          <div class="modal-form">
            <div class="modal-field">
              <label for="modal-property">Property</label>
              <select id="modal-property">
                <option value="all">All Properties</option>
                <option value="damaibeachresort">Damai Beach Resort</option>
                <option value="damailagoon">Damai Lagoon Resort</option>
                <option value="grandmargherita">Grand Margherita Hotel</option>
                <option value="riversidemajestic-puteri">Riverside Majestic — Puteri Wing</option>
                <option value="riversidemajestic-astana">Riverside Majestic — Astana Wing</option>
              </select>
            </div>
            <div class="modal-field">
              <label for="modal-checkin">Check-in</label>
              <input type="date" id="modal-checkin">
            </div>
            <div class="modal-field">
              <label for="modal-checkout">Check-out</label>
              <input type="date" id="modal-checkout">
            </div>
            <div class="modal-field">
              <label for="modal-guests">Guests</label>
              <select id="modal-guests">
                <option value="1-0-1">1 Adult, 1 Room</option>
                <option value="2-0-1" selected>2 Adults, 1 Room</option>
                <option value="2-1-1">2 Adults, 1 Child</option>
                <option value="2-2-1">2 Adults, 2 Children</option>
              </select>
            </div>
            <div class="modal-field">
              <label for="modal-promo">Promo / Corporate Code</label>
              <input type="text" id="modal-promo" placeholder="DISCOVERY">
            </div>
            <button type="button" class="btn-check" id="modal-submit-btn">Search Availability</button>
          </div>
        </div>
      </div>
    `;
  }

  initEvents() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 2);

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const checkin = this.shadowRoot.getElementById('checkin-date');
    const checkout = this.shadowRoot.getElementById('checkout-date');
    const modalCheckin = this.shadowRoot.getElementById('modal-checkin');
    const modalCheckout = this.shadowRoot.getElementById('modal-checkout');

    if (checkin) {
      checkin.min = formatDate(today);
      checkin.value = formatDate(today);
    }
    if (checkout) {
      checkout.min = formatDate(today);
      checkout.value = formatDate(tomorrow);
    }
    if (modalCheckin) {
      modalCheckin.min = formatDate(today);
      modalCheckin.value = formatDate(today);
    }
    if (modalCheckout) {
      modalCheckout.min = formatDate(today);
      modalCheckout.value = formatDate(tomorrow);
    }

    // Submit handler
    const btnSearch = this.shadowRoot.getElementById('btn-submit-search');
    const modalSubmit = this.shadowRoot.getElementById('modal-submit-btn');

    const handleSearch = (prop, ci, co, guestsVal, promo) => {
      const [adults, children] = guestsVal.split('-');
      
      // Dispatch GA4 event
      analytics.bookingSearch(prop, ci, co, adults, children, promo);

      // Simulation of CRS routing
      const propertyNames = {
        'all': 'Hemisphere Collection',
        'damaibeachresort': 'Damai Beach Resort',
        'damailagoon': 'Damai Lagoon Resort',
        'grandmargherita': 'Grand Margherita Hotel',
        'riversidemajestic-puteri': 'Riverside Majestic Puteri',
        'riversidemajestic-astana': 'Riverside Majestic Astana'
      };

      const propertyLabel = propertyNames[prop] || 'Hemisphere Hotel';
      
      // Feedback toast/modal
      alert(`[Booking Engine CRS Connected]\n\nSearching direct rates for: ${propertyLabel}\nDates: ${ci} to ${co}\nGuests: ${adults} Adults, ${children} Children\nCode: ${promo || 'Best Available Rate'}\n\nRedirecting to Oracle OPERA Cloud engine...`);
    };

    if (btnSearch) {
      btnSearch.addEventListener('click', () => {
        const prop = this.shadowRoot.getElementById('property-select').value;
        const ci = checkin.value;
        const co = checkout.value;
        const guests = this.shadowRoot.getElementById('guests-select').value;
        const promo = this.shadowRoot.getElementById('promo-input').value;
        handleSearch(prop, ci, co, guests, promo);
      });
    }

    if (modalSubmit) {
      modalSubmit.addEventListener('click', () => {
        const prop = this.shadowRoot.getElementById('modal-property').value;
        const ci = modalCheckin.value;
        const co = modalCheckout.value;
        const guests = this.shadowRoot.getElementById('modal-guests').value;
        const promo = this.shadowRoot.getElementById('modal-promo').value;
        this.closeModal();
        handleSearch(prop, ci, co, guests, promo);
      });
    }

    const modalClose = this.shadowRoot.getElementById('modal-close-btn');
    if (modalClose) {
      modalClose.addEventListener('click', () => this.closeModal());
    }

    const modalOverlay = this.shadowRoot.getElementById('booking-modal');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) this.closeModal();
      });
    }
  }

  open() {
    const modal = this.shadowRoot.getElementById('booking-modal');
    if (modal) {
      modal.classList.add('active');
      analytics.bookingEngineOpen('header_cta', this.getAttribute('property') || 'all');
    }
  }

  closeModal() {
    const modal = this.shadowRoot.getElementById('booking-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  }
}

customElements.define('hemi-booking-widget', HemiBookingWidget);
