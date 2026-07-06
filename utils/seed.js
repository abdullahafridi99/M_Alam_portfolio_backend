import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Setting from '../models/Setting.js';
import PracticeArea from '../models/PracticeArea.js';
import Blog from '../models/Blog.js';
import Case from '../models/Case.js';
import Testimonial from '../models/Testimonial.js';
import FAQ from '../models/FAQ.js';
import Service from '../models/Service.js';

dotenv.config();

const defaultPracticeAreas = [
  {
    title: 'Civil Law',
    description: 'We handle property disputes, breach of contract, defamation, family matters, inheritance claims, and recovery cases. Our approach ensures smooth, evidence-driven resolutions in district and high courts.',
    icon: 'FaBalanceScale',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    services: [
      'Property & Title Disputes',
      'Execution of Wills & Probate',
      'Rent & Tenant Litigation',
      'Recovery of Monies & Damages Claims',
    ],
    faqs: [
      {
        question: 'What is the statute of limitations for filing a civil lawsuit in Pakistan?',
        answer: 'Generally, the Limitation Act prescribes specific timeframes ranging from 1 to 6 years depending on the nature of the claim (e.g., 3 years for recovery of money, 12 years for recovery of immovable property). Early legal consultation is highly advised.',
      },
      {
        question: 'What are the main stages of civil litigation?',
        answer: 'Civil litigation typically goes through: Filing of Plaint, Issuance of Summons, Written Statement from Defendant, Framing of Issues, Evidence recording of both parties, Final Arguments, and the Decree/Judgment.',
      },
    ],
  },
  {
    title: 'Criminal Law',
    description: 'Aggressive defence representation for charges ranging from white-collar crimes and fraud to bail hearings, trials, and appellate procedures. We stand for justice and fair trial rights.',
    icon: 'FaGavel',
    image: 'https://images.unsplash.com/photo-1505664194779-8bebcb95df84?auto=format&fit=crop&w=800&q=80',
    services: [
      'Pre-Arrest and Post-Arrest Bail applications',
      'F.I.R Quashment petitions',
      'Trial Defense & Cross-Examinations',
      'Criminal Appeals and Revisions in High Court',
    ],
    faqs: [
      {
        question: 'What is the difference between pre-arrest bail and post-arrest bail?',
        answer: 'Pre-arrest bail (anticipatory bail) is secured before the police take you into custody to prevent humilation or malicious arrest. Post-arrest bail is applied for after an arrest has already been executed.',
      },
    ],
  },
  {
    title: 'Corporate Law',
    description: 'Empowering companies with robust entity formations, regulatory compliance, SECP registrations, custom drafting of shareholder agreements, and contract negotiations.',
    icon: 'FaBriefcase',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    services: [
      'SECP Company Registration & Joint Ventures',
      'Corporate Governance & Legal Compliance audits',
      'IPR, Trademark, & Patent filing',
      'Share Purchase and Partnership Agreements',
    ],
    faqs: [
      {
        question: 'How long does it take to register a private limited company with SECP?',
        answer: 'With proper documentation, it usually takes between 3 to 7 working days to complete name reservation, digital signature setup, and final incorporation certificate issuance.',
      },
    ],
  },
  {
    title: 'Family Law',
    description: 'Compassionate and expert guidance through divorce (Khula), child custody disputes, maintenance allowance calculation, and dower/dowry recovery cases.',
    icon: 'FaUsers',
    image: 'https://images.unsplash.com/photo-1591115765373-5209708f7f6f?auto=format&fit=crop&w=800&q=80',
    services: [
      'Divorce (Talaq/Khula) Litigation',
      'Guardianship & Child Custody petitions',
      'Recovery of Dowry Articles & Dower amount',
      'Maintenance Claims for Wife and Children',
    ],
    faqs: [
      {
        question: 'Can a mother automatically get custody of children after divorce?',
        answer: 'The primary consideration is always the welfare of the minor. Under Islamic Law, the mother generally gets Hizanat (custody) up to the age of 7 for boys and puberty for girls, subject to the court verifying her suitability and the welfare of the child.',
      },
    ],
  },
];

