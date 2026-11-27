import {
  Award,
  BookOpen,
  Clock,
  FileText,
  GraduationCap,
  Heart,
  LifeBuoy,
  type LucideIcon,
  Shield,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

export interface ProductContent {
  slug: string;
  /** Name used in navigation, cards and the enquiry form subject. */
  name: string;
  icon: LucideIcon;
  /** One-paragraph summary used on cards. */
  summary: string;
  /** Verb for the primary action on this product. */
  actionLabel: string;
  hero: { title: string; lead: string };
  features: {
    title: string;
    lead: string;
    items: { icon: LucideIcon; title: string; desc: string }[];
  };
  steps?: {
    title: string;
    lead: string;
    items: { title: string; desc: string }[];
  };
  /** Optional grouped lists, e.g. training levels. */
  groups?: {
    title: string;
    lead: string;
    items: { title: string; desc: string; points?: string[] }[];
  }[];
  checklist: { title: string; items: string[] };
  form: { title: string; lead: string };
  cta: { title: string; lead: string };
}

export const products: ProductContent[] = [
  {
    slug: "fair-personal-loans",
    name: "Fair Personal Loans",
    icon: Wallet,
    summary:
      "Affordable personal loans for individuals without access to mainstream finance, with a quick approval process and terms that work for you.",
    actionLabel: "Apply",
    hero: {
      title: "Affordable personal loans for everyone",
      lead: "Get access to quick personal loans with affordable rates and flexible terms designed specifically for individuals without access to mainstream finance.",
    },
    features: {
      title: "Why choose Fair Personal Loans?",
      lead: "Designed with your needs in mind",
      items: [
        {
          icon: Clock,
          title: "Quick approval process",
          desc: "Get approval in as little as 24-48 hours with minimal documentation.",
        },
        {
          icon: TrendingUp,
          title: "Affordable interest rates",
          desc: "Competitive rates that won't break your budget, designed for accessibility.",
        },
        {
          icon: Shield,
          title: "Flexible repayment terms",
          desc: "Customize your payment schedule to fit your income and lifestyle.",
        },
        {
          icon: Users,
          title: "Debt advice support",
          desc: "Access to expert financial advisors to help you manage your loan responsibly.",
        },
      ],
    },
    steps: {
      title: "How it works",
      lead: "Simple steps to get your loan",
      items: [
        {
          title: "Apply",
          desc: "Complete a simple online application form with basic information.",
        },
        {
          title: "Verify",
          desc: "Our team verifies your information within 24 hours.",
        },
        {
          title: "Approve",
          desc: "Receive approval and discuss loan terms with a specialist.",
        },
        {
          title: "Receive",
          desc: "Get funds disbursed directly to your bank account.",
        },
      ],
    },
    checklist: {
      title: "Eligibility requirements",
      items: [
        "Must be 18 years or older",
        "Kenyan citizen with a valid national ID",
        "Stable source of income",
        "Active mobile phone number",
        "Business license (for business-related loans)",
        "No pending debt disputes",
      ],
    },
    form: {
      title: "Apply for a Fair Personal Loan",
      lead: "Fill out the form below to submit your application. We review all applications within 24-48 hours.",
    },
    cta: {
      title: "Questions? Get in touch",
      lead: "Our team is here to help. Contact us for more information about Fair Personal Loans.",
    },
  },
  {
    slug: "chama-loans",
    name: "Chama Loans",
    icon: Users,
    summary:
      "Specialized financing for business groups and cooperatives looking to scale operations and support collective growth.",
    actionLabel: "Apply",
    hero: {
      title: "Group financing for collective growth",
      lead: "Specialized financing solutions for business groups and cooperatives. Scale your operations together with competitive rates and comprehensive support.",
    },
    features: {
      title: "Benefits of Chama Loans",
      lead: "Empowering groups to achieve more together",
      items: [
        {
          icon: Users,
          title: "Group-focused financing",
          desc: "Loans designed specifically for business groups, cooperatives, and Chama associations.",
        },
        {
          icon: TrendingUp,
          title: "Capacity building support",
          desc: "We invest in your group's growth with mentorship and strategic guidance.",
        },
        {
          icon: Award,
          title: "Training programs included",
          desc: "Access to financial literacy and business management training for all members.",
        },
        {
          icon: Zap,
          title: "Competitive rates",
          desc: "Special group rates that reward collective borrowing and shared responsibility.",
        },
      ],
    },
    steps: {
      title: "Chama loan process",
      lead: "Streamlined approval for groups",
      items: [
        {
          title: "Group registration",
          desc: "Register your group with Mwamunda with all required documentation.",
        },
        {
          title: "Assessment",
          desc: "We assess your group's financial health and business potential.",
        },
        {
          title: "Loan structuring",
          desc: "Customize loan terms based on your group's specific needs.",
        },
        {
          title: "Disbursement",
          desc: "Receive funds directly to your group's account for immediate use.",
        },
      ],
    },
    checklist: {
      title: "Group requirements",
      items: [
        "Minimum of 5 registered members",
        "Valid group registration documents",
        "Group bank account",
        "Members must be 18 years or older",
        "Group business plan or income source",
        "Group leadership structure",
        "Meeting minutes from past meetings",
      ],
    },
    form: {
      title: "Apply for a Chama Loan",
      lead: "Fill out the form below to submit your group application. We review all applications within 24-48 hours.",
    },
    cta: {
      title: "Questions? Get in touch",
      lead: "Our team is here to help. Contact us for more information about Chama Loans.",
    },
  },
  {
    slug: "debt-advice-services",
    name: "Debt Advice Services",
    icon: LifeBuoy,
    summary:
      "Expert guidance to help you manage and overcome debt challenges, with personalized strategies to improve your financial health.",
    actionLabel: "Request advice",
    hero: {
      title: "Take control of your debt",
      lead: "Expert guidance to help you manage and overcome debt challenges. Our advisors provide personalized strategies to improve your financial health and build a stronger financial future.",
    },
    features: {
      title: "Our debt advice services",
      lead: "Comprehensive solutions tailored to your situation",
      items: [
        {
          icon: FileText,
          title: "Expert debt counseling",
          desc: "One-on-one sessions with experienced financial counselors to assess your situation.",
        },
        {
          icon: TrendingUp,
          title: "Personalized repayment plans",
          desc: "Customized strategies designed to help you pay off debt efficiently and effectively.",
        },
        {
          icon: Heart,
          title: "Financial health assessment",
          desc: "Comprehensive review of your finances to identify challenges and opportunities.",
        },
        {
          icon: LifeBuoy,
          title: "Ongoing guidance and support",
          desc: "Continuous support throughout your debt repayment journey to keep you on track.",
        },
      ],
    },
    steps: {
      title: "How it works",
      lead: "A step-by-step approach to debt freedom",
      items: [
        {
          title: "Assessment",
          desc: "We analyze your debt situation and create a clear picture of your finances.",
        },
        {
          title: "Planning",
          desc: "Develop a realistic and achievable repayment strategy tailored to you.",
        },
        {
          title: "Negotiation",
          desc: "We may help negotiate with creditors for better terms or settlements.",
        },
        {
          title: "Support",
          desc: "Ongoing guidance to ensure you stay on track to debt freedom.",
        },
      ],
    },
    checklist: {
      title: "Benefits of our service",
      items: [
        "Reduced stress through professional guidance",
        "Clear, actionable debt repayment plans",
        "Improved credit score over time",
        "Better negotiation with creditors",
        "Financial literacy and money management skills",
        "Emotional support throughout the process",
        "Customized solutions for your unique situation",
      ],
    },
    form: {
      title: "Request Debt Advice Services",
      lead: "Fill out the form below to apply for our debt advice services. A specialist will contact you within 24-48 hours.",
    },
    cta: {
      title: "Questions? Get in touch",
      lead: "Our debt advice specialists are here to help. Contact us to discuss your financial situation.",
    },
  },
  {
    slug: "financial-capability-training",
    name: "Financial Capability Training",
    icon: GraduationCap,
    summary:
      "Training programs that build financial literacy and essential money management skills for sustainable success.",
    actionLabel: "Enrol",
    hero: {
      title: "Build your financial literacy",
      lead: "Comprehensive training programs designed to empower individuals with essential money management skills for sustainable financial success.",
    },
    features: {
      title: "Our training programs",
      lead: "Diverse learning paths for every financial stage",
      items: [
        {
          icon: BookOpen,
          title: "Money management basics",
          desc: "Learn fundamental principles of budgeting, saving, and spending wisely.",
        },
        {
          icon: TrendingUp,
          title: "Budgeting and savings strategies",
          desc: "Master techniques to create effective budgets and build emergency funds.",
        },
        {
          icon: Award,
          title: "Investment fundamentals",
          desc: "Understand investment options, risks, and how to grow your wealth.",
        },
        {
          icon: Users,
          title: "Financial planning workshops",
          desc: "Interactive sessions on goal-setting, retirement planning, and wealth building.",
        },
      ],
    },
    groups: [
      {
        title: "Training levels",
        lead: "Progression paths for all experience levels",
        items: [
          {
            title: "Beginner",
            desc: "Start your financial literacy journey",
            points: [
              "Basic budgeting",
              "Emergency funds",
              "Savings habits",
              "Understanding credit",
            ],
          },
          {
            title: "Intermediate",
            desc: "Deepen your financial knowledge",
            points: [
              "Investment basics",
              "Tax planning",
              "Debt management",
              "Insurance planning",
            ],
          },
          {
            title: "Advanced",
            desc: "Master wealth creation strategies",
            points: [
              "Portfolio management",
              "Retirement planning",
              "Business finance",
              "Advanced investing",
            ],
          },
        ],
      },
      {
        title: "How we train",
        lead: "Flexible learning options to fit your schedule",
        items: [
          {
            title: "In-person workshops",
            desc: "Interactive group sessions in convenient locations with hands-on learning activities.",
          },
          {
            title: "Online courses",
            desc: "Self-paced learning from anywhere with video lessons, quizzes, and resources.",
          },
          {
            title: "One-on-one coaching",
            desc: "Personalized sessions tailored to your specific financial situation and goals.",
          },
        ],
      },
    ],
    checklist: {
      title: "What you'll gain",
      items: [
        "Confidence in financial decision-making",
        "Practical skills for day-to-day money management",
        "Understanding of personal finance concepts",
        "Ability to plan for future financial goals",
        "Tools to build and maintain good credit",
        "Knowledge to protect yourself financially",
        "Community support from fellow learners",
        "Certificate of completion for your resume",
      ],
    },
    form: {
      title: "Enroll in Financial Capability Training",
      lead: "Fill out the form below to register for our training program. We will contact you to confirm your enrollment within 24 hours.",
    },
    cta: {
      title: "Questions? Get in touch",
      lead: "Our team can answer any questions you have about the program and help you get started on your financial learning journey.",
    },
  },
];

export function getProduct(slug: string): ProductContent {
  const product = products.find((p) => p.slug === slug);
  if (!product) throw new Error(`Unknown product: ${slug}`);
  return product;
}
