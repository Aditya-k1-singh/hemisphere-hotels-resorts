/**
 * Hemisphere Hotels & Resorts — Unified Analytics Event Layer
 * Compatible with Google Analytics 4 (GA4), GTM dataLayer, and Meta Pixel hooks.
 */

window.dataLayer = window.dataLayer || [];

export function trackEvent(eventName, params = {}) {
  const eventPayload = {
    event: eventName,
    timestamp: new Date().toISOString(),
    currency: 'MYR',
    ...params
  };

  window.dataLayer.push(eventPayload);
  
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log(`[Analytics Event: ${eventName}]`, eventPayload);
  }
}

// Predefined event helpers
export const analytics = {
  bookingSearch: (property, checkin, checkout, adults, children, promoCode) => {
    trackEvent('booking_search', {
      property,
      checkin_date: checkin,
      checkout_date: checkout,
      adults: Number(adults),
      children: Number(children),
      promo_code: promoCode || 'NONE'
    });
  },

  bookingEngineOpen: (source, property) => {
    trackEvent('booking_engine_open', { source, property });
  },

  propertyView: (propertySlug, propertyName, category) => {
    trackEvent('property_view', {
      property_id: propertySlug,
      property_name: propertyName,
      property_category: category
    });
  },

  roomView: (propertySlug, roomId, roomName, priceEstimate) => {
    trackEvent('room_view', {
      property_id: propertySlug,
      room_id: roomId,
      room_name: roomName,
      value: priceEstimate
    });
  },

  offerView: (offerId, offerTitle, property) => {
    trackEvent('offer_view', {
      offer_id: offerId,
      offer_title: offerTitle,
      property
    });
  },

  offerClick: (offerId, offerTitle, property) => {
    trackEvent('offer_click', {
      offer_id: offerId,
      offer_title: offerTitle,
      property
    });
  },

  diningReservation: (property, restaurantName, guests, date, time) => {
    trackEvent('restaurant_reservation', {
      property,
      restaurant_name: restaurantName,
      party_size: guests,
      reservation_date: date,
      reservation_time: time
    });
  },

  eventEnquiry: (property, eventType, estimatedGuests) => {
    trackEvent('event_enquiry', {
      property,
      event_type: eventType,
      estimated_guests: estimatedGuests
    });
  },

  weddingEnquiry: (property, estimatedGuests, preferredDate) => {
    trackEvent('wedding_enquiry', {
      property,
      estimated_guests: estimatedGuests,
      preferred_date: preferredDate
    });
  },

  newsletterSignup: (source) => {
    trackEvent('newsletter_signup', { source });
  },

  loyaltyRegister: (tier) => {
    trackEvent('loyalty_register', { tier: tier || 'SILVER' });
  },

  crossPropertyClick: (sourceProperty, destinationProperty) => {
    trackEvent('cross_property_click', {
      source_property: sourceProperty,
      destination_property: destinationProperty
    });
  }
};