const defaultServices = [
  {
    title: 'Legal Consultation',
    description: 'One-on-one session to evaluate your case, discuss legal options, and formulate a clear strategy forward.',
  },
  {
    title: 'Court Representation',
    description: 'Dedicated advocacy in District Courts, High Courts, and specialized tribunals for civil, criminal, and corporate litigation.',
  },
  {
    title: 'Contract Drafting',
    description: 'Meticulous drafting and vetting of Partnership deeds, Sales deeds, NDAs, Employment agreements, and Commercial contracts.',
  },
  {
    title: 'Mediation & Arbitration',
    description: 'Out-of-court dispute resolution services to resolve conflicts efficiently without the stress of prolonged litigation.',
  },
];

const defaultBlogs = [
  {
    title: 'Understanding Company Registration in Pakistan',
    content: '<p>Registering a company in Pakistan is a structured process governed by the Securities and Exchange Commission of Pakistan (SECP). Whether you are a local entrepreneur or an international investor, understanding the legal framework is essential for a smooth startup launch.</p><h3>Key Steps for Company Incorporation:</h3><ol><li><strong>Name Reservation:</strong> Choose a unique name that does not conflict with existing brands or violate public decency guidelines.</li><li><strong>Filing Documents:</strong> Submit the Memorandum of Association (MOA) and Articles of Association (AOA) explaining business operations.</li><li><strong>Registration Fees:</strong> Pay the necessary processing fees via designated bank partners.</li><li><strong>SECP Certificate:</strong> Upon verification, SECP issues the Incorporation Certificate.</li></ol><p>Engaging an experienced corporate advocate ensures compliance, safeguards intellectual property, and drafts robust shareholder agreements from day one.</p>',
    category: 'Corporate Law',
    tags: ['SECP', 'Company Registration', 'Corporate Law', 'Pakistan'],
    seoTitle: 'How to Register a Company in Pakistan | SECP Corporate Guide',
    seoDescription: 'Learn the exact steps, required documents, and legal guidelines to register your private limited company with SECP in Pakistan.',
  },
  {
    title: 'Child Custody and Guardianship Laws',
    content: '<p>Under Pakistan legal frameworks, child custody (Hizanat) cases are resolved under the Guardians and Wards Act, 1890. While traditional rules outline parent roles, the Family Courts always hold the "welfare of the minor" as the supreme guiding principle.</p><h3>What is the Welfare of the Minor?</h3><p>The courts inspect multiple dimensions before deciding custody:</p><ul><li>Financial capability and moral character of each parent.</li><li>Educational facilities and environment available to the child.</li><li>The child\'s own preference if they are old enough to express a rational opinion.</li><li>Any past history of abuse or abandonment.</li></ul><p>Our firm specializes in presenting detailed, fact-based evidence to help parents secure custody arrangements that protect their children\'s long-term future.</p>',
    category: 'Family Law',
    tags: ['Family Law', 'Child Custody', 'Guardianship', 'Legal Rights'],
    seoTitle: 'Child Custody Laws in Pakistan | Guardian & Wards Act Guide',
    seoDescription: 'An expert guide outlining how family courts in Pakistan decide child custody and guardianship petitions under the Guardians and Wards Act.',
  },
];

const defaultCases = [
  {
    title: 'Acquittal in Major White-Collar Fraud Case',
    clientType: 'Corporate Executive',
    challenge: 'The client was falsely accused of embezzling company funds amounting to 50 million PKR based on forged ledger entries.',
    strategy: 'We conducted a comprehensive forensic audit of corporate accounts, cross-examined key prosecution witnesses, and proved that the signature logs were manipulated.',
    result: 'The Honorable Session Court acquitted the client of all charges and ordered a probe into the malicious allegations.',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Successful Resolution of Property Inheritance Dispute',
    clientType: 'Private Family Group',
    challenge: 'A multi-generational family estate was locked in litigation for over 12 years due to contested inheritance claims and a disputed will.',
    strategy: 'We initiated an structured mediation round, presenting clear genealogical records and registered property titles to establish rightful ownership shares.',
    result: 'The parties signed a court-decreed compromise agreement, partitioning the estate fairly without further court delays.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
  },
];

