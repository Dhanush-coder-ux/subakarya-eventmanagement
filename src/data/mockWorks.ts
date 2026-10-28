import { WorkSample } from '../types';

export const mockWorks: WorkSample[] = [
  // Lumière Studios (pro-1)
  {
    id: 'wrk-1',
    professionalId: 'pro-1',
    title: 'The Royal Chettinad Wedding — Ananya & Siddharth',
    eventType: 'Heritage Wedding',
    eventDate: '2026-09-18',
    location: 'Chidambara Vilas, Kadiapatti, TN',
    description: 'A three-day heritage celebration featuring traditional rituals, vintage car bridal entrance, and a candlelight evening reception with over 1,200 attendees.',
    galleryUrls: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
    ],
    servicesDelivered: [
      'Traditional Candid Photography',
      '4K Cinematic Feature Film',
      'Licensed Aerial Drone Cinematography',
      '2 Custom Embossed Leatherette Albums',
    ],
    createdAt: '2026-09-22T10:00:00Z',
  },
  {
    id: 'wrk-2',
    professionalId: 'pro-1',
    title: 'Emerald Sunset Engagement — Divya & Vikram',
    eventType: 'Engagement & Ring Ceremony',
    eventDate: '2026-08-05',
    location: 'Kodaikanal Lakefront Lawns',
    description: 'Intimate mountain hilltop engagement shoot under misty pine trees followed by an outdoor fairy-light ring exchange banquet.',
    galleryUrls: [
      'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
    ],
    servicesDelivered: [
      'Couple Portraits Session',
      'Candid Event Photography',
      'Same-Day Edit Video Reel',
    ],
    createdAt: '2026-08-08T12:00:00Z',
  },

  // Aria Grand Palace (pro-2)
  {
    id: 'wrk-3',
    professionalId: 'pro-2',
    title: 'The Nadar-Chettiar Grand Reception (1,400 Guests)',
    eventType: 'Wedding Reception',
    eventDate: '2026-09-10',
    location: 'Aria Grand Heritage Ballroom, Madurai',
    description: 'A lavish reception banquet filling both the central air-conditioned ballroom and the poolside terrace garden.',
    galleryUrls: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=800&q=80',
    ],
    servicesDelivered: [
      'Full Venue Rental & 2 Green Rooms',
      'VIP Valet Coordination for 250 Vehicles',
      'Stage Structural Rigging',
    ],
    createdAt: '2026-09-12T16:00:00Z',
  },

  // Saffron Royal Feast Caterers (pro-3)
  {
    id: 'wrk-4',
    professionalId: 'pro-3',
    title: '5-Course Muhurtham Breakfast & Grand Feast (800 Guests)',
    eventType: 'Traditional Muhurtham',
    eventDate: '2026-10-02',
    location: 'Madurai Meenakshi Kalyana Mandapam',
    description: 'Served 800 guests in rolling traditional seating batches with our signature Ghee Pongal, Poori Chana, and afternoon 24-dish Virundhu Sapadu.',
    galleryUrls: [
      'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    ],
    servicesDelivered: [
      'Breakfast Tiffin Counter (6 Items)',
      'Traditional 24-Item Virundhu Feast',
      'Live Elaneer Payasam Bar',
    ],
    createdAt: '2026-10-04T18:00:00Z',
  },
];
