import ScrollAnimation from "../../component/ScollerAnimation";

function Explore() {
  
     const images = [
        {src:"https://ubonindia.com/cdn/shop/files/CL-66.jpg?v=1744275661&width=600"},
        {src:"https://cdn.shopify.com/s/files/1/0057/8938/4802/files/AD_181_pro_1.png?v=1745234576"},
        {src:"https://cdn.shopify.com/s/files/1/0057/8938/4802/files/wave_sigma_3_co.png?v=1741770848"},
        {src:"https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Rockerz_650_pp_renders_main_banner.124.png?v=1740735495"}
     ]


    return (
      <>
      <ScrollAnimation from="bottom">
        <h1 className="text-xl md:text-3xl font-semibold text-center mx-auto mt-4">Explore the Tech Gadget Gallery</h1>
        <p className="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto">Tech Gadget Gallery is your one-stop destination for the latest and coolest tech accessories.</p>
        <div className="flex flex-wrap items-center justify-center mt-10 mx-auto gap-4">
            {images.map( (img,index)=>
                 (
                 <img key={index} className="max-w-35 h-50 md:max-w-56 md:h-80 object-cover rounded-lg hover:-translate-y-1 transition-all duration-300" src={img.src} alt="image" />
                 ) 
                 )}
        </div>
        </ScrollAnimation>
        </>
    );
};

export default Explore;