const defaultTestimonials = [
  {
    clientName: 'Muhammad Salman',
    designation: 'CEO, TechNexus Pakistan',
    review: 'Advocate Mubashir Alam handled our corporate registration and tax structuring. His expertise saved us weeks of delays with SECP. Exceptionally professional legal counsel!',
    rating: 5,
  },
  {
    clientName: 'Ayesha Khan',
    designation: 'Homeowner',
    review: 'I was fighting a stressful property inheritance case for 5 years. Once Mubashir took over, he clarified the strategy, represented me aggressively, and won the partition decree.',
    rating: 5,
  },
];

const defaultFAQs = [
  {
    question: 'How do I book an appointment with Advocate Mubashir Alam?',
    answer: 'You can easily request an appointment using our online Appointment Booking form by selecting your preferred date, time slot, and practice area. You can also contact our office directly via WhatsApp.',
    category: 'General',
  },
  {
    question: 'Where is your primary office located?',
    answer: 'Our main chamber is situated at Chamber 12, District Courts Complex, Karachi, Pakistan. Please schedule a prior appointment before visiting.',
    category: 'General',
  },
  {
    question: 'Do you charge a consultation fee?',
    answer: 'Initial consultation charges depend on the complexity of the case. Please contact our front desk or submit an appointment request for pricing details.',
    category: 'General',
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mubashir_alam');
    console.log('Seed: Connected to Database...');

    // 1. Seed Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@mubashiralam.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPass123!';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      console.log('Seed: Creating default Admin user...');
      // Plain text password will be hashed via Schema pre-save hook
      await User.create({
        name: 'Mubashir Alam',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log('Seed: Admin user created successfully.');
    } else {
      console.log('Seed: Admin user already exists.');
    }

    // 2. Seed Settings
    const existingSettings = await Setting.findOne();
    if (!existingSettings) {
      console.log('Seed: Creating default Settings...');
      await Setting.create({});
      console.log('Seed: Default settings created.');
    }

    // 3. Seed Practice Areas
    await PracticeArea.deleteMany({});
    console.log('Seed: Cleared old Practice Areas. Seeding new Practice Areas...');
    for (const item of defaultPracticeAreas) {
      await PracticeArea.create(item);
    }
    console.log('Seed: Practice Areas seeded.');

    // 4. Seed Services
    await Service.deleteMany({});
    console.log('Seed: Cleared old Services. Seeding new Services...');
    for (const item of defaultServices) {
      await Service.create(item);
    }
    console.log('Seed: Services seeded.');

    // 5. Seed Blogs
    await Blog.deleteMany({});
    console.log('Seed: Cleared old Blogs. Seeding new Blogs...');
    for (const item of defaultBlogs) {
      await Blog.create(item);
    }
    console.log('Seed: Blogs seeded.');

    // 6. Seed Cases
    await Case.deleteMany({});
    console.log('Seed: Cleared old Case Studies. Seeding new Case Studies...');
    for (const item of defaultCases) {
      await Case.create(item);
    }
    console.log('Seed: Case Studies seeded.');

    // 7. Seed Testimonials
    await Testimonial.deleteMany({});
    console.log('Seed: Cleared old Testimonials. Seeding new Testimonials...');
    for (const item of defaultTestimonials) {
      await Testimonial.create(item);
    }
    console.log('Seed: Testimonials seeded.');

    // 8. Seed FAQs
    await FAQ.deleteMany({});
    console.log('Seed: Cleared old FAQs. Seeding new FAQs...');
    for (const item of defaultFAQs) {
      await FAQ.create(item);
    }
    console.log('Seed: FAQs seeded.');

    console.log('Seed: Seeding process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed: Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
