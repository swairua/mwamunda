export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Shared FAQ content. Used by the /faq page and by the SEO component to
 * generate FAQPage structured data, so the two never drift apart.
 */
export const faqs: FAQItem[] = [
  {
    question: "What is Mwamunda Investment Limited?",
    answer:
      "Mwamunda Investment Limited is a Kenyan microcredit institution founded in 2019. We provide fair, accessible and reliable financial solutions to micro and small businesses, farmers and chamas that are often excluded by mainstream lenders.",
  },
  {
    question: "Who can apply for a loan?",
    answer:
      "Small business owners, traders, farmers, agribusiness actors and chama groups across Kenya can apply. We focus on economically active people whose businesses may be too small or informal for conventional banks.",
  },
  {
    question: "Which products do you offer?",
    answer:
      "We offer Fair Personal Loans, Chama Loans, Debt Advice Services and Financial Capability Training. Each product is designed to support business growth and long-term financial resilience.",
  },
  {
    question: "How quickly are applications reviewed?",
    answer:
      "Our team verifies the information you submit within 24 hours. You can apply online through our contact page, and we will get in touch to guide you through the next steps.",
  },
  {
    question: "How do I apply?",
    answer:
      "Visit our Contact page, choose the product you are interested in and send us your details. You can also call or WhatsApp us on 0789 698 601 for help with your application.",
  },
  {
    question: "What if I'm not sure which product fits me?",
    answer:
      "Talk to us. Our team will listen to your situation and recommend the most suitable product — whether you are an individual entrepreneur, a farmer or a chama.",
  },
  {
    question: "How can I contact Mwamunda?",
    answer:
      "Email info@mwamunda.co.ke or customercare@mwamunda.co.ke, or call/WhatsApp 0789 698 601. You can also send a message through our Contact page.",
  },
];
