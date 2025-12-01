const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load models
const Event = require('./models/Event');
const Gallery = require('./models/Gallery');
const Testimonial = require('./models/Testimonial');
const Announcement = require('./models/Announcement');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Sample data
const events = [
  {
    title: 'Sunday Meditation Session',
    description: 'Join us for our weekly guided meditation and mindfulness practice',
    date: new Date('2024-12-15'),
    time: '10:00 AM',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
    location: 'CBMC Main Hall'
  },
  {
    title: 'Buddha Purnima Celebration',
    description: 'Celebrate the birth of Buddha with prayers, meditation, and community gathering',
    date: new Date('2024-12-20'),
    time: '9:00 AM',
    image: 'https://images.unsplash.com/photo-1544979590-37e9b47eb705',
    location: 'CBMC Temple'
  },
  {
    title: 'Mindfulness Workshop',
    description: 'Learn practical mindfulness techniques for daily life',
    date: new Date('2024-12-25'),
    time: '2:00 PM',
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e',
    location: 'CBMC Meditation Room'
  }
];

const galleries = [
  {
    category: 'Buddha Purnima',
    icon: '🎉',
    images: [
      { url: 'https://images.unsplash.com/photo-1544979590-37e9b47eb705', caption: 'Buddha Purnima Celebration' },
      { url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7', caption: 'Prayer Ceremony' },
      { url: 'https://images.unsplash.com/photo-1604881991720-f91add269bed', caption: 'Community Gathering' }
    ],
    order: 1
  },
  {
    category: 'Meditation Sessions',
    icon: '🧘',
    images: [
      { url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773', caption: 'Group Meditation' },
      { url: 'https://images.unsplash.com/photo-1545389336-cf090694435e', caption: 'Mindfulness Practice' },
      { url: 'https://images.unsplash.com/photo-1599447292530-33146cd4d126', caption: 'Guided Meditation' }
    ],
    order: 2
  },
  {
    category: 'Cultural Programs',
    icon: '🎊',
    images: [
      { url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3', caption: 'Cultural Dance' },
      { url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18', caption: 'Music Performance' }
    ],
    order: 3
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Member since 2020',
    text: 'CBMC has transformed my life. The meditation practices and supportive community have brought me peace and clarity.',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'Member since 2019',
    text: 'I am grateful for the teachings and guidance I receive here. The center has become my spiritual home.',
    rating: 5
  },
  {
    name: 'Priya Patel',
    role: 'Member since 2021',
    text: 'The weekly meditation sessions have helped me manage stress and find inner peace. Highly recommended!',
    rating: 5
  }
];

const announcement = {
  badge: 'NEW',
  text: 'Join us for our special Buddha Purnima celebration on December 20th!',
  cta: 'Learn More',
  ctaLink: '#events',
  isActive: true,
  priority: 1
};

// Seed database
const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await Event.deleteMany();
    await Gallery.deleteMany();
    await Testimonial.deleteMany();
    await Announcement.deleteMany();
    
    console.log('✅ Cleared existing data');

    // Insert sample data
    await Event.insertMany(events);
    console.log('✅ Events seeded');

    await Gallery.insertMany(galleries);
    console.log('✅ Gallery categories seeded');

    await Testimonial.insertMany(testimonials);
    console.log('✅ Testimonials seeded');

    await Announcement.create(announcement);
    console.log('✅ Announcement seeded');

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
