// Minimal doctors dataset restored for DoctorProfile

export const DOCTORS = {
  // Mumbai
  d11: {
    id: 'd11', name: 'Dr. A. Mehta', spec: 'Cardiologist', exp: 12, rating: 4.7, fee: 800,
    lang: ['English','Hindi'], city: 'Mumbai', hospital: 'CityCare Hospital',
    bio: 'Cardiologist with focus on lifestyle modification and preventive care.',
  },
  d12: {
    id: 'd12', name: 'Dr. R. Kulkarni', spec: 'Orthopedic', exp: 9, rating: 4.5, fee: 600,
    lang: ['English','Marathi'], city: 'Mumbai', hospital: 'CityCare Hospital',
    bio: 'Orthopedic specialist for sports injuries and joint care.',
  },
  d13: {
    id: 'd13',
    name: 'Dr. S. Kapoor',
    spec: 'Dermatologist',
    exp: 12,
    rating: 4.7,
    fee: 700,
    lang: ['English', 'Hindi'],
    city: 'Mumbai',
    hospital: 'HeartCare Clinic',
    bio: 'Experienced cardiologist with a focus on preventive care and patient education.',
    title: 'Senior Consultant Cardiologist',
    photo: '/images/doctors/d13.jpg',
    cover: '/images/clinic/cover1.jpg',
    prev: [
      { place: 'Global Heart Institute', years: '2018-2023', role: 'Consultant' },
      { place: 'City Hospital', years: '2014-2018', role: 'Resident' },
    ],
    services: [
      { title: 'Cardiac Screening', desc: 'ECG, ECHO, lipid profile and risk assessment.' },
      { title: 'Hypertension Care', desc: 'Personalized BP management plans.' },
    ],
    gallery: [
      '/images/clinic/room1.jpg',
      '/images/clinic/room2.jpg'
    ],
    contact: {
      address: '12, Palm Street, Mumbai',
      phone: '+91-90000-12345',
      email: 'skapoor@heartcare.example',
      timings: 'Mon-Sat, 10:00 AM - 6:00 PM'
    },
  },
  // Bengaluru
  d21: {
    id: 'd21', name: 'Dr. P. Rao', spec: 'Pediatrician', exp: 10, rating: 4.6, fee: 700,
    lang: ['English','Kannada'], city: 'Bengaluru', hospital: 'GreenLeaf Hospital',
    bio: 'Pediatrician passionate about child wellness and vaccinations.',
  },
  d22: {
    id: 'd22', name: 'Dr. M. Iyer', spec: 'ENT', exp: 7, rating: 4.2, fee: 550,
    lang: ['English','Kannada'], city: 'Bengaluru', hospital: 'GreenLeaf Hospital',
    bio: 'ENT specialist handling sinusitis and hearing issues.',
  },
  d23: {
    id: 'd23', name: 'Dr. G. Nair', spec: 'General Physician', exp: 11, rating: 4.5, fee: 500,
    lang: ['English','Malayalam'], city: 'Bengaluru', hospital: 'TechCity Care',
    bio: 'General physician for primary care and chronic disease management.',
  },

  // Pune
  d31: {
    id: 'd31', name: 'Dr. K. Deshmukh', spec: 'Neurologist', exp: 13, rating: 4.6, fee: 900,
    lang: ['English','Marathi'], city: 'Pune', hospital: 'Horizon Clinic',
    bio: 'Neurologist focusing on headache, stroke and epilepsy care.',
  },
  d32: {
    id: 'd32', name: 'Dr. V. Patil', spec: 'Dermatologist', exp: 6, rating: 4.3, fee: 600,
    lang: ['English','Marathi'], city: 'Pune', hospital: 'RiverSide Hospital',
    bio: 'Dermatologist treating acne, eczema and cosmetic dermatology.',
  },

  // Delhi
  d41: {
    id: 'd41', name: 'Dr. R. Khanna', spec: 'Cardiologist', exp: 15, rating: 4.8, fee: 1000,
    lang: ['English','Hindi'], city: 'Delhi', hospital: 'Capital Health',
    bio: 'Interventional cardiologist with 15+ years experience.',
  },
  d42: {
    id: 'd42', name: 'Dr. T. Anand', spec: 'Orthopedic', exp: 9, rating: 4.4, fee: 700,
    lang: ['English','Hindi'], city: 'Delhi', hospital: 'North Star Hospital',
    bio: 'Orthopedic surgeon with interest in trauma and arthroscopy.',
  },

  // Recommended demo IDs used in BookingPage
  r1: {
    id: 'r1', name: 'Dr. Priya Verma', spec: 'Cardiologist', exp: 14, rating: 4.9, fee: 900,
    lang: ['English','Hindi'], city: 'Mumbai', hospital: 'Prime Heart Institute',
    bio: 'Top-rated cardiologist with expertise in cardiac imaging.',
  },
  r2: {
    id: 'r2', name: 'Dr. Arjun Rao', spec: 'Dermatologist', exp: 9, rating: 4.8, fee: 750,
    lang: ['English','Kannada'], city: 'Bengaluru', hospital: 'SkinCare Center',
    bio: 'Dermatologist specializing in laser and cosmetic procedures.',
  },
};

export function getDoctorById(id) {
  return DOCTORS[id] || null;
}
