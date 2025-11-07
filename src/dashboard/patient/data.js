export const DIRECTORY = {
  locations: [
    {
      name: "Mumbai",
      hospitals: [
        { id: "h1", name: "City Care Hospital", doctors: [
          { id: "d1", name: "Dr. Priya Verma", specialization: "Cardiologist", experience: 12, rating: 4.9, fee: 900, languages:["EN","HI"],
            qualifications:["MBBS (AIIMS)", "MD Cardiology (KEM)", "FACC"],
            services:["Angiography", "Angioplasty", "Heart Health Screening", "Hypertension Management"],
            education:["AIIMS, New Delhi — MBBS", "KEM Hospital, Mumbai — MD Cardiology"],
            achievements:["Gold Medalist - Cardiology (2014)", "Best Interventional Cardiologist - West Zone (2022)"],
            availability:["Mon-Fri 10:00-13:00", "Sat 11:00-14:00"],
            photo: "https://i.pravatar.cc/160?img=5", bio: "Cardiologist with 12 years of experience in interventional cardiology and preventive care." },
          { id: "d2", name: "Dr. Rohan Mehta", specialization: "Orthopedic", experience: 9, rating: 4.6, fee: 750, languages:["EN","HI"],
            qualifications:["MBBS", "MS Orthopedics"],
            services:["Sports Injury", "Knee Replacement", "Arthroscopy"],
            education:["Grant Medical College — MBBS", "Seth GS Medical College — MS Ortho"],
            achievements:["Young Surgeon Award (2020)"],
            availability:["Tue-Thu 16:00-19:00", "Sat 10:00-13:00"],
            photo: "https://i.pravatar.cc/160?img=12", bio: "Orthopedic surgeon specializing in sports injuries and joint replacements." }
        ]}
      ]
    },
    {
      name: "Bengaluru",
      hospitals: [
        { id: "h2", name: "Green Valley Clinic", doctors: [
          { id: "d3", name: "Dr. Arjun Rao", specialization: "Dermatologist", experience: 8, rating: 4.7, fee: 650, languages:["EN","KA"],
            qualifications:["MBBS", "MD Dermatology"],
            services:["Acne Treatment", "Chemical Peels", "Cosmetic Dermatology"],
            education:["St. Johns — MBBS", "NIMHANS — MD Dermatology"],
            achievements:["Best Paper - Cosmetic Dermatology Conf (2021)"],
            availability:["Mon, Wed, Fri 12:00-16:00"],
            photo: "https://i.pravatar.cc/160?img=20", bio: "Dermatologist focused on clinical and cosmetic dermatology." }
        ]}
      ]
    },
    {
      name: "Pune",
      hospitals: [
        { id: "h3", name: "Lotus Health Center", doctors: [
          { id: "d4", name: "Dr. Sneha Iyer", specialization: "Pediatrician", experience: 11, rating: 4.8, fee: 700, languages:["EN","MR"],
            qualifications:["MBBS", "DCH", "MD Pediatrics"],
            services:["Child Wellness", "Vaccination", "Growth & Nutrition"],
            education:["BJ Medical College — MBBS", "Sassoon — MD Pediatrics"],
            achievements:["Pediatric Care Excellence (2023)"],
            availability:["Mon-Sat 10:00-13:00"],
            photo: "https://i.pravatar.cc/160?img=32", bio: "Pediatrician passionate about child wellness and vaccination." }
        ]}
      ]
    }
  ]
};
