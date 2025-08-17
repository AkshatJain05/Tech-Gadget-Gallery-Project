import logo from "../assets/logoImg2.png"
import { Link } from "react-router-dom";
const Footer = () => {
    const linkSections = [
        {
            title: "Quick Links",
            links: ["Home", "Best Sellers", "Offers & Deals", "Contact Us", "FAQs"]
        },
        {
            title: "Need Help?",
            links: ["Delivery Information", "Return & Refund Policy", "Payment Methods", "Track your Order", "Contact Us"]
        },
        {
            title: "Follow Us",
            links: ["Instagram", "Twitter", "Facebook", "YouTube"]
        }
    ];

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 bg-gradient-to-bl from-slate-950 to-gray-950 mt-10">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-400">
                <div>
                    <img className="h-12 sm:h-16 md:h-18" src={logo} alt="dummyLogoColored" />
                    <p className="max-w-[410px] mt-6">
Tech Gadget Gallery is your one-stop destination for the latest and coolest tech accessories. From chargers and smartwatches to headphones and mobile covers, explore a wide range of gadgets designed to make your life smarter and more stylish.</p>
                </div>
                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                    {linkSections.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-base text-gray-300 md:mb-5 mb-2">{section.title}</h3>
                            <ul className="text-sm space-y-1">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <Link to="/" className="hover:underline transition">{link}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <p className="py-4 text-center text-sm md:text-base text-gray-300">
                Copyright 2025 © <Link to="">Tech Gallery Gadget</Link> All Right Reserved.
            </p>
        </div>
    );
};

export default Footer