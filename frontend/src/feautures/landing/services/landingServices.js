import faqData from '../data/faq.json';
import featuresData from '../data/content.json'; 

// FAQ verisini getir
export const fetchFaqsApi = () => {
    return faqData; 
};

// Features verisini getir
export const fetchFeaturesApi = () => {
    return featuresData;
};