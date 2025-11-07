// Centralized doctor data for profile pages
export const DOCTORS = {
  d11: { id: 'd11', name: 'Dr. A. Mehta', spec: 'Cardiologist', exp: 12, rating: 4.7, fee: 800, lang: ['EN','HI'], city: 'Mumbai', hospital: 'CityCare Hospital', bio: 'Experienced cardiologist specializing in preventive cardiology and heart failure management.', prev: [
    { place: 'CityCare Hospital', role: 'Senior Cardiologist', years: '2021–Present' },
    { place: 'Metro Heart Institute', role: 'Consultant', years: '2017–2021' },
    { place: 'Medilife Clinic', role: 'Resident', years: '2014–2017' }
  ] },
  d12: { id: 'd12', name: 'Dr. R. Kulkarni', spec: 'Orthopedic', exp: 9, rating: 4.5, fee: 600, lang: ['EN','MR'], city: 'Mumbai', hospital: 'CityCare Hospital', bio: 'Orthopedic surgeon with focus on sports injuries and joint replacement.', prev: [
    { place: 'CityCare Hospital', role: 'Orthopedic Surgeon', years: '2020–Present' },
    { place: 'Western Ortho Center', role: 'Registrar', years: '2016–2020' }
  ] },
  d13: { id: 'd13', name: 'Dr. S. Kapoor', spec: 'Dermatologist', exp: 8, rating: 4.4, fee: 650, lang: ['EN','HI'], city: 'Mumbai', hospital: 'Lotus Multispeciality', bio: 'Dermatologist treating acne, pigment disorders, and cosmetic dermatology.',
    title: 'MBBS, MD — Dermatologist & Skin Specialist',
    photo: '/images/doctors/kapoor.jpg',
    cover: '/images/clinic/derma-cover.jpg',
    services: [
      { title: 'Laser Treatment', desc: 'Advanced laser therapy for skin rejuvenation and scar removal.' },
      { title: 'Acne & Scar Treatment', desc: 'Personalized acne solutions for clear, smooth skin.' },
      { title: 'Hair Restoration', desc: 'Techniques for effective hair growth and scalp health.' }
    ],
    gallery: [
      '/images/clinic/derma-1.jpg',
      '/images/clinic/derma-2.jpg',
      '/images/clinic/derma-3.jpg'
    ],
    contact: {
      address: '45/A Health Street, Mumbai, India',
      phone: '+91 98765 43210',
      email: 'dr.kapoor@example.com',
      timings: 'Mon – Sat, 9:00 AM – 6:00 PM'
    },
    prev: [
      { place: 'Lotus Multispeciality', role: 'Dermatologist', years: '2019–Present' },
      { place: 'SkinCare Clinic', role: 'Junior Consultant', years: '2016–2019' }
    ]
  },
  d21: { id: 'd21', name: 'Dr. P. Rao', spec: 'Pediatrician', exp: 10, rating: 4.6, fee: 700, lang: ['EN','KA'], city: 'Bengaluru', hospital: 'GreenLeaf Hospital', bio: 'Pediatric specialist with emphasis on growth, nutrition, and vaccinations.', prev: [
    { place: 'GreenLeaf Hospital', role: 'Pediatric Consultant', years: '2020–Present' },
    { place: 'City Children Hospital', role: 'Senior Resident', years: '2015–2020' }
  ] },
  d22: { id: 'd22', name: 'Dr. M. Iyer', spec: 'ENT', exp: 7, rating: 4.2, fee: 550, lang: ['EN','KA'], city: 'Bengaluru', hospital: 'GreenLeaf Hospital', bio: 'ENT consultant managing sinusitis, allergies, and voice disorders.', prev: [
    { place: 'GreenLeaf Hospital', role: 'ENT Consultant', years: '2021–Present' },
    { place: 'Voice & Airway Center', role: 'Registrar', years: '2018–2021' }
  ] },
  d23: { id: 'd23', name: 'Dr. G. Nair', spec: 'General Physician', exp: 11, rating: 4.5, fee: 500, lang: ['EN','ML'], city: 'Bengaluru', hospital: 'TechCity Care', bio: 'General medicine with focus on diabetes and hypertension.', prev: [
    { place: 'TechCity Care', role: 'Consultant Physician', years: '2019–Present' },
    { place: 'City General', role: 'Medical Officer', years: '2013–2019' }
  ] },
  d31: { id: 'd31', name: 'Dr. K. Deshmukh', spec: 'Neurologist', exp: 13, rating: 4.6, fee: 900, lang: ['EN','MR'], city: 'Pune', hospital: 'Horizon Clinic', bio: 'Neurologist with expertise in stroke care and epilepsy.', prev: [
    { place: 'Horizon Clinic', role: 'Senior Neurologist', years: '2018–Present' },
    { place: 'NeuroLife Institute', role: 'Consultant', years: '2012–2018' }
  ] },
  d32: { id: 'd32', name: 'Dr. V. Patil', spec: 'Dermatologist', exp: 6, rating: 4.3, fee: 600, lang: ['EN','MR'], city: 'Pune', hospital: 'RiverSide Hospital', bio: 'Dermatologist focusing on hair disorders and pediatric dermatology.', prev: [
    { place: 'RiverSide Hospital', role: 'Dermatologist', years: '2020–Present' }
  ] },
  d41: { id: 'd41', name: 'Dr. R. Khanna', spec: 'Cardiologist', exp: 15, rating: 4.8, fee: 1000, lang: ['EN','HI'], city: 'Delhi', hospital: 'Capital Health', bio: 'Interventional cardiologist performing angioplasty and complex cardiac procedures.', prev: [
    { place: 'Capital Health', role: 'Head of Cardiology', years: '2019–Present' },
    { place: 'National Heart Center', role: 'Interventional Cardiologist', years: '2012–2019' }
  ] },
  d42: { id: 'd42', name: 'Dr. T. Anand', spec: 'Orthopedic', exp: 9, rating: 4.4, fee: 700, lang: ['EN','HI'], city: 'Delhi', hospital: 'North Star Hospital', bio: 'Orthopedic surgeon specializing in arthroscopy and trauma.', prev: [
    { place: 'North Star Hospital', role: 'Orthopedic Surgeon', years: '2020–Present' },
    { place: 'TraumaCare Unit', role: 'Registrar', years: '2016–2020' }
  ] },
};

export function getDoctorById(id){
  return DOCTORS[id] || null;
}
