import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Toaster } from "@/components/ui/toaster";

// Schema for login form
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isOnline) {
      setNetworkError(
        "You are currently offline. Please check your internet connection."
      );
    } else {
      setNetworkError(null);
    }
  }, [isOnline]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    if (!isOnline) {
      setNetworkError(
        "You are currently offline. Please check your internet connection."
      );
      return;
    }

    setLoading(true);
    setNetworkError(null);

    try {
      await login(values.email, values.password);
      toast({
        title: "Success",
        description: "You have been logged in",
      });
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/designer/products");
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-md">
          <h1 className="text-2xl font-bold text-center mb-8">
            Designer Portal
          </h1>

          {networkError && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{networkError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Welcome Back</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Sign in to access your designer dashboard
              </p>
            </div>

            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your.email@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </main>

      <Toaster />
    </div>
  );
};

export default LoginPage;

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { useAuth } from "@/contexts/AuthContext";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Loader2, AlertTriangle } from "lucide-react";
// import { toast } from "@/components/ui/use-toast";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Toaster } from "@/components/ui/toaster";

// // Schema for login form
// const loginSchema = z.object({
//   email: z.string().email("Please enter a valid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// // Schema for registration form
// const registerSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters"),
//   email: z.string().email("Please enter a valid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
//   confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords do not match",
//   path: ["confirmPassword"],
// });

// type LoginFormValues = z.infer<typeof loginSchema>;
// type RegisterFormValues = z.infer<typeof registerSchema>;

// const LoginPage = () => {
//   const { login, register, isAuthenticated } = useAuth();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("login");
//   const [networkError, setNetworkError] = useState<string | null>(null);
//   const [isOnline, setIsOnline] = useState(navigator.onLine);

//   // Monitor online status
//   useEffect(() => {
//     const handleOnline = () => setIsOnline(true);
//     const handleOffline = () => setIsOnline(false);

//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);

//     return () => {
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, []);

//   useEffect(() => {
//     if (!isOnline) {
//       setNetworkError("You are currently offline. Please check your internet connection.");
//     } else {
//       setNetworkError(null);
//     }
//   }, [isOnline]);

//   // Login form
//   const loginForm = useForm<LoginFormValues>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   // Register form
//   const registerForm = useForm<RegisterFormValues>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//     },
//   });

//   const onLoginSubmit = async (values: LoginFormValues) => {
//     if (!isOnline) {
//       setNetworkError("You are currently offline. Please check your internet connection.");
//       return;
//     }

//     setLoading(true);
//     setNetworkError(null);

//     try {
//       await login(values.email, values.password);
//       toast({
//         title: "Success",
//         description: "You have been logged in",
//       });
//     } catch (error: any) {
//       console.error("Login error:", error);
//       toast({
//         title: "Error",
//         description: error.message,
//         variant: "destructive",
//       });
//     }
//   }

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/designer");
//       toast({
//         title: "Success",
//       })
//     } else {
//       setLoading(false);
//     }
//   },[isAuthenticated]);

//   const onRegisterSubmit = async (values: RegisterFormValues) => {
//     if (!isOnline) {
//       setNetworkError("You are currently offline. Please check your internet connection.");
//       return;
//     }

//     setLoading(true);
//     setNetworkError(null);

//     try{
//       await register(values.name, values.email, values.password);
//       toast({
//         title: "Success",
//         description: "Account created successfully. You can now log in.",
//       });
//       setActiveTab("login");
//       loginForm.setValue("email", values.email);
//       loginForm.setValue("password", values.password);

//     } catch (error) {
//       console.error('Registration error:', error);

//       // Check if it's a network error
//       toast({
//         title: "Error",
//         description: error.message,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Header />
//       <main className="flex-1 py-16">
//         <div className="container mx-auto px-4 max-w-md">
//           <h1 className="text-2xl font-bold text-center mb-8">Designer Portal</h1>

//           {networkError && (
//             <Alert variant="destructive" className="mb-6">
//               <AlertTriangle className="h-4 w-4" />
//               <AlertTitle>Error</AlertTitle>
//               <AlertDescription>{networkError}</AlertDescription>
//             </Alert>
//           )}

//           <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
//             <TabsList className="grid w-full grid-cols-2 mb-8">
//               <TabsTrigger value="login">Login</TabsTrigger>
//               <TabsTrigger value="register">Register</TabsTrigger>
//             </TabsList>

//             <TabsContent value="login">
//               <div className="space-y-6">
//                 <div className="text-center">
//                   <h2 className="text-xl font-semibold">Welcome Back</h2>
//                   <p className="text-sm text-muted-foreground mt-1">
//                     Sign in to access your designer dashboard
//                   </p>
//                 </div>

//                 <Form {...loginForm}>
//                   <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
//                     <FormField
//                       control={loginForm.control}
//                       name="email"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Email</FormLabel>
//                           <FormControl>
//                             <Input placeholder="your.email@example.com" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={loginForm.control}
//                       name="password"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Password</FormLabel>
//                           <FormControl>
//                             <Input type="password" placeholder="••••••••" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <Button type="submit" className="w-full" disabled={loading}>
//                       {loading ? (
//                         <>
//                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                           Signing in...
//                         </>
//                       ) : (
//                         "Sign In"
//                       )}
//                     </Button>
//                   </form>
//                 </Form>
//               </div>
//             </TabsContent>

//             <TabsContent value="register">
//               <div className="space-y-6">
//                 <div className="text-center">
//                   <h2 className="text-xl font-semibold">Create an Account</h2>
//                   <p className="text-sm text-muted-foreground mt-1">
//                     Register to join as a designer
//                   </p>
//                 </div>

//                 <Form {...registerForm}>
//                   <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
//                     <FormField
//                       control={registerForm.control}
//                       name="name"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Full Name</FormLabel>
//                           <FormControl>
//                             <Input placeholder="John Doe" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={registerForm.control}
//                       name="email"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Email</FormLabel>
//                           <FormControl>
//                             <Input placeholder="your.email@example.com" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={registerForm.control}
//                       name="password"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Password</FormLabel>
//                           <FormControl>
//                             <Input type="password" placeholder="••••••••" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={registerForm.control}
//                       name="confirmPassword"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Confirm Password</FormLabel>
//                           <FormControl>
//                             <Input type="password" placeholder="••••••••" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <Button type="submit" className="w-full" disabled={loading}>
//                       {loading ? (
//                         <>
//                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                           Creating account...
//                         </>
//                       ) : (
//                         "Create Account"
//                       )}
//                     </Button>
//                   </form>
//                 </Form>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </main>
//       <Footer />
//       <Toaster />
//     </div>
//   );
// };

// export default LoginPage;
