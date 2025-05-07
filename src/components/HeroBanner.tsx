import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroBanner = () => {
  return (
    <div className="relative bg-furniture-beige py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-furniture-dark">
            Welcome to Decor Haven
          </h1>
          <p className="text-lg md:text-xl mb-8 text-furniture-dark/80">
            Discover our curated collection of elegant furniture pieces designed
            to bring comfort and style to your home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link to="/products">
                Shop Collection <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-full h-full overflow-hidden flex justify-end items-center z-0 opacity-30 md:opacity-50">
        <img
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
          alt="Living room with stylish furniture"
          className="h-full object-cover md:w-2/3"
        />
      </div>
    </div>
  );
};

export default HeroBanner;



// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext";
// import { Button } from "@/components/ui/button";
// import { ArrowRight } from "lucide-react";

// const HeroBanner = () => {
//   const navigate = useNavigate();
//   const { designer } = useAuth();

//   const goToDashboard = () => navigate("/designer/products");
//   return (
//     <div className="relative bg-furniture-beige py-16 md:py-24 overflow-hidden">
//       <div className="container mx-auto px-4 relative z-10">
//         <div className="max-w-2xl">
//           <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-furniture-dark">
//             Welcome to Decor Haven
//           </h1>
//           <p className="text-lg md:text-xl mb-8 text-furniture-dark/80">
//             Discover our curated collection of elegant furniture pieces designed
//             to bring comfort and style to your home.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4"> 
//             <Button size="lg" asChild>
//               <Link to="/products">
//                 Shop Collection <ArrowRight className="ml-2 h-4 w-4" />
//               </Link>
//             </Button>
//             {designer && (
//               <Button onClick={goToDashboard}>Go to Dashboard</Button>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="absolute top-0 right-0 w-full h-full overflow-hidden flex justify-end items-center z-0 opacity-30 md:opacity-50">
//         <img
//           src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
//           alt="Living room with stylish furniture"
//           className="h-full object-cover md:w-2/3"
//         />
//       </div>
//     </div>
//   );
// };

// export default HeroBanner;
